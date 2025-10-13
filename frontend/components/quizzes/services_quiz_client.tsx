"use client";

import { useState, useEffect } from "react";
import { getQuestions } from "@/actions/get_question";
import { Question } from "@/types/question";
import Image from "next/image";
import { GameOver } from "./game_over";
import { CheckCircle, Heart, HeartCrack } from "lucide-react";
import { TagsList } from "../ui/tag";
import { QuizProgressBar } from "./quiz_progress_bar";
import { ServiceCommandInput } from "./service_command_input";

interface ServicesQuizClientProps {
  mode: "written" | "multiple-choice";
}

export const ServicesQuizClient = ({ mode }: ServicesQuizClientProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answeredQuestionIds, setAnsweredQuestionIds] = useState<string[]>([]);
  const [userAnswer, setUserAnswer] = useState("");
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [choices, setChoices] = useState<string[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [answerHistory, setAnswerHistory] = useState<boolean[]>([]);

  const currentQuestion = questions[currentQuestionIndex];
  const questionNumber = score + (3 - lives) + 1; // Current question number

  const fetchQuestions = async (excludeIds: string[] = []) => {
    setIsLoading(true);
    setError(null);

    const response = await getQuestions("service", 10, excludeIds);

    if (response.success && response.questions) {
      setQuestions(response.questions);
      setCurrentQuestionIndex(0);

      // Generate choices for the first question if in multiple-choice mode
      if (mode === "multiple-choice" && response.questions.length > 0) {
        generateChoices(response.questions[0]);
      }
    } else {
      setError(response.error || "Failed to fetch questions");
    }

    setIsLoading(false);
  };

  const generateChoices = (question: Question) => {
    if (mode === "multiple-choice" && question.related_services) {
      const correctAnswer = question.service_name;
      const wrongAnswers = question.related_services
        .filter((service) => service !== correctAnswer)
        .slice(0, 3);

      const allChoices = [correctAnswer, ...wrongAnswers];
      const shuffled = allChoices.sort(() => Math.random() - 0.5);
      setChoices(shuffled);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentQuestion) return;

    let correct = false;

    if (mode === "written") {
      if (!userAnswer.trim()) return;
      correct =
        userAnswer.trim().toLowerCase() ===
        currentQuestion.service_name.toLowerCase();
    } else {
      if (!selectedChoice) return;
      correct = selectedChoice === currentQuestion.service_name;
    }

    setIsCorrect(correct);
    setIsAnswered(true);
    setAnswerHistory([...answerHistory, correct]);

    // Add current question ID to answered list
    setAnsweredQuestionIds([
      ...answeredQuestionIds,
      currentQuestion.service_id,
    ]);

    if (correct) {
      setScore(score + 1);
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives === 0) {
        setGameOver(true);
      }
    }
  };

  const handleProceed = async () => {
    if (gameOver) {
      setScore(0);
      setLives(3);
      setGameOver(false);
      setAnsweredQuestionIds([]);
      setAnswerHistory([]);
      await fetchQuestions();
      return;
    }

    // Reset answer state
    setUserAnswer("");
    setSelectedChoice(null);
    setIsAnswered(false);

    // Check if we need to fetch more questions
    if (currentQuestionIndex >= questions.length - 3) {
      // Fetch more questions when we're near the end
      await fetchQuestions(answeredQuestionIds);
    } else {
      // Move to next question
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);

      // Generate choices for the next question if in multiple-choice mode
      if (mode === "multiple-choice" && questions[nextIndex]) {
        generateChoices(questions[nextIndex]);
      }
    }
  };

  const handleRestart = async () => {
    setScore(0);
    setLives(3);
    setGameOver(false);
    setAnsweredQuestionIds([]);
    setAnswerHistory([]);
    setCurrentQuestionIndex(0);
    await fetchQuestions();
  };

  if (gameOver) {
    return GameOver({ score, handleRestart });
  }

  return (
    <div className="max-w-2xl mx-auto p-6 h-[100dvh] flex justify-center items-center relative">
      <QuizProgressBar history={answerHistory} />

      <div className="bg-card border-amazon-border border-[1px] text-primary rounded-lg shadow-lg p-8">
        {/* Score and Lives */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col gap-1">
            <div className="text-sm text-gray-400">
              Question #{questionNumber}
            </div>
            <div className="text-xl font-semibold">
              Score: <span className="text-amazon-orange">{score}</span>
            </div>
          </div>
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                {i < lives ? (
                  <Heart className="w-8 h-8 fill-red-400 text-red-400" />
                ) : (
                  <HeartCrack className="w-8 h-8 text-gray-300 animate-pulse" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amazon-orange mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading questions...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Question Display */}
        {!isLoading && currentQuestion && !isAnswered && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">
              What AWS service is this?
            </h3>
            <p className="text-muted-text mb-6 leading-relaxed">
              {currentQuestion.description}
            </p>

            <form onSubmit={handleSubmit}>
              {mode === "written" ? (
                <>
                  <ServiceCommandInput
                    value={userAnswer}
                    onChange={setUserAnswer}
                    onSubmit={() => {
                      if (userAnswer.trim()) {
                        handleSubmit(new Event("submit") as any);
                      }
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!userAnswer.trim()}
                    className="w-full font-semibold cursor-pointer bg-amazon-orange text-black px-6 py-3 rounded-lg hover:bg-dark-amazon-orange transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed mt-4"
                  >
                    Submit Answer
                  </button>
                </>
              ) : (
                <>
                  <div className="space-y-3 mb-4">
                    {choices.map((choice, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setSelectedChoice(choice)}
                        className={`w-full cursor-pointer px-4 py-3 border-2 rounded-lg font-semibold text-left transition-colors ${
                          selectedChoice === choice
                            ? "border-blue-border bg-blue-background"
                            : "bg-option-background border-transparent hover:border-blue-border"
                        }`}
                      >
                        {choice}
                      </button>
                    ))}
                  </div>
                  <button
                    type="submit"
                    disabled={!selectedChoice}
                    className="w-full cursor-pointer bg-amazon-orange text-black font-semibold px-6 py-3 rounded-lg hover:bg-dark-amazon-orange transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Submit Answer
                  </button>
                </>
              )}
            </form>
          </div>
        )}

        {/* Answer Result */}
        {!isLoading && currentQuestion && isAnswered && (
          <div>
            <div
              className={`mb-6 p-4 rounded-lg ${
                isCorrect
                  ? "bg-green-background border-2 border-green-border"
                  : "bg-red-100 border-2 border-red-400"
              }`}
            >
              <p
                className={`text-base text-primary font-semibold flex items-center gap-x-2`}
              >
                <CheckCircle
                  className={`w-4 h-4 ${
                    isCorrect ? "text-green-border" : "text-red-700"
                  }`}
                />
                {isCorrect ? "Correct! 🎉" : "Incorrect ❌"}
              </p>
              {!isCorrect && (
                <p className="text-gray-700 mt-2">
                  Your answer:{" "}
                  <span className="font-semibold">
                    {mode === "written" ? userAnswer : selectedChoice}
                  </span>
                </p>
              )}
            </div>

            <div className="mb-6">
              {currentQuestion.service_icon && (
                <div className="mb-4 flex justify-start">
                  <Image
                    src={currentQuestion.service_icon}
                    alt={currentQuestion.service_name}
                    width={80}
                    height={80}
                    style={{ borderRadius: "2px" }}
                  />
                </div>
              )}
              <h3 className="text-2xl font-bold text-primary mb-2">
                {currentQuestion.service_name}
              </h3>
              <p className="mb-4 text-muted-text">
                {currentQuestion.description}
              </p>

              {currentQuestion.tags && currentQuestion.tags.length > 0 && (
                <TagsList tags={currentQuestion.tags} />
              )}
            </div>

            <button
              onClick={handleProceed}
              className="w-full cursor-pointer bg-amazon-orange text-black font-semibold px-6 py-3 rounded-lg hover:bg-dark-amazon-orange transition-colors"
            >
              Next Question
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

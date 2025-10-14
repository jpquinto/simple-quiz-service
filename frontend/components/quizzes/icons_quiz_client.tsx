"use client";

import { useState, useEffect } from "react";
import { getQuestions } from "@/actions/get_question";
import { Question } from "@/types/question";
import { GameOver } from "./game_over";
import { Heart, HeartCrack } from "lucide-react";
import { QuizProgressBar } from "./quiz_progress_bar";
import { ServiceCommandInput } from "./service_command_input";
import { ServiceInfo } from "./service_info";
import { isAnswerCorrect } from "@/utils/check_answer";

export const IconsQuizClient = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answeredQuestionIds, setAnsweredQuestionIds] = useState<string[]>([]);
  const [userAnswer, setUserAnswer] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [answerHistory, setAnswerHistory] = useState<boolean[]>([]);

  const currentQuestion = questions[currentQuestionIndex];
  const questionNumber = score + (3 - lives) + 1;

  const fetchQuestions = async (excludeIds: string[] = []) => {
    setIsLoading(true);
    setError(null);

    const response = await getQuestions("service", 10, excludeIds);

    if (response.success && response.questions) {
      setQuestions(response.questions);
      setCurrentQuestionIndex(0);
    } else {
      setError(response.error || "Failed to fetch questions");
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentQuestion || !userAnswer.trim()) return;

    const correct = isAnswerCorrect(userAnswer, currentQuestion.service_name);

    setIsCorrect(correct);
    setIsAnswered(true);
    setAnswerHistory([...answerHistory, correct]);

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

    setUserAnswer("");
    setIsAnswered(false);

    if (currentQuestionIndex >= questions.length - 3) {
      await fetchQuestions(answeredQuestionIds);
    } else {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
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
    <div className="min-w-2xl max-w-2xl mx-auto p-6 h-[100dvh] flex justify-center items-center relative">
      <QuizProgressBar history={answerHistory} />

      <div className="min-w-[39rem] bg-card border-amazon-border border-[1px] text-primary rounded-lg shadow-lg p-8">
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

        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amazon-orange mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading questions...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!isLoading && currentQuestion && !isAnswered && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary text-center">
              What AWS service is this?
            </h3>

            {/* Icon Display */}
            <div className="flex justify-center mb-6">
              <img
                src={currentQuestion.service_icon}
                alt="AWS Service Icon"
                className="w-32 h-32 object-contain"
              />
            </div>

            <form onSubmit={handleSubmit}>
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
            </form>
          </div>
        )}

        {!isLoading && currentQuestion && isAnswered && (
          <ServiceInfo
            question={currentQuestion}
            isCorrect={isCorrect}
            userAnswer={userAnswer}
            onProceed={handleProceed}
          />
        )}
      </div>
    </div>
  );
};

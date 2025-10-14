import Image from "next/image";
import Link from "next/link";
import { CheckCircle, ExternalLink } from "lucide-react";
import { TagsList } from "../ui/tag";
import { Question } from "@/types/question";

interface ServiceInfoProps {
  question: Question;
  isCorrect: boolean;
  userAnswer: string;
  onProceed: () => void;
}

export const ServiceInfo = ({
  question,
  isCorrect,
  userAnswer,
  onProceed,
}: ServiceInfoProps) => {
  return (
    <div>
      {/* Answer Result Banner */}
      <div
        className={`mb-6 p-4 rounded-lg ${
          isCorrect
            ? "bg-green-background border-2 border-green-border"
            : "bg-red-background border-2 border-red-border"
        }`}
      >
        <p
          className={`text-base text-primary font-semibold flex items-center gap-x-2`}
        >
          <CheckCircle
            className={`w-4 h-4 ${
              isCorrect ? "text-green-border" : "text-red-border"
            }`}
          />
          {isCorrect ? "Correct! 🎉" : "Incorrect"}
        </p>
        {!isCorrect && (
          <p className="text-primary mt-2">
            Your answer: <span className="font-semibold">{userAnswer}</span>
          </p>
        )}
      </div>

      {/* Service Details */}
      <div className="mb-6">
        {question.service_icon && (
          <div className="mb-4 flex justify-start">
            <Image
              src={question.service_icon}
              alt={question.service_name}
              width={80}
              height={80}
              style={{ borderRadius: "2px" }}
            />
          </div>
        )}
        <h3 className="text-2xl font-bold text-primary mb-2">
          {question.service_name}
        </h3>
        <p className="mb-4 text-muted-text">{question.description}</p>
        <div className="mb-4 flex justify-start items-center">
          <Link
            href={question.link_to_amazon}
            target="_blank"
            rel="noopener noreferrer"
            className="text-light-blue font-semibold hover:underline"
          >
            Learn more
          </Link>
          <ExternalLink className="text-light-blue inline-block w-4 h-4 ml-1" />
        </div>

        {question.tags && question.tags.length > 0 && (
          <TagsList tags={question.tags} />
        )}
      </div>

      {/* Next Question Button */}
      <button
        onClick={onProceed}
        className="w-full cursor-pointer bg-amazon-orange text-black font-semibold px-6 py-3 rounded-lg hover:bg-dark-amazon-orange transition-colors"
      >
        Next Question
      </button>
    </div>
  );
};

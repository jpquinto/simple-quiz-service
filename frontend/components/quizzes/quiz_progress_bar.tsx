import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";

interface QuizProgressBarProps {
  history: boolean[]; // true for correct, false for incorrect
}

export const QuizProgressBar = ({ history }: QuizProgressBarProps) => {
  const [displayHistory, setDisplayHistory] = useState<boolean[]>([]);
  const MAX_VISIBLE = 10;

  useEffect(() => {
    if (history.length > displayHistory.length) {
      // Add new item with a small delay for animation
      setDisplayHistory(history);
    }
  }, [history, displayHistory.length]);

  if (displayHistory.length === 0) return null;

  // Get the last 15 items
  const visibleHistory = displayHistory.slice(-MAX_VISIBLE);
  const startIndex = Math.max(0, displayHistory.length - MAX_VISIBLE);

  // Calculate opacity for fade effect on top items
  const getOpacity = (index: number) => {
    const isNewItem = index === visibleHistory.length - 1;
    if (isNewItem) return 0; // Will be animated in

    if (visibleHistory.length < MAX_VISIBLE) return 1;

    // Fade out the top 3 items gradually
    if (index === 0) return 0.2;
    if (index === 1) return 0.4;
    if (index === 2) return 0.6;

    return 1;
  };

  return (
    <div className="absolute -right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2">
      {visibleHistory.map((isCorrect, index) => (
        <div
          key={startIndex + index}
          style={{
            animation: `slideIn 0.3s ease-out ${
              index === visibleHistory.length - 1 ? "0s" : "0s"
            }`,
            opacity: getOpacity(index),
            animationFillMode: "forwards",
          }}
          className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
            isCorrect
              ? "bg-green-background border-2 border-green-border"
              : "bg-red-100 border-2 border-red-400"
          }`}
        >
          {isCorrect ? (
            <Check className="w-4 h-4 text-green-border" />
          ) : (
            <X className="w-4 h-4 text-red-700" />
          )}
        </div>
      ))}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

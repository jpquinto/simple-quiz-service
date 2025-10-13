"use client";

import { ServicesQuizClient } from "@/components/quizzes/services_quiz_client";
import Container from "@/components/ui/container";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function ServicesQuizPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = searchParams.get("mode") as "written" | "multiple-choice" | null;
  const [selectedMode, setSelectedMode] = useState<
    "written" | "multiple-choice" | null
  >(null);

  const handleModeSelect = (selectedMode: "written" | "multiple-choice") => {
    setSelectedMode(selectedMode);
    router.push(`/quizzes/services?mode=${selectedMode}`);
  };

  if (!mode) {
    return (
      <main className="flex-1">
        <div>
          <Container className="-translate-y-10 relative overflow-visible">
            <div className="max-w-2xl mx-auto p-6 h-[100dvh] flex justify-center items-center">
              <div className="bg-card border-[#2c323b] border-[1px] text-primary rounded-lg shadow-lg p-8 w-full">
                <h2 className="text-2xl font-bold text-primary mb-2 text-center">
                  AWS Services Quiz
                </h2>
                <p className="text-[#84A4AD] mb-8 text-center">
                  Choose your quiz mode to get started
                </p>

                <div className="space-y-4">
                  <button
                    onClick={() => handleModeSelect("multiple-choice")}
                    className="w-full p-6 bg-[#1B232D] border-2 border-transparent hover:border-[#328CC9] rounded-lg transition-colors text-left"
                  >
                    <h3 className="text-xl font-semibold text-primary mb-2">
                      Multiple Choice
                    </h3>
                    <p className="text-[#84A4AD]">
                      Choose from 4 options for each service description
                    </p>
                  </button>

                  <button
                    onClick={() => handleModeSelect("written")}
                    className="w-full p-6 bg-[#1B232D] border-2 border-transparent hover:border-[#328CC9] rounded-lg transition-colors text-left"
                  >
                    <h3 className="text-xl font-semibold text-primary mb-2">
                      Written Answer
                    </h3>
                    <p className="text-[#84A4AD]">
                      Type the exact service name from the description
                    </p>
                  </button>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <div>
        <Container className="-translate-y-10 relative overflow-visible">
          <ServicesQuizClient mode={mode} />
        </Container>
      </div>
    </main>
  );
}

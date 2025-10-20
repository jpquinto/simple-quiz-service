"use client";

import Container from "@/components/ui/container";
import Link from "next/link";

export default function QuizzesPage() {

    return (
      <main className="flex-1">
        <div>
          <Container className="-translate-y-10 relative overflow-visible">
            <div className="max-w-2xl mx-auto p-6 h-[100dvh] flex justify-center items-center">
              <div className="bg-card border-[#2c323b] border-[1px] text-primary rounded-lg shadow-lg p-8 w-full">
                <h2 className="text-2xl font-bold text-amazon-orange mb-2 text-center">
                  AWS Quizzes
                </h2>
                <p className="text-[#84A4AD] mb-8 text-center">
                  Choose your quiz to get started!
                </p>

                <div className="my-3">
                  <Link
                    href="/quizzes/services"
                    className="w-full cursor-pointer p-6 bg-[#1B232D] border-2 border-transparent hover:border-[#328CC9] hover:bg-blue-background rounded-lg transition-colors text-left flex flex-col"
                  >
                    <h3 className="text-xl font-semibold text-primary mb-2">
                      AWS Services
                    </h3>
                    <p className="text-[#84A4AD]">
                      Test your knowledge on the various AWS services
                    </p>
                  </Link>
                </div>

                <div className="my-3">
                  <Link
                    href="/quizzes/acronyms"
                    className="w-full cursor-pointer p-6 bg-[#1B232D] border-2 border-transparent hover:border-[#328CC9] hover:bg-blue-background rounded-lg transition-colors text-left flex flex-col"
                  >
                    <h3 className="text-xl font-semibold text-primary mb-2">
                      AWS Icons
                    </h3>
                    <p className="text-[#84A4AD]">
                      Identify AWS services based on their icons
                    </p>
                  </Link>
                </div>

                <div className="my-3">
                  <Link
                    href="/quizzes/services"
                    className="w-full cursor-pointer p-6 bg-[#1B232D] border-2 border-transparent hover:border-[#328CC9] hover:bg-blue-background rounded-lg transition-colors text-left flex flex-col"
                  >
                    <h3 className="text-xl font-semibold text-primary mb-2">
                      AWS Acronyms
                    </h3>
                    <p className="text-[#84A4AD]">
                      Test your knowledge on AWS service acronyms
                    </p>
                  </Link>
                </div>

                <p className="text-[#84A4AD] mb-8 text-center">
                  More coming soon!
                </p>
              </div>
            </div>
          </Container>
        </div>
      </main>
    );
}

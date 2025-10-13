"use client";

import { AcronymQuizClient } from "@/components/quizzes/acronyms_quiz_client";
import Container from "@/components/ui/container";

export default function AcronymsQuizPage() {

  return (
    <main className="flex-1">
      <div>
        <Container className="-translate-y-10 relative overflow-visible">
          <AcronymQuizClient />
        </Container>
      </div>
    </main>
  );
}

"use client";

import { IconsQuizClient } from "@/components/quizzes/icons_quiz_client";
import Container from "@/components/ui/container";

export default function IconsQuizPage() {
  return (
    <main className="flex-1">
      <div>
        <Container className="-translate-y-10 relative overflow-visible">
          <IconsQuizClient />
        </Container>
      </div>
    </main>
  );
}

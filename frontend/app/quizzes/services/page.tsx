
import { ServicesQuizClient } from "@/components/quizzes/services_quiz_client";
import Container from "@/components/ui/container";

export default function ServicesQuizPage() {
  return (
    <main className="flex-1">
      <div>
        <Container className="-translate-y-10 relative overflow-visible z-[999]">
            <ServicesQuizClient mode={"multiple-choice"} />
        </Container>
      </div>
    </main>
  );
}

import QuizForm from "@/components/QuizForm/QuizForm";
import { AuthGuard } from "@/components/AuthGuard";

export default function AddQuizPage() {
  return (
    <AuthGuard allowedRoles={["admin", "teacher"]}>
      <main className="container mx-auto py-8">
        <QuizForm />
      </main>
    </AuthGuard>
  );
}

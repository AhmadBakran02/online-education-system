// components/QuizList.tsx
"use client";

import { Quiz } from "@/types/quiz";

interface QuizListProps {
  quizzes?: Quiz[] | null; // Explicitly allow null
  loading?: boolean;
  error?: string | null;
}

export default function QuizList2({
  quizzes = null, // Default to null
  loading = false,
  error = null,
}: QuizListProps) {
  // const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);

  // Loading state
  if (loading) {
    return <div className="text-center py-8">Loading quizzes...</div>;
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Error: {error}
      </div>
    );
  }

  // Null/empty state
  if (!quizzes || quizzes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No quizzes available yet.</p>
      </div>
    );
  }

  // Main render
  return (
    <div className="space-y-4">
      {quizzes.map((quiz) => (
        <div key={quiz._id} className="p-4 border rounded-lg relative">
          {/* <button
            onClick={() => setEditingQuiz(quiz)}
            className="absolute top-2 right-2 p-1 text-blue-600 hover:text-blue-800"
          >
            Edit
          </button> */}
          <h2 className="text-xl font-bold">{quiz.title}</h2>
          {/* Rest of quiz content */}
        </div>
      ))}
      {/* 
      {editingQuiz && (
        <EditQuizModal
          quiz={editingQuiz}
          onClose={() => setEditingQuiz(null)}
          onSave={function (updatedQuiz: EditQuizPayload): Promise<void> {
            throw new Error("Function not implemented.");
          }} // onSave={handleEditQuiz}
        />
      )} */}
    </div>
  );
}

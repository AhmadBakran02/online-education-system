"use client";

import { useState } from "react";
import { Quiz, EditQuizPayload } from "@/types/quiz";

interface EditQuizModalProps {
  quiz: Quiz;
  onClose: () => void;
  onSave: (updatedQuiz: EditQuizPayload) => Promise<void>;
}

export default function EditQuizModal({
  quiz,
  onClose,
  onSave,
}: EditQuizModalProps) {
  const [formData, setFormData] = useState<EditQuizPayload>({
    quizID: quiz._id,
    title: quiz.title,
    description: quiz.description,
    questions: quiz.questions.map((q) => ({
      text: q.text,
      options: [...q.options],
      correctAnswer: q.correctAnswer,
      _id: q._id,
    })),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
    onClose();
  };

  // Add similar handlers for questions/options as in your create form
  // ...

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
        <h2 className="text-xl font-bold mb-4">Edit Quiz</h2>
        <form onSubmit={handleSubmit}>
          {/* Title Field */}
          <div className="mb-4">
            <label className="block mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Questions List */}
          {formData.questions.map((question, qIndex) => (
            <div key={qIndex} className="mb-4 p-4 border rounded">
              {/* Question editing fields */}
            </div>
          ))}

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

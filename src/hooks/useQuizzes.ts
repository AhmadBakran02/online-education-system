// hooks/useQuizzes.ts
import { useState, useEffect } from "react";
import { Quiz } from "@/types/quiz";
import { apiUrl } from "@/components/url";

export function useQuizzes() {
  const [quizzes, setQuizzes] = useState<Quiz[] | null>(null); // Initialize as null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token") || "";
      const response = await fetch(apiUrl + `/quiz/get/all`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify({
          page: 1,
          limit: 10,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // console.log(data.qui)
      setQuizzes(data.quizes || []); // Ensure we always get an array
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      setQuizzes([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  return { quizzes, loading, error, refetch: fetchQuizzes };
}

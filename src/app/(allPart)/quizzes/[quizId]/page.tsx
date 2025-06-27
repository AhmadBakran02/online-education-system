// app/quizzes/[quizId]/page.tsx
"use client";
import "../../../globals.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Quiz } from "@/types/quiz";
import { apiUrl } from "@/components/url";
import Image from "next/image";
import Loading from "@/components/loading/Loading";
import QuestionCard from "@/components/question-card/QuestionCard";
import "./style.css";

export default function QuizPage() {
  const params = useParams(); // Get params from useParams hook
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem("token") || "";
        const quizId = params.quizId as string; // Type assertion

        const response = await fetch(apiUrl + `/quiz/get`, {
          method: "POST", // Changed to POST since you're sending body
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify({ quizID: quizId }),
        });

        if (!response.ok) throw new Error("Failed to fetch quiz");

        const data = await response.json();
        // console.log(data.quiz)
        setQuiz(data.quiz);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [params.quizId]);

  // const handleAnswerSelect = (questionId: string, optionIndex: number) => {
  //   setUserAnswers((prev) => ({
  //     ...prev,
  //     [questionId]: optionIndex,
  //   }));
  // };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const calculateScore = () => {
    if (!quiz) return 0;
    return quiz.questions.reduce((score, question) => {
      return (
        score + (userAnswers[question._id] === question.correctAnswer ? 1 : 0)
      );
    }, 0);
  };

  if (loading) return <Loading />;
  if (error)
    return <div className="text-red-500 text-center py-8">Error: {error}</div>;
  if (!quiz) return <div className="text-center py-8">Quiz not found</div>;

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <button onClick={() => router.push("/quizzes")} className="back-button">
        <Image src={"../arrow-left.svg"} width={30} height={30} alt="" />
        Back to Quizzes
      </button>

      <h1 className="text-2xl font-bold mb-2 capitalize">{quiz.title}</h1>
      <p className="text-gray-600 mb-6 capitalize">{quiz.description}</p>

      <div className="all-questions">
        {quiz.questions.map((question) => (
          <QuestionCard
            key={question._id}
            id={question._id}
            question={question.text}
            text={question.text}
            options={question.options}
          />
        ))}
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(userAnswers).length !== quiz.questions.length}
          className="submitted-button"
        >
          Submit Answers
        </button>
      ) : (
        <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-center mb-2">
            Quiz Results
          </h3>
          <div className="text-3xl font-bold text-center mb-4">
            {calculateScore()} / {quiz.questions.length}
          </div>
          <p className="text-center text-gray-600">
            {calculateScore() === quiz.questions.length
              ? "Perfect score! 🎉"
              : calculateScore() >= quiz.questions.length / 2
              ? "Good job! 👍"
              : "Keep practicing! 💪"}
          </p>
        </div>
      )}
      {/* {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(userAnswers).length !== quiz.questions.length}
          className={`mt-6 px-6 py-3 rounded-lg text-white font-medium w-full ${
            Object.keys(userAnswers).length === quiz.questions.length
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Submit Answers
        </button>
      ) : (
        <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-center mb-2">
            Quiz Results
          </h3>
          <div className="text-3xl font-bold text-center mb-4">
            {calculateScore()} / {quiz.questions.length}
          </div>
          <p className="text-center text-gray-600">
            {calculateScore() === quiz.questions.length
              ? "Perfect score! 🎉"
              : calculateScore() >= quiz.questions.length / 2
              ? "Good job! 👍"
              : "Keep practicing! 💪"}
          </p>
        </div>
      )} */}
    </div>
  );
}

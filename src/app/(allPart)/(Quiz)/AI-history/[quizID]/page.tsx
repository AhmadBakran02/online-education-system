"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { QuizAiHistory } from "@/types/quiz";
import { apiUrl } from "@/components/url";
import Image from "next/image";
import Loading from "@/components/loading/Loading";
import QuizError from "../../quizzes/[quizId]/QuizError";
import Cookies from "js-cookie";
import "./style.css";

export default function QuizPage() {
  // const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [userAnswers2] = useState<Record<string, number>>({});
  const [quiz, setQuiz] = useState<QuizAiHistory | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [submitted] = useState<boolean>(true);
  const [id, setId] = useState<string>("");
  const [answers] = useState<boolean[]>([]);
  const [message] = useState<string>("");
  const [score] = useState<number>(0);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const newId = pathname.split("/")[2];
    setId(newId);
  }, [pathname]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        if (!id) return;
        console.log(id);
        const token = Cookies.get("token") || "";

        const response = await fetch(apiUrl + `/quiz/AI?quizID=${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch quiz");

        const data = await response.json();
        setQuiz(data.quiz);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    };

    fetchQuiz();
  }, [id]);

  if (loading && !error) return <Loading />;
  // if (error)
  //   return <div className="text-red-500 text-center py-8">Error: {error}</div>;
  // if (!quiz) return <div className="text-center py-8">Quiz not found</div>;
  if (error) return <QuizError />;

  return (
    <div className="quiz-container mx-auto p-4 max-w-2xl">
      <button onClick={() => router.push("/quizzes")} className="back-button">
        <Image src={"../arrow-left.svg"} width={30} height={30} alt="" />
        Back to Quizzes
      </button>
      <div className="quiz-header">
        <div className="title-and-score">
          <h1 className="text-2xl font-bold mb-2 capitalize">{quiz?.title}</h1>

          <div
            className={`result ${score > 59 ? "good-result" : "bad-result"}`}
          >
            <p className={`score ${score > 59 ? "good-score" : "bad-score"}`}>
              {score}%
            </p>
            <p className="score-message">
              {score > 89
                ? "Perfect score! 🎉"
                : score > 59
                ? "Good job! 👍"
                : "Keep practicing! 💪"}
            </p>
          </div>
        </div>
        <p className="text-gray-600 mb-6 capitalize">{quiz?.description}</p>
      </div>

      <div className="all-questions">
        {quiz?.questions.map((question, index2) => (
          <div className="question-box" key={question._id}>
            <h3 className="question">{question.text}</h3>
            <div className="answer">
              {question.options.map((option, index) => (
                <div key={index} className="choice">
                  <input
                    type="radio"
                    id={`${question._id}-${index}`}
                    name={question._id}
                    disabled={submitted}
                    className="input-choice radio-modern"
                  />
                  <label
                    htmlFor={`${question._id}-${index}`}
                    className={` cursor-pointer capitalize ${
                      !answers[index2] && userAnswers2[index2] == index
                        ? "text-red-400"
                        : ""
                    } ${
                      question.correctAnswer == index ? "text-green-400" : ""
                    }`}
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {message && <div className="select-all">{message}</div>}
    </div>
  );
}

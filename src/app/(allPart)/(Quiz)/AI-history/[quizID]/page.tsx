"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { QuizHistoryInfo, QuizHistorySub } from "@/types/quiz";
import { apiUrl } from "@/components/url";
import Image from "next/image";
import Loading from "@/components/loading/Loading";
import QuizError from "../../quizzes/[quizId]/QuizError";
import Cookies from "js-cookie";
import "./style.css";

export default function QuizPage() {
  // const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [quizInfo, setQuizInfo] = useState<QuizHistoryInfo | null>(null);
  const [quizSub, setQuizSub] = useState<QuizHistorySub | null>(null);
  const [id, setId] = useState<string>("");
  const [message] = useState<string>("");
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

        const response = await fetch(
          apiUrl + `/quiz/AI/submission?submissionID=${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              token: token,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch quiz");

        const data = await response.json();
        setQuizInfo(data.quizInfo);
        setQuizSub(data.submission);
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
          <h1 className="text-2xl font-bold mb-2 capitalize">
            {quizInfo?.title}
          </h1>

          <div
            className={`result ${
              (quizSub?.score || 0) > 59 ? "good-result" : "bad-result"
            }`}
          >
            <p
              className={`score ${
                (quizSub?.score || 0) > 59 ? "good-score" : "bad-score"
              }`}
            >
              {quizSub?.score}%
            </p>
            <p className="score-message">
              {(quizSub?.score || 0) > 89
                ? "Perfect score! 🎉"
                : (quizSub?.score || 0) > 59
                ? "Good job! 👍"
                : "Keep practicing! 💪"}
            </p>
          </div>
        </div>
        <p className="text-gray-600 mb-6 capitalize">{quizInfo?.description}</p>
      </div>

      <div className="all-questions">
        {quizInfo?.questions.map((question, index2) => (
          <div className="question-box" key={question._id}>
            <h3 className="question">{question.text}</h3>
            <div className="answer">
              {question.options.map((option, index) => (
                <div key={index} className="choice">
                  <input
                    type="radio"
                    id={`${question._id}-${index}`}
                    name={question._id}
                    disabled={true}
                    className="input-choice radio-modern"
                    checked={quizSub?.answers[index2] == index}
                  />
                  <label
                    htmlFor={`${question._id}-${index}`}
                    className={` cursor-pointer capitalize ${
                      quizSub?.answers[index2] == index ? "text-red-400" : ""
                    } ${
                      question.correctAnswer == index ? "text-green-400!" : ""
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

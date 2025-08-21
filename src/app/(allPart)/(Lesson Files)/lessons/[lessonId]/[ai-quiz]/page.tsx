"use client";
import "../../../../../globals.css";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Quiz } from "@/types/quiz";
import { apiUrl } from "@/components/url";
import Image from "next/image";
import Loading from "@/components/loading/Loading";
import "./style.css";
import Cookies from "js-cookie";
import Loading4 from "@/components/loading4/Loading4";

export default function QuizPage() {
  const params = useParams();
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [userAnswers2, setUserAnswers2] = useState<Record<string, number>>({});
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>();
  const [submiting, setSubmiting] = useState<boolean>();
  const [score, setScore] = useState<number>(0);
  const router = useRouter();
  const pathname = usePathname();
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [submitted, setSubmitted] = useState<boolean>();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = Cookies.get("token") || "";

        const response = await fetch(
          apiUrl + `/quiz/AI/generate?lessonID=${pathname.split("/")[2]}`,
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
        // console.log(data.quiz)
        setQuiz(data.quiz);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [params.quizId, pathname]);

  const answersArray: number[] = Object.keys(userAnswers)
    .sort((a, b) => parseInt(a) - parseInt(b))
    .map((key) => userAnswers[key]);

  const submitSolution = async () => {
    setSubmiting(true);
    // console.log(answersArray);
    try {
      console.log("start-2");
      console.log(answersArray);
      console.log(quiz?._id);
      const response = await fetch(apiUrl + `/quiz/AI/submit-solution`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: Cookies.get("token") || "",
        },
        body: JSON.stringify({
          answers: answersArray,
          quizID: quiz?._id,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      setSuccess(true);

      setAnswers(data.isCorrect);
      setUserAnswers2(userAnswers);
      setUserAnswers({});
      setScore(data.score);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
      console.log(error);
    } finally {
      setSubmiting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(userAnswers).length != quiz?.questions.length) {
      setMessage("Please answer all questions before submitting");
      return;
    }
    submitSolution();
  };

  const handleAnswerSelect = (questionId: number, optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  if (loading) return <Loading />;
  if (error)
    return <div className="text-red-500 text-center py-8">Error: {error}</div>;
  if (!quiz) return <div className="text-center py-8">Quiz not found</div>;

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <button onClick={() => router.push("/quizzes")} className="back-button">
        <Image src={"/arrow-left.svg"} width={30} height={30} alt="" />
        Back to Quizzes
      </button>
      <div className="quiz-header">
        <div className="title-and-score">
          <h1 className="text-2xl font-bold mb-2 capitalize">{quiz.title}</h1>
          {success && (
            <div
              className={`result ${score > 59 ? "good-result" : "bad-result"}`}
            >
              <p className={`score ${score > 59 ? "good-score" : "bad-score"}`}>
                {score}%
              </p>
              <p className="score-message">
                {score > 59 ? "Good job! 👍" : "Keep practicing! 💪"}
              </p>
            </div>
          )}
        </div>
        <p className="text-gray-600 mb-6 capitalize">{quiz.description}</p>
      </div>

      <div className="all-questions">
        {quiz.questions.map((question, index2) => (
          <div className="question-box" key={question._id}>
            <h3 className="question">{question.text}</h3>
            <div className="answer">
              {question.options.map((option, index) => (
                <div key={index} className="choice">
                  <div className="input-radio">
                    <input
                      type="radio"
                      id={`${question._id}-${index}`}
                      name={question._id}
                      onChange={() => handleAnswerSelect(index2, index)}
                      className="radio-modern"
                    />
                  </div>
                  <label
                    htmlFor={`${question._id}-${index}`}
                    className={`${
                      success &&
                      !answers[index2] &&
                      userAnswers2[index2] == index
                        ? "text-red-400"
                        : ""
                    } ${
                      success &&
                      answers[index2] &&
                      userAnswers2[index2] == index
                        ? "text-green-400"
                        : ""
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

      <button
        onClick={handleSubmit}
        className="submitted-button"
        disabled={submitted}
      >
        {!submiting ? (
          "Submit Answers"
        ) : (
          <div className="mt-1">
            <Loading4 />
          </div>
        )}
      </button>
      {message && <div className="select-all">{message}</div>}
    </div>
  );
}

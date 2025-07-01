"use client";
import "../../../../globals.css";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Quiz } from "@/types/quiz";
import { apiUrl } from "@/components/url";
import Image from "next/image";
import Loading from "@/components/loading/Loading";
import "./style.css";

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
  // const getLessonID = () => {
  //   const newId = pathname.split("/")[2];
  //   setId(newId);
  //   console.log(newId);
  //   return newId;
  // };

  // useEffect(() => {
  //   const newId = pathname.split("/")[2];
  //   setId(newId);
  //   console.log(newId);
  // }, [pathname]);

  useEffect(() => {
    // console.log(id);

    const fetchQuiz = async () => {
      // const lID = getLessonID();
      // if (!lID) return;

      try {
        const token = localStorage.getItem("token") || "";
        // const quizId = params.quizId as string; // Type assertion

        const response = await fetch(
          apiUrl + `/quiz/AI/generate?lessonID=${pathname.split("/")[2]}`,
          {
            method: "GET", // Changed to POST since you're sending body
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
          token: localStorage.getItem("token") || "",
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

      // Handle successful login
      setSuccess(true);
      // console.log("successful ");
      // console.log(data.score);
      // console.log(data.isCorrect);
      setAnswers(data.isCorrect);
      setUserAnswers2(userAnswers);
      setUserAnswers({});
      setScore(data.score);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
      console.log(error);
    } finally {
      setSubmiting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // console.log(quiz?.questions.length);
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

  // console.log(userAnswers);

  // const calculateScore = () => {
  //   if (!quiz) return 0;
  //   return quiz.questions.reduce((score, question) => {
  //     return (
  //       score + (userAnswers[question._id] === question.correctAnswer ? 1 : 0)
  //     );
  //   }, 0);
  // };

  if (loading) return <Loading />;
  if (error)
    return <div className="text-red-500 text-center py-8">Error: {error}</div>;
  if (!quiz) return <div className="text-center py-8">Quiz not found</div>;
  console.log(answers);
  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <button onClick={() => router.push("/quizzes")} className="back-button">
        <Image src={"../arrow-left.svg"} width={30} height={30} alt="" />
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
                  <input
                    type="radio"
                    id={`${question._id}-${index}`}
                    name={question._id}
                    onChange={() => handleAnswerSelect(index2, index)}
                    className="input-choice"
                  />
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

      <button onClick={handleSubmit} className="submitted-button">
        {!submiting ? "Submit Answers" : "Submiting..."}
      </button>
      {message && <div className="select-all">{message}</div>}

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

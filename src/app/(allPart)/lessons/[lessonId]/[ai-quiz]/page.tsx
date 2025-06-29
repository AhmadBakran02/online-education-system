"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Quiz } from "@/types/quiz";
import { apiUrl } from "@/components/url";
import Image from "next/image";
import Loading from "@/components/loading/Loading";
// import QuestionCard from "@/components/question-card/QuestionCard";
import "./style.css";
// import Success from "../../Success/success-text";

export default function QuizPage() {
  const params = useParams(); // Get params from useParams hook
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  // const [submitted, setSubmitted] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>();
  const [submiting, setSubmiting] = useState<boolean>();
  const [score, setScore] = useState<number>(0);
  const router = useRouter();
  const pathname = usePathname();
  // const [id, setId] = useState<string>("");

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
    console.log(answersArray);
    try {
      console.log("start-2");
      console.log(answersArray);
      console.log(quiz?._id);
      const response = await fetch(apiUrl + `/quiz/submit-solution`, {
        method: "POST",
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
      console.log("successful ");
      console.log(data.score);
      setScore(data.score);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
      console.log(error);
    } finally {
      // setLoading(false);
      setSubmiting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitSolution();
  };

  const handleAnswerSelect = (questionId: number, optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  console.log(userAnswers);

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

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <button onClick={() => router.push("/quizzes")} className="back-button">
        <Image src={"../arrow-left.svg"} width={30} height={30} alt="" />
        Back to Quizzes
      </button>
      <div className="quiz-header">
        <div className="title-and-description">
          <h1 className="text-2xl font-bold mb-2 capitalize">{quiz.title}</h1>
          <p className="text-gray-600 mb-6 capitalize">{quiz.description}</p>
        </div>
        {success && (
          <div
            className={`result ${score > 59 ? "good-result" : "bad-result"}`}
          >
            <p className={`score ${score > 59 ? "good-score" : "bad-score"}`}>
              {score}%
            </p>
            {score > 59 ? <p>Good job! 👍</p> : <p>Keep practicing! 💪</p>}
          </div>
        )}
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
                    // disabled={submitted}
                    className="input-choice"
                  />
                  <label htmlFor={`${question._id}-${index}`}>{option}</label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={Object.keys(userAnswers).length !== quiz.questions.length}
        className="submitted-button"
      >
        {!submiting ? "Submit Answers" : "Submiting..."}
      </button>
    </div>
  );
}

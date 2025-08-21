"use client";

import { useState, useEffect } from "react";
import { Quiz, QuizResponse } from "@/types/quiz";
import "./style.css";
import "../../../globals.css";
import { apiUrl } from "@/components/url";
import Loading from "@/components/loading/Loading";
import QuizCard from "@/components/quiz-card/QuizCard";
import QuizzesError from "./QuizzesError";
import Cookies from "js-cookie";
import Link from "next/link";

export default function QuizListPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [activeTab, setActiveTab] = useState<string>("all");

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = Cookies.get("token") || "";
        const response = await fetch(apiUrl + "/quiz/all?page=1&limit=800", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch quizzes");

        const data: QuizResponse = await response.json();
        console.log(data.quizzes);
        setQuizzes(data.quizzes);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const filteredTasks = quizzes.filter((task) => {
    return activeTab === "all" || task.category === activeTab;
  });

  // if (loading) return <Loading />;

  if (error) return <QuizzesError errorType={error} />;

  const categories = [
    { id: "all", label: "All" },
    { id: "programming", label: "Programming" },
    { id: "math", label: "Math" },
    { id: "english", label: "English" },
    { id: "physics", label: "Physics" },
  ];

  return (
    <div className="quizzes-container mx-auto p-4">
      {/* -----------Quizzes Header----------- */}
      <div className="quizzes-header">
        <h3>Quizzes</h3>
        <p>
          Test your knowledge and track your progress with interactive quizzes.
        </p>
      </div>

      {/* -----------Select Category----------- */}
      <div className="select-task my-3">
        <div className="quiz-tabs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={activeTab === cat.id ? "active" : ""}
              onClick={() => setActiveTab(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* -----------Quizzes List----------- */}
      <div className="task-list my-2.5 cursor-pointer">
        {loading && <Loading />}
        {!loading && filteredTasks.length > 0
          ? filteredTasks.map((task) => (
              <Link key={task._id} href={`/quizzes/${task._id}`}>
                <QuizCard
                  key={task._id}
                  id={task._id}
                  title={task.title}
                  description={task.description}
                  createdAt={task.createdAt}
                  category={task.category}
                  edit={false}
                  student={true}
                  list={false}
                  isAt={task.isAtTodoList}
                />
              </Link>
            ))
          : !loading && (
              <div className="no-tasks">
                <p>No quizzes found matching your criteria</p>
              </div>
            )}
      </div>
    </div>
  );
}

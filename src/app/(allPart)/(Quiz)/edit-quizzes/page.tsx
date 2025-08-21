"use client";

import { useState, useEffect } from "react";
// import Link from "next/link";
import { Quiz, QuizResponse } from "@/types/quiz";
import "./style.css";
import "../../../globals.css";
import { apiUrl } from "@/components/url";
import Loading from "@/components/loading/Loading";
import QuizCard from "@/components/quiz-card/QuizCard";
import { AuthGuard } from "@/components/AuthGuard";
import Cookies from "js-cookie";

export default function QuizListPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState<
    "all" | "programming" | "math" | "english" | "physics"
  >("all");

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = Cookies.get("token") || "";
        const response = await fetch(apiUrl + "/quiz/my?page=1&limit=800", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch quizzes");

        const data: QuizResponse = await response.json();
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

  if (loading) return <Loading />;
  if (error)
    return <div className="text-red-500 text-center py-8">Error: {error}</div>;

  return (
    <AuthGuard allowedRoles={["admin", "teacher"]}>
      <div className="quizzes-container mx-auto p-4">
        {/* -----------Quizzes Header----------- */}
        <div className="lessons-header">
          <h3 className="font-semibold text-2xl">Quizzes</h3>
          <p className="text-[#737373] text-sm">
            Test your knowledge and track your progress with interactive
            quizzes.
          </p>
        </div>

        {/* -----------Select Category----------- */}
        <div className="select-task my-3">
          <div className="edit-quiz-tabs">
            <button
              className={`edit-quiz-category ${
                activeTab === "all" ? "active" : ""
              }`}
              onClick={() => setActiveTab("all")}
            >
              All
            </button>
            <button
              className={`edit-quiz-category ${
                activeTab === "programming" ? "active" : ""
              }`}
              onClick={() => setActiveTab("programming")}
            >
              Programming
            </button>
            <button
              className={`edit-quiz-category ${
                activeTab === "math" ? "active" : ""
              }`}
              onClick={() => setActiveTab("math")}
            >
              Math
            </button>
            <button
              className={`edit-quiz-category ${
                activeTab === "english" ? "active" : ""
              }`}
              onClick={() => setActiveTab("english")}
            >
              English
            </button>
            <button
              className={`edit-quiz-category ${
                activeTab === "physics" ? "active" : ""
              }`}
              onClick={() => setActiveTab("physics")}
            >
              Physics
            </button>
          </div>
        </div>

        {/* -----------Quizzes List----------- */}
        <div className="task-list my-2.5 cursor-pointer">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <QuizCard
                key={task._id}
                id={task._id}
                title={task.title}
                description={task.description}
                createdAt={task.createdAt}
                category={task.category}
                edit={true}
                student={false}
                list={false}
                isAt={false}
              />
            ))
          ) : (
            <div className="no-tasks">
              <p>No quizzes found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}

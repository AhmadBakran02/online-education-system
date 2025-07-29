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

  // const handleEnterQuiz = (quizid: string) => {
  //   window.location.href = `/quizzes/${quizid}`;
  // };
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
          <h3>Quizzes</h3>
          <p>
            Test your knowledge and track your progress with interactive
            quizzes.
          </p>
        </div>

        {/* -----------Select Category----------- */}
        <div className="select-task my-3">
          <div className="tabs">
            <button
              className={activeTab === "all" ? "active" : ""}
              onClick={() => setActiveTab("all")}
            >
              All
            </button>
            <button
              className={activeTab === "programming" ? "active" : ""}
              onClick={() => setActiveTab("programming")}
            >
              Programming
            </button>
            <button
              className={activeTab === "math" ? "active" : ""}
              onClick={() => setActiveTab("math")}
            >
              Math
            </button>
            <button
              className={activeTab === "english" ? "active" : ""}
              onClick={() => setActiveTab("english")}
            >
              English
            </button>
            <button
              className={activeTab === "physics" ? "active" : ""}
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
              // <div
              //   key={task._id}
              //   className={`task-card completed medium`}
              //   onClick={() => handleEnterQuiz(task._id)}
              // >
              //   <div className="task-content">
              //     <h3 className="!text-black font-medium capitalize !mb-1.5">
              //       {task.title}
              //     </h3>
              //     <p className="text-gray-700 !mb-3.5">{task.description}</p>
              //     <p className="task-course capitalize">{task.category}</p>
              //     <div className="task-meta">
              //       <span className="due-date">
              //         <svg
              //           xmlns="http://www.w3.org/2000/svg"
              //           width="14"
              //           height="14"
              //           viewBox="0 0 24 24"
              //           fill="none"
              //           stroke="currentColor"
              //           strokeWidth="2"
              //           strokeLinecap="round"
              //           strokeLinejoin="round"
              //         >
              //           <rect
              //             x="3"
              //             y="4"
              //             width="18"
              //             height="18"
              //             rx="2"
              //             ry="2"
              //           ></rect>
              //           <line x1="16" y1="2" x2="16" y2="6"></line>
              //           <line x1="8" y1="2" x2="8" y2="6"></line>
              //           <line x1="3" y1="10" x2="21" y2="10"></line>
              //         </svg>
              //         {task.createdAt?.split("T")[0] || "N/A"}
              //       </span>
              //       {/* <span className={`priority ${task.priority}`}>
              //         {task.priority}
              //       </span> */}
              //     </div>
              //   </div>
              // </div>
              <QuizCard
                key={task._id}
                id={task._id}
                title={task.title}
                description={task.description}
                createdAt={task.createdAt}
                category={task.category}
                edit={true} student={false}              />
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

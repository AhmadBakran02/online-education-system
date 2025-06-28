"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Quiz, QuizResponse } from "@/types/quiz";
import "./style.css";
import "../../globals.css";
import { apiUrl } from "@/components/url";
import Loading from "@/components/loading/Loading";

export default function QuizListPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem("token") || "";
        const response = await fetch(
          apiUrl + "/quiz/get/all?page=1&limit=800",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              token: token,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch quizzes");

        const data: QuizResponse = await response.json();
        setQuizzes(data.quizes);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  if (loading) return <Loading />;
  if (error)
    return <div className="text-red-500 text-center py-8">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Available Quizzes</h1>
      <div className="task-list">
        {quizzes.length > 0 ? (
          quizzes.map((task) => (
            <div key={task._id} className={`task-card completed medium`}>
              <div className="task-content">
                <Link href={`/quizzes/${task._id}`}>
                  <h3>{task.title}</h3>
                </Link>
                <p className="task-course">English</p>
                <div className="task-meta">
                  <span className="due-date">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect
                        x="3"
                        y="4"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"
                      ></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    {task.createdAt?.split("T")[0] || "N/A"}
                  </span>
                  {/* <span className={`priority ${task.priority}`}>
                    {task.priority}
                  </span> */}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-tasks">
            <p>No tasks found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}

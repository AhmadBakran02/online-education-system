"use client";

import { useState, useEffect } from "react";
import { TodoList, TodoListResponse } from "@/types/quiz";
import "./style.css";
import "../../../globals.css";
import { apiUrl } from "@/components/url";
import Loading from "@/components/loading/Loading";
import QuizzesError from "../../(Quiz)/quizzes/QuizzesError";
import Cookies from "js-cookie";

export default function QuizList() {
  const [todoList, setTodoList] = useState<TodoList[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = Cookies.get("token") || "";
        const response = await fetch(apiUrl + "/quiz/todo/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch quizzes");

        const data: TodoListResponse = await response.json();
        setTodoList(data.myTodoList);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  if (error) return <QuizzesError errorType={error} />;

  return (
    <div className="task-list my-2.5 cursor-pointer ">
      {loading && <Loading />}
      {!loading && todoList.length > 0
        ? todoList.map((task) => (
            <div key={task._id} className={`task-card completed`}>
              <div className="task-content">
                <div className="quiz-header">
                  <h3 className="!text-black font-medium capitalize">
                    {"task.title"}
                  </h3>
                </div>
                <p className="text-gray-700 !mb-3.5 ">{"description"}</p>
                <p className="task-course capitalize">{"category"}</p>

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
                    {task.date?.split("T")[0] || "N/A"}
                  </span>
                  {/* <span className={`priority ${task.priority}`}>
                      {task.priority}
                    </span> */}
                </div>
              </div>
            </div>
          ))
        : !loading && (
            <div className="no-tasks">
              <p>No quizzes found matching your criteria</p>
            </div>
          )}
    </div>
  );
}

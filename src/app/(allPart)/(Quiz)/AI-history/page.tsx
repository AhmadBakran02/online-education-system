"use client";
import { useState, useEffect, useCallback } from "react";
import "./style.css";
import "../../../globals.css";
import { apiUrl } from "@/components/url";
import Loading from "@/components/loading/Loading";
import QuizzesError from "../quizzes/QuizzesError";
import Cookies from "js-cookie";
import { HistoryType } from "@/types/type";
import Link from "next/link";

export default function QuizHistory() {
  const [historyItems, setHistoryItems] = useState<HistoryType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error] = useState<string>("");

  const [activeTab, setActiveTab] = useState<
    "all" | "programming" | "math" | "english" | "physics"
  >("all");
  // Memoized fetch function
  const handleGetMyHistory = useCallback(async () => {
    setLoading(true);
    try {
      const token = Cookies.get("token") || "";
      const response = await fetch(
        apiUrl + `/quiz/AI/submission/all/my?page=1&limit=1000`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      setHistoryItems(data.submissions);
      return data;
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []); // Dependencies that affect the API call

  // Initial data fetch
  useEffect(() => {
    handleGetMyHistory();
  }, [handleGetMyHistory]); // Now includes the required dependency

  const filteredTasks = historyItems?.filter(() => {
    return activeTab === "all" || "math" === activeTab;
  });

  // if (loading) return <Loading />;

  if (error) return <QuizzesError errorType={error} />;

  return (
    <div className="quizzes-container mx-auto p-4">
      {/* -----------Quizzes Header----------- */}
      <div className="quizzes-header">
        <h3 className="font-semibold text-2xl">Quizzes</h3>
        <p className="text-sm text-[#737373]">
          Test your knowledge and track your progress with interactive quizzes.
        </p>
      </div>

      {/* -----------Select Category----------- */}
      <div className="select-task my-3">
        <div className="quiz-tabs">
          <button
            className={`select-category-quiz ${
              activeTab === "all" ? "active" : ""
            }`}
            onClick={() => setActiveTab("all")}
          >
            All
          </button>
          <button
            className={`select-category-quiz ${
              activeTab === "programming" ? "active" : ""
            }`}
            onClick={() => setActiveTab("programming")}
          >
            Programming
          </button>
          <button
            className={`select-category-quiz ${
              activeTab === "math" ? "active" : ""
            }`}
            onClick={() => setActiveTab("math")}
          >
            Math
          </button>
          <button
            className={`select-category-quiz ${
              activeTab === "english" ? "active" : ""
            }`}
            onClick={() => setActiveTab("english")}
          >
            English
          </button>
          <button
            className={`select-category-quiz ${
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
        {loading && <Loading />}
        {!loading && filteredTasks?.length > 0
          ? filteredTasks.map((task) => (
              <Link key={task.quizID} href={`AI-history/${task._id}`}>
                <div className={`task-card completed medium `}>
                  <div className="task-content">
                    <div className="quiz-header">
                      <h3 className="font-medium capitalize text-lg">
                        {task.title}
                      </h3>

                      {task.score >= 0 && (
                        <div
                          className={`border rounded p-1  ${
                            task.score > 59
                              ? "bg-green-200 text-green-500"
                              : "bg-red-200 text-red-500"
                          }`}
                        >
                          {task.score}%
                        </div>
                      )}
                    </div>

                    <p className="task-course capitalize">{task.category}</p>
                  </div>
                </div>
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

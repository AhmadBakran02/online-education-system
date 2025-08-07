"use client";
import { useState, useEffect, useCallback } from "react";
import "./style.css";
import "../../../globals.css";
import { apiUrl } from "@/components/url";
import Loading from "@/components/loading/Loading";
import QuizzesError from "../quizzes/QuizzesError";
import Cookies from "js-cookie";
import { HistoryType } from "@/types/type";

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
      const response = await fetch(apiUrl + `/quiz/submission`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token,
        },
      });

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
  }, [handleGetMyHistory]);

  const filteredTasks = historyItems?.filter(() => {
    return activeTab === "all" || "math" === activeTab;
  });

  // if (loading) return <Loading />;

  if (error) return <QuizzesError errorType={error} />;

  return (
    <div className="history-container mx-auto p-4">
      {/* -----------Quizzes Header----------- */}
      <div className="history-header-page">
        <h3>Quizzes History</h3>
        <p>
          Here, you can review all your previous quiz attempts, track your
          progress, and see how you&apos;ve improved over time.
        </p>
      </div>

      {/* -----------Select Category----------- */}
      <div className="select-task my-3">
        <div className="select-history-tabs">
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
      <div className="history-list my-2.5 cursor-pointer">
        {loading && <Loading />}
        {!loading && filteredTasks?.length > 0
          ? filteredTasks.map((task) => (
              <div key={task._id} className={`history-card completed medium `}>
                <div className="history-content">
                  <div className="history-header">
                    <h3 className="!text-black font-medium capitalize">
                      asdas
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

                  <p className="history-course capitalize">math</p>
                </div>
              </div>
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

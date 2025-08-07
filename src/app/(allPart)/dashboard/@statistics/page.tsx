"use client";
import { useCallback, useEffect, useState } from "react";
import "./style.css";
import "../../../globals.css";
import { apiUrl } from "@/components/url";
import Cookies from "js-cookie";
import { QuizStatisticsResponse } from "../../../../types/statistics";
import ProgressBar from "@/components/ProgressBar";
import Link from "next/link";
import Loading from "@/components/loading/Loading";

export default function Statistics() {
  const [loading, setLoading] = useState<boolean>(true);
  const [statistics, setStatistics] = useState<QuizStatisticsResponse>({
    statisticsByCategory: { math: 20 },
    AIStatisticsByCategory: { math: 20 },
  });
  const [aiScore, setAiScore] = useState<number>(0);
  const [score, setScore] = useState<number>(0);

  const calculateAverage = useCallback(
    (aiStats: Record<string, number>): number => {
      const values = Object.values(aiStats);
      const filteredValues = values.filter(
        (val, idx) => Object.keys(aiStats)[idx] !== "undefined"
      );
      if (filteredValues.length === 0) return 0;
      const sum = filteredValues.reduce((acc, score) => acc + score, 0);
      return Math.round((sum / filteredValues.length) * 10) / 10;
    },
    []
  );

  const getStatistics = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(apiUrl + `/quiz/statistics`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json", // Fixed typo
          token: Cookies.get("token") || "",
        },
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setStatistics(data);
      setAiScore(calculateAverage(data.statistics.AIStatisticsByCategory));
      setScore(calculateAverage(data.statistics.statisticsByCategory));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [calculateAverage]);

  useEffect(() => {
    getStatistics();
  }, [getStatistics]);

  if (loading) return <Loading />;
  console.log(statistics);
  return (
    //   <div className="all-progress">
    //     <div className="assignments-completed progress-box">
    //       <h3>AI Quiz Average</h3>
    //       <p>{aiScore}%</p>
    //     </div>
    //     <div className="assignments-completed progress-box">
    //       <h3>Math Score</h3>
    //       <p>{score}%</p>
    //     </div>
    //   </div>
    // </div>
    <div className="dashboard-progress">
      <h2 className="text-xl font-bold mb-6">Your Learning Progress</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/dashboard/AI-quiz-performance">
          <div className="progress-box p-4 bg-white rounded-lg shadow">
            <h3 className="font-semibold mb-2">AI Quiz Performance</h3>
            <div className="text-3xl font-bold mb-2">{aiScore.toFixed(1)}%</div>
            <ProgressBar value={aiScore} color="bg-purple-500" height={8} />
            <div className="mt-2 text-sm text-gray-500">
              Average across all AI quizzes
            </div>
          </div>
        </Link>
        <Link href="/dashboard/quiz-performance">
          <div className="progress-box p-4 bg-white rounded-lg shadow">
            <h3 className="font-semibold mb-2">Quiz Performance</h3>
            <div className="text-3xl font-bold mb-2">{score.toFixed(1)}%</div>
            <ProgressBar value={score} color="bg-blue-500" height={8} />
            <div className="mt-2 text-sm text-gray-500">
              Your current math score
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

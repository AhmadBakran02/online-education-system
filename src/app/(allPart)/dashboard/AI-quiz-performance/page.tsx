"use client";
import { useCallback, useEffect, useState } from "react";
import "./style.css";
import { QuizStatisticsResponse } from "@/types/statistics";
import { apiUrl } from "@/components/url";
import Cookies from "js-cookie";
import ProgressBar from "@/components/ProgressBar";
import Link from "next/link";
import Loading from "@/components/loading/Loading";

export default function AIQuisPerformace() {
  const [loading, setLoading] = useState<boolean>(true);
  const [statistics, setStatistics] = useState<QuizStatisticsResponse>({
    statisticsByCategory: { math: 20 },
    AIStatisticsByCategory: { math: 20 },
  });
  const [aiScore, setAiScore] = useState<number>(70);
  const [programmingScore, setProgrammingScore] = useState<number>(22);
  const [englishScore, setEnglishScore] = useState<number>(63);
  const [mathScore, setMathScore] = useState<number>(30);
  const [physicsScore, setPhysicsScore] = useState<number>(40);

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
      setMathScore(data.statistics.AIStatisticsByCategory.math);
      setEnglishScore(data.statistics.AIStatisticsByCategory.english);
      setProgrammingScore(data.statistics.AIStatisticsByCategory.proggramming);
      setPhysicsScore(data.statistics.AIStatisticsByCategory.physics);
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
    <div className="dashboard-progress">
      <h2 className="text-xl font-bold mb-6">Your Learning Progress</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="progress-box p-4 bg-white rounded-lg shadow">
          <h3 className="font-semibold mb-2">AI Quiz Performance</h3>
          <div className="text-3xl font-bold mb-2">{aiScore.toFixed(1)}%</div>
          <ProgressBar value={aiScore} color="bg-green-500" height={8} />
          <div className="mt-2 text-sm text-gray-500">
            Average across all AI quizzes
          </div>
        </div>

        {programmingScore && (
          <Link href={"/AI-history"}>
            <div className="progress-box p-4 bg-white rounded-lg shadow">
              <h3 className="font-semibold mb-2">
                Programming Quiz Performance
              </h3>
              <div className="text-3xl font-bold mb-2">{programmingScore}%</div>
              <ProgressBar
                value={programmingScore}
                color="bg-violet-500"
                height={8}
              />
              <div className="mt-2 text-sm text-gray-500">
                Average across all Programming quizzes
              </div>
            </div>
          </Link>
        )}
        {englishScore && (
          <Link href={"/AI-history"}>
            <div className="progress-box p-4 bg-white rounded-lg shadow">
              <h3 className="font-semibold mb-2">English Quiz Performance</h3>
              <div className="text-3xl font-bold mb-2">{englishScore}%</div>
              <ProgressBar
                value={englishScore}
                color="bg-teal-500"
                height={8}
              />
              <div className="mt-2 text-sm text-gray-500">
                Average across all English quizzes
              </div>
            </div>
          </Link>
        )}
        {mathScore && (
          <Link href={"/AI-history"}>
            <div className="progress-box p-4 bg-white rounded-lg shadow">
              <h3 className="font-semibold mb-2">Math Quiz Performance</h3>
              <div className="text-3xl font-bold mb-2">{mathScore}%</div>
              <ProgressBar
                value={mathScore}
                color="bg-fuchsia-500"
                height={8}
              />
              <div className="mt-2 text-sm text-gray-500">
                Average across all Math quizzes
              </div>
            </div>
          </Link>
        )}
        {physicsScore && (
          <Link href={"/AI-history"}>
            <div className="progress-box p-4 bg-white rounded-lg shadow">
              <h3 className="font-semibold mb-2">Physics Quiz Performance</h3>
              <div className="text-3xl font-bold mb-2">{physicsScore}%</div>
              <ProgressBar
                value={physicsScore}
                color="bg-blue-500"
                height={8}
              />
              <div className="mt-2 text-sm text-gray-500">
                Average across all Physics quizzes
              </div>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}

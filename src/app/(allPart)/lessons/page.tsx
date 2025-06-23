"use client";
import "./style.css";
import { Card } from "../lessons-card/lessons-card";
import { useEffect, useState, useCallback } from "react";
import Loading from "../loading/Loading";
import { LessonsType } from "../../interfaces/type";

interface NumPage {
  page: string;
  limit: string;
}

export default function Lessons() {
  const [activeTab, setActiveTab] = useState<
    "all" | "programming" | "math" | "english" | "physics"
  >("all");
  const [lessonsItems, setLessonsItems] = useState<LessonsType[]>([]);
  const [numPage, setNumPage] = useState<NumPage>({
    page: "1",
    limit: "10",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [numberOfLessons, setNumberOfLessons] = useState<number>(0);

  // Check authentication
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
      }
    }
  }, []);

  const handleGetNumber = useCallback(async () => {
    setLoading(true);
    setError(null);
    console.log(error);

    try {
      const token = localStorage.getItem("token") || "";
      const response = await fetch(
        `https://online-education-system-quch.onrender.com/lesson/number-of-lessons`,
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
      setNumPage((prev) => ({ ...prev, limit: data.numberOfLessons }));
      setNumberOfLessons(data.numberOfLessons);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Request failed:", errorMessage);
    } finally {
      setLoading(false);
    }
  }, [error]); // Removed error from dependencies since we're using local variable

  const handleGetAllLessons = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token") || "";
      const response = await fetch(
        `https://online-education-system-quch.onrender.com/lesson/all?page=${
          numPage.page
        }&limit=${numberOfLessons || numPage.limit}`,
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
      setLessonsItems(data.lessons);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Request failed:", errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [numPage.page, numPage.limit, numberOfLessons]); // Added numberOfLessons to dependencies

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      await handleGetNumber();
      await handleGetAllLessons();
    };
    fetchData();
  }, [handleGetNumber, handleGetAllLessons]);

  const filteredTasks = lessonsItems.filter((task) => {
    return activeTab === "all" || task.category === activeTab;
  });

  return (
    <div className="lessons-container">
      <div className="lessons-header">
        <h3>Lessons</h3>
        <p>
          Access your course materials, assignments, and practice questions.
        </p>
      </div>
      <div className="lessons-search">
        <input
          type="search"
          placeholder="Search lessons, assignments, or questions.."
        />
        <select id="subjects" name="subjects">
          <option value="all-subject">All levels</option>
          <option value="value2">beginner</option>
          <option value="value3">Intermediate</option>
          <option value="value4">Advanced</option>
        </select>
      </div>
      <div className="select-task">
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
      <div className="lessons-main">
        {loading && <Loading />}
        {filteredTasks.length > 0
          ? filteredTasks.map((item) => (
              <Card
                key={item._id}
                title={item.title}
                description={item.description}
                id={item._id}
                action={"add"}
                isIn={item.isInLibrary}
                pdfID={item.pdfID}
                videoID={item.videoID}
              />
            ))
          : !loading && (
              <h3>No lessons found matching your search criteria.</h3>
            )}
      </div>
    </div>
  );
}

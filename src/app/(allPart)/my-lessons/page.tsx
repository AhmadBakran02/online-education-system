"use client";
import { Card } from "../../../components/lessons-card/lessons-card";
import "./style.css";
import { useEffect, useState, useCallback } from "react";
import Loading from "../../../components/loading/Loading";
import { LessonsType, NumPage } from "../../interfaces/type";
import { apiUrl } from "@/components/url";

export default function MyLessons() {
  const [lessonsItems, setLessonsItems] = useState<LessonsType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [numPage] = useState<NumPage>({
    page: "1",
    limit: "20",
  });

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  // Memoized fetch function
  const handleGetMyLibrary = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || "";
      const response = await fetch(
        apiUrl+`/lesson/library/all?limit=${numPage.limit}&page=${numPage.page}`,
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
      setLessonsItems(data.lessonMyLibrary);
      return data;
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [numPage.limit, numPage.page]); // Dependencies that affect the API call

  // Initial data fetch
  useEffect(() => {
    handleGetMyLibrary();
  }, [handleGetMyLibrary]); // Now includes the required dependency

  return (
    <div className="my-lessons">
      <h1>My Lessons</h1>
      <div className="search">
        <input type="search" placeholder="Search by Id coures" />
        <button className="btn">Search</button>
      </div>

      <div className="lesson-cards">
        {loading && <Loading />}
        <ul>
          {Array.isArray(lessonsItems) && lessonsItems.length > 0
            ? lessonsItems.map((item) => (
                <Card
                  key={item._id}
                  title={item.title}
                  description={item.description}
                  id={item._id}
                  pdfID={item.pdfID}
                  videoID={item.videoID}
                  action={"remove"}
                />
              ))
            : !loading && (
                <div className="no-tasks">
                  <p>No tasks found matching your criteria</p>
                </div>
              )}
        </ul>
      </div>
    </div>
  );
}

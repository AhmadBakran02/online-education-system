"use client";
import { Card } from "@/components/lessons-card/lessons-card";
import "./style.css";
import { useEffect, useState, useCallback } from "react";
import Loading from "@/components/loading/Loading";
import { LessonsType, NumPage } from "../../../../types/type";
import { apiUrl } from "@/components/url";
import Cookies from "js-cookie";

export default function MyLessons() {
  const [lessonsItems, setLessonsItems] = useState<LessonsType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [numPage] = useState<NumPage>({
    page: "1",
    limit: "120",
  });

  // Memoized fetch function
  const handleGetMyLibrary = useCallback(async () => {
    setLoading(true);
    try {
      const token = Cookies.get("token") || "";
      const response = await fetch(
        apiUrl +
          `/lesson/library/all?limit=${numPage.limit}&page=${numPage.page}`,
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

  const filteredLessonsSearch = lessonsItems.filter((lesson) =>
    lesson.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="my-lessons">
      <h1>My Lessons</h1>
      <div className="search">
        <input
          type="search"
          placeholder="Search by Id coures"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn">Search</button>
      </div>
      {loading && (
        <div className="loading-cards">
          <Loading />
        </div>
      )}
      <div className="lesson-cards">
        <ul>
          {!loading &&
          Array.isArray(filteredLessonsSearch) &&
          filteredLessonsSearch.length > 0
            ? lessonsItems.map((item) => (
                <Card
                  key={item._id}
                  title={item.title}
                  description={item.description}
                  id={item._id}
                  action={"remove"}
                  level={item.level}
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

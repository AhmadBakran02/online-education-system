"use client";

import { Card } from "@/components/lessons-card/lessons-card";
import Loading from "@/components/loading/Loading";
import { apiUrl } from "@/components/url";
import { LessonsType, NumPage } from "@/types/type";
import { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";
export default function MyLessonsDash() {
  const [lessonsItems, setLessonsItems] = useState<LessonsType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const numPage: NumPage = {
    page: "1",
    limit: "2",
  };

  const handleGetMyLibrary = useCallback(async () => {
    setLoading(true);
    const token = Cookies.get("token");
    try {
      const response = await fetch(
        apiUrl +
          `/lesson/library/all?limit=${numPage.limit}&page=${numPage.page}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: token || "",
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
      setLoading(false);
      return data;
    } catch (error) {
      console.error("Request failed:", error);
      setLoading(false);
      throw error;
    }
  }, [numPage.limit, numPage.page]);

  useEffect(() => {
    handleGetMyLibrary();
  }, [handleGetMyLibrary]);

  return (
    <div className="news-back null-lessons-announcements">
      {loading && <Loading />}
      <ul>
        {Array.isArray(lessonsItems) && lessonsItems.length > 0
          ? lessonsItems.map((item) => (
              <Card
                key={item._id}
                title={item.title}
                description={item.description}
                id={item._id}
                action={"remove"}
              />
            ))
          : !loading && (
              <div className="no-tasks">
                <p>No lessons available</p>
              </div>
            )}
      </ul>
    </div>
  );
}

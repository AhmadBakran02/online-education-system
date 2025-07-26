"use client";

import Loading from "@/components/loading/Loading";
import { apiUrl } from "@/components/url";
import { LessonsType, NumPage } from "@/types/type";
import { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import "./style.css";

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
              <div
                key={item._id}
                className={`card border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow`}
              >
                <p className="title">{item.title}</p>
                <h2 className="subject-name">{item.description}</h2>

                <div className="two-button">
                  <button className="show-lesson">
                    <Link href={`/lessons/${item._id}`}>
                      <span> Show Lesson</span>
                    </Link>
                  </button>
                </div>
              </div>
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
// function DeleteFormMyLessons(id: any) {
//   throw new Error("Function not implemented.");
// }

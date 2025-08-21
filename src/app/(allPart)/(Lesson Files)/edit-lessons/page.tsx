"use client";
import { useCallback, useEffect, useState } from "react";
import "./style.css";
import { Card } from "../../../../components/lessons-card/lessons-card";
import Loading from "../../../../components/loading/Loading";
import { NumPage } from "../../../../types/type";
import { getAllLessons } from "@/app/api/lesson-get-my";
import { AuthGuard } from "@/components/AuthGuard";
// import { getAllLessons } from "../../api/lesson-get-my";
import Cookies from "js-cookie";

export default function Edit() {
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  interface Lesson {
    _id: string;
    title: string;
    description: string;
    teacherID: string;
    category: string;
    studentsEnrolled: string[]; // or any[] if the enrolled students might have more complex data
    videoID: string;
    pdfID: string;
    createdAt: string; // or Date if you'll convert it
    updatedAt: string; // or Date if you'll convert it
    __v: number;
    isInLibrary: boolean;
    level: string;
  }

  const [loading, setLoading] = useState<boolean>(true);
  const [lessonsItems, setLessonsItems] = useState<Lesson[]>([]);

  const [numPage] = useState<NumPage>({
    page: "1",
    limit: "30",
  });

  const handleGetAlllessons = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllLessons(numPage);
      setLessonsItems(data.lessons);
      return data;
    } catch (error) {
      console.error("Failed to fetch lessons:", error);
    } finally {
      setLoading(false);
    }
  }, [numPage]); // Now properly includes all dependencies

  useEffect(() => {
    handleGetAlllessons();
  }, [handleGetAlllessons]); // Now stable between renders

  return (
    <AuthGuard allowedRoles={["admin", "teacher"]}>
      <div className="edit-container">
        <div className="resource-tabs">
          <h1 className="font-semibold text-3xl">Edit Lessons</h1>
          <p className="text-[#737373] text-sm">
            Explore our colltion of e-book, references, and learing resouces
          </p>
        </div>

        <div className="my-lessons">
          {loading && (
            <div className="loading-cards">
              <Loading />
            </div>
          )}
          {!loading && lessonsItems.length < 1 && (
            <div className="no-lesson-card">
              <div className="no-lessons">
                <p>No Lessons Available Yet</p>
              </div>
            </div>
          )}
          {lessonsItems.length > 0 && (
            <div className="lesson-cards">
              <ul className="lessons-list">
                {lessonsItems.map((item) => (
                  <Card
                    key={item._id}
                    title={item.title}
                    description={item.description}
                    id={item._id}
                    action={"edit"}
                    level={item.level}
                  />
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}

"use client";
import { useCallback, useEffect, useState } from "react";
import "./style.css";
import { Card } from "../../../components/lessons-card/lessons-card";
import Loading from "../../../components/loading/Loading";
import { NumPage } from "../../interfaces/type";
import { getAllLessons } from "../../api/lesson-get-my";

export default function Edit() {
  useEffect(() => {
    const token = localStorage.getItem("token");
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
  }
  // interface LessonsResponse {
  //   lessons: Lesson[];
  // }
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
    <div className="edit-container">
      <div className="resource-tabs">
        <h1>Edit Lessons</h1>
        <p>Explore our colltion of e-book, references, and learing resouces</p>
      </div>

      <div className="my-lessons">
        <div className="lesson-cards">
          {loading && <Loading />}
          <ul>
            {lessonsItems.length > 0
              ? lessonsItems.map((item) => (
                  <Card
                    key={item._id}
                    title={item.title}
                    description={item.description}
                    id={item._id}
                    action={"edit"}
                  />
                ))
              : !loading && (
                  <div className="no-tasks">
                    <p>No tasks found matching your criteria</p>
                  </div>
                )}
          </ul>
        </div>
        {/* <div className="help-section">
            <p>
              Need help? <a href="#">View Support Center →</a>
            </p>
          </div> */}
      </div>
    </div>
  );
}

"use client";
import "./style.css";
import { Header } from "../header/Header";
import Sidebar from "../aside/Sidebar";
import { Card } from "../lessons-card/lessons-card";
import { useItems } from "../context/AllContext";
import { useEffect, useState } from "react";

interface LoginData {
  page: string;
  limit: string;
}
interface LessonsType {
  _id: string;
  title: string;
  description: string;
  teacherID: string;
  category: string;
  studentsEnrolled: string[];
  videoPath: string;
  pdfPath: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export default function Lessons() {
  const [activeTab, setActiveTab] = useState<
    "all" | "programming" | "math" | "english" | "Physics"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  const items = useItems();
  const [lessonsItems, setLessonsItems] = useState<LessonsType>([
    {
      _id: "",
      title: "",
      description: "",
      teacherID: "",
      category: "",
      studentsEnrolled: [],
      videoPath: "",
      pdfPath: "",
      createdAt: "",
      updatedAt: "",
      __v: 0,
    },
  ]);

  const [loginData, setLoginData] = useState<LoginData>({
    page: "1",
    limit: "30",
  });

  const filteredTasks = lessonsItems.filter((task) => {
    const matchesTab = activeTab === "all" || task.category == activeTab;

    return matchesTab;
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const token = localStorage.getItem("token"); // or from context/state

    try {
      const response = await fetch(
        "https://online-education-system-quch.onrender.com/course/get/all",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify(loginData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      setLessonsItems(data.courses);

      return data;
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  };

  useEffect(() => {
    handleSubmit();
  }, []);

  return (
    <div className="all-lessons">
      <Header />
      <Sidebar />
      {/* <button onClick={handleSubmit}>asdas</button> */}
      <div className="lessons-container">
        <div className="lessons-header">
          <h3>Lessons</h3>
          <p>
            Access your course materials, assignments, and pratice questions.
          </p>
        </div>
        <div className="lessons-search">
          <input
            type="serach"
            placeholder="Search lessons, assignments, or questions.."
          />
          <select id="subjects" name="subjects">
            <option value="all-subject">All Subjects</option>
            <option value="value2">value2</option>
            <option value="value3">value3</option>
            <option value="value4">value4</option>
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
          {/* {lessonsItems.length > 0 &&
            lessonsItems.map((item) => (
              <Card
                key={item._id}
                title={item.title}
                description={item.description}
                id={item._id}
                action={"add"}
              />
            ))} */}

          {!lessonsItems.length && (
            <h3>No lessons found matching your search criteria.</h3>
          )}

          {filteredTasks.length > 0 ? (
            filteredTasks.map((item) => (
              <Card
                key={item._id}
                title={item.title}
                description={item.description}
                id={item._id}
                action={"add"}
              />
            ))
          ) : (
            <div className="no-tasks">
              <p>No tasks found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";
import { Header } from "../header/Header";
import Sidebar from "../aside/Sidebar";
import { Card } from "../lessons-card/lessons-card";
import "./style.css";
import { useEffect, useState } from "react";
import { useItems } from "../context/AllContext";

const lessonsItems = [
  { title: "title", desc: "Lorem ipsum dolor", id: 1 },
  { title: "title", desc: "Lorem ipsum dolor", id: 2 },
  { title: "title", desc: "Lorem ipsum dolor", id: 3 },
  { title: "title", desc: "Lorem ipsum dolor", id: 4 },
  { title: "title", desc: "Lorem ipsum dolor", id: 5 },
  { title: "title", desc: "Lorem ipsum dolor", id: 6 },
  { title: "title", desc: "Lorem ipsum dolor", id: 7 },
  { title: "title", desc: "Lorem ipsum dolor", id: 8 },
  { title: "title", desc: "Lorem ipsum dolor", id: 9 },
  { title: "title", desc: "Lorem ipsum dolor", id: 10 },
];

interface apiBody {
  page: string;
  limit: string;
}

interface LessonsType {
  _id: string;
  userID: string;
  courseID: string;
}

export default function MyLessons() {
  const [activeTab, setActiveTab] = useState<
    "all" | "programming" | "math" | "english" | "Physics"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  const items = useItems();
  const [lessonsItems, setLessonsItems] = useState<LessonsType[]>([
    {
      _id: "",
      userID: "",
      courseID: "",
    },
  ]);


  const handleSubmit = async (e: React.FormEvent) => {
    // setLoading(true);
    // setError(null);
    // setSuccess(false);

    const token = localStorage.getItem("token"); // or from context/state
    const loginData = {};
    try {
      const response = await fetch(
        "https://online-education-system-quch.onrender.com/course/library/get/all",
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
      console.log(lessonsItems);
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
    <div className="all-my-lessons">
      <Header />
      <Sidebar />
      <div className="my-lessons">
        <h1>My Lessons</h1>
        <div className="search">
          <input type="search" />
          <button className="btn">Search</button>
        </div>

        <div className="lesson-cards">
          {!lessonsItems.length && <h3>No lessons available</h3>}
          <ul>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((item) => (
                <Card
                  key={item._id}
                  title={item.title}
                  description={item.description}
                  id={item._id}
                  action={"remove"}
                />
              ))
            ) : (
              <div className="no-tasks">
                <p>No tasks found matching your criteria</p>
              </div>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

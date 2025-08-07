"use client";
import "./style.css";
import { useEffect, useState, useCallback } from "react";
import { apiUrl } from "@/components/url";
import Cookies from "js-cookie";
import { LessonsType } from "@/types/type";
import Loading from "@/components/loading/Loading";
import { Card } from "@/components/lessons-card/lessons-card";

interface NumPage {
  page: string;
  limit: string;
}

export default function Lessons() {
  const [activeTab, setActiveTab] = useState<
    "all" | "programming" | "math" | "english" | "physics"
  >("all");
  const [activeSelect, setActiveSelect] = useState<string>("all");
  const [lessonsItems, setLessonsItems] = useState<LessonsType[]>([]);

  const [numPage] = useState<NumPage>({
    page: "1",
    limit: "10",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Check authentication

  // const handleGetNumber = useCallback(async () => {
  //   setLoading(true);
  //   setError(null);

  //   try {
  //     const token = Cookies.get("token") || "";
  //     const response = await fetch(apiUrl + "/lesson/number", {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         token,
  //       },
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(
  //         errorData.message || `HTTP error! status: ${response.status}`
  //       );
  //     }

  //     const data = await response.json();
  //     setNumPage((prev) => ({ ...prev, limit: data.numberOfLessons }));
  //     setNumberOfLessons(data.numberOfLessons);
  //   } catch (err) {
  //     const errorMessage = err instanceof Error ? err.message : "Unknown error";
  //     setError(errorMessage);
  //     console.error("Request failed:", errorMessage);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []); // Removed error from dependencies since we're using local variable

  const handleGetAllLessons = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = Cookies.get("token") || "";
      const response = await fetch(
        apiUrl + `/lesson/all?page=${numPage.page}&limit=100`,
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
  }, [numPage.page]); // Added numberOfLessons to dependencies

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      // await handleGetNumber();
      await handleGetAllLessons();
    };
    fetchData();
  }, [handleGetAllLessons]);

  const filteredLessons = lessonsItems.filter((task) => {
    return activeTab === "all" || task.category === activeTab;
  });

  const finalFilteredLessons = filteredLessons.filter((task) => {
    return activeSelect === "all" || task.level === activeSelect;
  });

  const filteredLessonsSearch = finalFilteredLessons.filter((lesson) =>
    lesson.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          id="subjects"
          name="subjects"
          onChange={(e) => setActiveSelect(e.target.value)}
        >
          <option value="all">All levels</option>
          <option value="beginner">beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>
      <div className="select-task">
        <div className="lessons-tabs">
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
      {loading && <Loading />}
      <div className="lessons-main">
        {filteredLessonsSearch.length > 0
          ? filteredLessonsSearch.map((item) => (
              <Card
                key={item._id}
                title={item.title}
                description={item.description}
                id={item._id}
                action={"add"}
                isIn={item.isInLibrary}
                level={item.level}
              />
            ))
          : ""}
      </div>
      {!loading && filteredLessonsSearch.length == 0 && (
        <div className="no-lessons-yet">
          <h3>No lessons found matching your search criteria.</h3>
        </div>
      )}
      {error && !error && <h1>{error}</h1>}
    </div>
  );
}

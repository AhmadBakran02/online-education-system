"use client";

import Link from "next/link";
import "./style.css";
import { useCallback, useEffect } from "react";
import { ForumCard } from "../../../components/forum-card/forum-card";
import { useState } from "react";

import { Card } from "../../../components/lessons-card/lessons-card";
// import Calendar from "react-calendar";
import Loading from "../../../components/loading/Loading";
import { LessonsType } from "../../interfaces/type";

interface NumPage {
  page: string;
  limit: string;
}

export default function Dashboard() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);
  const [lessonsItems, setLessonsItems] = useState<LessonsType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // const [numPage, setNumPage] = useState<NumPage>({
  //   page: "1",
  //   limit: "2",
  // });

  const numPage: NumPage = {
    page: "1",
    limit: "2",
  };
  const handleGetMyLibrary = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `https://online-education-system-quch.onrender.com/lesson/library/all?limit=${numPage.limit}&page=${numPage.page}`,
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
    <div className="dashboard-container">
      <div className="dashboard-section">
        <h1>Track your progress and catch up with today&apos;s tasks.</h1>
        <p>View Assignments</p>
        <h2>Your Progress</h2>

        <div className="all-progress">
          <div className="assignments-completed progress-box">
            <h3>Assignments Completed</h3>
            <p>10/10</p>
            <div className="progress"></div>
          </div>

          <div className="quiz-performance progress-box">
            <h3>Quiz Performance</h3>
            <p>76%</p>
            <div className="progress"></div>
          </div>
          <div className="forum-participation progress-box">
            <h3>Forum Participation</h3>
            <p>10 points</p>
            <div className="progress"></div>
          </div>
        </div>
      </div>

      <div className="dashboard-second">
        <div className="all-dashboard-box">
          <div className="news dashboard-box">
            <h3>News & Announcements</h3>
            <Link href="">View All ›</Link>
            <div className="news-back null-lessons-announcements">
              No announcements yet
            </div>
          </div>
          <div className="current-lessons dashboard-box">
            <h3>Current Lessons</h3>
            <Link href="my-lessons">All Lessons ›</Link>
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
                        pdfID={""}
                        videoID={""}
                      />
                    ))
                  : !loading && (
                      <div className="no-tasks">
                        <p>No lessons available</p>
                      </div>
                    )}
              </ul>
            </div>
          </div>
        </div>
        <div className="right-aside">
          <div className="calendar">
            <div className="head-calendar">
              <h3>School Calendar </h3>
              <Link href="">View Full Calendar ›</Link>
            </div>
            {/* <Calendar
              locale="en"
              tileClassName={({ date, view }) => {
                if (view !== "month") return null;
                const day = date.getDay();
                // Set Friday (5) and Saturday (6) as weekends
                return day === 5 || day === 6 ? "weekend" : null;
              }}
              // locale="en"
              navigationLabel={({ date, label, locale, view }) => (
                <div className="custom-navigation-label">{label}</div>
              )}
            /> */}
          </div>
          <div className="forum-activty">
            <h3>Recent Forum Activity</h3>
            <Link href="/discussions">Visit Forum ›</Link>
            <div className="news-back null-lessons-announcements">
              {/* <p>No forum activity yet </p> */}
              <div className="topics-exist">
                <ForumCard show={false} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

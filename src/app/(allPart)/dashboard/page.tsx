"use client";

import Link from "next/link";
import "./style.css";
import "../../globals.css";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { ClipboardList, Bot } from "lucide-react";

import BlogDashboard from "@/components/blog-dashboard/BlogDaschboard";
import MyLessonsDash from "./@myLessons/page";
import PostDash from "./@post/page";
import QuizList from "./@quizList/page";

export default function Dashboard() {
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-section">
        <h1>Track your progress and catch up with today&apos;s tasks.</h1>

        <div className="all-quizzes">
          <Link href="/quiz-history" className="quiz">
            <div className="icon-back">
              <ClipboardList className="task-icon" />
            </div>
            <p>Quiz Participation History</p>
          </Link>
          <Link href="/AI-history" className="quiz">
            <div className="icon-back">
              <Bot className="task-icon" />
            </div>
            <p>AI Quiz Participation History</p>
          </Link>
        </div>

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
            <Link className="color-main-blue" href="">
              View All ›
            </Link>
            {/* <div className="news-back null-lessons-announcements">
              No announcements yet
            </div> */}
            <PostDash />
          </div>
          <div className="current-lessons dashboard-box">
            <h3>My Library</h3>
            <Link className="color-main-blue" href="my-library">
              All Lessons ›
            </Link>
            <MyLessonsDash />
          </div>
        </div>
        <div className="right-aside">
          <div className="calendar">
            <div className="head-calendar">
              <h3>School Calendar </h3>
              <Link className="color-main-blue" href="">
                View Full Calendar ›
              </Link>
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
            <Link className="color-main-blue" href="/discussions">
              Visit Forum ›
            </Link>
            <div className="news-back null-lessons-announcements">
              {/* <p>No forum activity yet </p> */}
              <div className="topics-exist">
                {/* <ForumCard
                  show={false}
                  title={""}
                  article={""}
                  category={""}
                  createdAt={""}
                  id={""}
                  name={""}
                  role={""}
                  edit={false}
                /> */}
                <BlogDashboard />
              </div>
            </div>
          </div>
          <div className="forum-activty">
            <h3>Quiz List</h3>
            <Link className="color-main-blue" href="/quiz-list">
              All Quiz ›
            </Link>
            <div className="news-back null-lessons-announcements">
              <div className="topics-exist">
                <QuizList />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

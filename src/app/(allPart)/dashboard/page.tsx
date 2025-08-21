"use client";

import Link from "next/link";
import "./style.css";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { ClipboardList, Bot } from "lucide-react";

import MyLessonsDash from "./@myLessons/page";
import PostDash from "./@post/page";
import QuizList from "./@quizList/page";
import BlogDash from "./@blog/page";
import Statistics from "./@statistics/page";

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
        <Statistics />
        {/* <h2>Your Progress</h2>

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
        </div> */}
      </div>

      <div className="dashboard-second">
        <div className="all-dashboard-box">
          <div className="news dashboard-box">
            <h3>News & Announcements</h3>
            <Link className="text-[#4351af]" href="/">
              View All ›
            </Link>
            <PostDash />
          </div>
          <div className="current-lessons dashboard-box">
            <h3>My Library</h3>
            <Link className="text-[#4351af]" href="/my-library">
              All Lessons ›
            </Link>
            <MyLessonsDash />
          </div>
        </div>
        <div className="right-aside">
          <div className="forum-activty">
            <h3>Recent Forum Activity</h3>
            <Link className="color-main-blue" href="/discussions">
              Visit Forum ›
            </Link>
            <div className="news-back null-lessons-announcements">
              <div className="topics-exist">
                <BlogDash />
              </div>
            </div>
          </div>
          <div className="forum-activty">
            <h3>Quiz List</h3>
            <Link className="color-main-blue" href="/dashboard/quiz-list">
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

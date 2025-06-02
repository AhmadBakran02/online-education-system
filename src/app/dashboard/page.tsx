"use client";

import { Header } from "../header/Header";
import Sidebar from "../aside/Sidebar";
import Link from "next/link";
import "./style.css";
import { useEffect } from "react";
import { ForumCard } from "../forum-card/forum-card";
import { useState } from "react";

import { Card } from "../lessons-card/lessons-card";
import Calendar from "react-calendar";

export default function Dashboard() {
  const [allItems, setAllItems] = useState([]);

  useEffect(() => {
    const items = { ...localStorage };
    setAllItems(items);
  }, []);

  const lessonsItems = [
    { title: "title", desc: "Lorem ipsum dolor", id: 1 },
    { title: "title", desc: "Lorem ipsum dolor", id: 2 },
  ];

  return (
    <div className="all-dashboard">
      <Header />
      <Sidebar />
      <div className="dashboard-container">
        <div className="dashboard-section">
          <h1>Track your progress and catch up with today's tasks.</h1>
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
                {!lessonsItems.length && <>No lessons available</>}
                <ul>
                  {lessonsItems.map((item) => (
                    <li key={item.id}>
                      <Card
                        id={item.id}
                        title={item.title}
                        name={item.desc}
                        action={"remove"}
                      />
                    </li>
                  ))}
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
              <Calendar
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
              />
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
    </div>
  );
}

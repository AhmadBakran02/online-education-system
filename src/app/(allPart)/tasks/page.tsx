"use client";

import { useState } from "react";
import "./style.css";
import Link from "next/link";

type Task = {
  id: string;
  title: string;
  dueDate: string;
  course: string;
  status: "completed" | "pending" | "overdue";
  priority: "low" | "medium" | "high";
};

export default function TaskPage() {
  const [activeTab, setActiveTab] = useState<
    "all" | "pending" | "completed" | "overdue"
  >("all");

  const [searchQuery] = useState<string>("");
  const tasks: Task[] = [
    {
      id: "1",
      title: "Math Homework - Chapter 5",
      dueDate: "2025-04-25",
      course: "Mathematics",
      status: "pending",
      priority: "high",
    },
    {
      id: "2",
      title: "Programming C++",
      dueDate: "2025-04-22",
      course: "Programming",
      status: "overdue",
      priority: "medium",
    },
    {
      id: "3",
      title: "Physics Project Proposal",
      dueDate: "2025-04-30",
      course: "Physics",
      status: "pending",
      priority: "low",
    },
    {
      id: "4",
      title: "English Reading Assignment",
      dueDate: "2025-04-20",
      course: "English",
      status: "completed",
      priority: "medium",
    },
  ];

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.course.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || task.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="tasks-container">
      <div className="task-controls">
        <div className="select-task">
          <div className="tabs">
            <button
              className={activeTab === "all" ? "active" : ""}
              onClick={() => setActiveTab("all")}
            >
              All Tasks
            </button>
            <button
              className={activeTab === "pending" ? "active" : ""}
              onClick={() => setActiveTab("pending")}
            >
              Pending
            </button>
            <button
              className={activeTab === "completed" ? "active" : ""}
              onClick={() => setActiveTab("completed")}
            >
              Completed
            </button>
            <button
              className={activeTab === "overdue" ? "active" : ""}
              onClick={() => setActiveTab("overdue")}
            >
              Overdue
            </button>
          </div>
        </div>
        {/* ******** Add Task Button ********** */}
        {/* <button className="btn">+ Add New Task</button> */}
      </div>

      <div className="task-stats">
        <div className="stat-card">
          <h3>Total Tasks</h3>
          <p>{tasks.length}</p>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <p>{tasks.filter((t) => t.status === "completed").length}</p>
        </div>
        <div className="stat-card">
          <h3>Pending</h3>
          <p>{tasks.filter((t) => t.status === "pending").length}</p>
        </div>
        <div className="stat-card">
          <h3>Overdue</h3>
          <p>{tasks.filter((t) => t.status === "overdue").length}</p>
        </div>
      </div>

      <div className="task-list">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`task-card ${task.status} ${task.priority}`}
            >
              {/* <div className="task-checkbox">
                  <input
                    type="checkbox"
                    checked={task.status === "completed"}
                    onChange={() => {}}
                  />
                </div> */}
              <div className="task-content">
                <Link href={`/tasks/${task.id}`}>
                  <h3>{task.title}</h3>
                </Link>
                <p className="task-course">{task.course}</p>
                <div className="task-meta">
                  <span className="due-date">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect
                        x="3"
                        y="4"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"
                      ></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                  <span className={`priority ${task.priority}`}>
                    {task.priority}
                  </span>
                </div>
              </div>
              {/* <div className="task-actions">
                  <button className="edit-button">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                  <button className="delete-button">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div> */}
            </div>
          ))
        ) : (
          <div className="no-tasks">
            <p>No tasks found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}


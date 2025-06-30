import DeleteQuiz from "@/app/(allPart)/edit-quizzes/delete-quiz";
import Image from "next/image";
import { useState } from "react";
import "./style.css";
interface QuizCradType {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  category: string;
  edit: boolean;
}

export default function QuizCard({
  id,
  title,
  description,
  createdAt,
  category,
  edit,
}: QuizCradType) {
  const [deleting, setDeleting] = useState<boolean>(true);
  const [deleted, setDeleted] = useState<boolean>(false);

  const handleEnterQuiz = (quizid: string) => {
    window.location.href = `/quizzes/${quizid}`;
  };

  const handelDeleteQuiz = async () => {
    setDeleting(true);
    const success = await DeleteQuiz(id);
    if (success) {
      console.log("succccc");
      setDeleted(true);
      setDeleting(false);
    }
  };
  
  return (
    <div
      key={id}
      className={`task-card completed medium ${deleted ? "!hidden" : ""}`}
    >
      <div className="task-content">
        <div className="quiz-header">
          <h3
            className="!text-black font-medium capitalize cursor-pointer"
            onClick={() => handleEnterQuiz(id)}
          >
            {title}
          </h3>
          {edit && (
            <button className="delete-quiz" onClick={() => handelDeleteQuiz()}>
              {deleting ? <p>Delete Quiz</p> : <p>Deleting Quiz...</p>}
              <Image src={"./delete-white.svg"} width={20} height={20} alt="" />
            </button>
          )}
        </div>
        <p
          className="text-gray-700 !mb-3.5 cursor-pointer"
          onClick={() => handleEnterQuiz(id)}
        >
          {description}
        </p>
        <p className="task-course capitalize">{category}</p>
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
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            {createdAt?.split("T")[0] || "N/A"}
          </span>
          {/* <span className={`priority ${task.priority}`}>
                      {task.priority}
                    </span> */}
        </div>
      </div>
    </div>
  );
}

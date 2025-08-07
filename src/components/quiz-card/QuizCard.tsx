import DeleteQuiz from "@/app/(allPart)/(Quiz)/edit-quizzes/delete-quiz";
import Image from "next/image";
import { useState } from "react";
import "./style.css";
import "../../app/globals.css";
import AddToMyTodo from "./add-quiz";
import AddToList from "../AddToList";
import RemoveFromList from "../RemoveFromList";
import ModalPortal from "../ModalPortal";
import Loading4 from "../loading4/Loading4";
import SuccessCard from "../success-card/SuccessCard";

interface QuizCradType {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  category: string;
  edit: boolean;
  student: boolean;
  list: boolean;
  isAt: boolean;
}

export default function QuizCard({
  id,
  title,
  description,
  createdAt,
  category,
  edit,
  student,
  list,
  isAt,
}: QuizCradType) {
  const [deleting, setDeleting] = useState<boolean>(true);
  const [deleted, setDeleted] = useState<boolean>(false);
  const [Added, setAdded] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<boolean>(false);
  const [quizDate, setQuizDate] = useState<string>("");

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

  const handleAddToMyTodo = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    console.log(id);
    if (quizDate == "") {
      setError("Select Date First");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const response = await AddToMyTodo(id, quizDate);

      if (response.success) {
        setMessage(true);
        setShowAdd(false);
        // setAddButton(true);
        console.log("Success:", response.message);
        setAdded(true);
      } else {
        setError("Quiz is already added");
        // console.error("Error:", response.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      key={id}
      className={`task-card completed medium ${
        deleted && list ? "!hidden" : ""
      }`}
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
          {student && !list && !Added && (!isAt || deleted) && (
            <AddToList setShowAdd={setShowAdd} />
          )}
          {student && list && (
            <RemoveFromList setDeleted={setDeleted} id={id} />
          )}
          {isAt && !deleted && (
            <RemoveFromList setDeleted={setDeleted} id={id} />
          )}
          {Added && <RemoveFromList setDeleted={setDeleted} id={id} />}
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
      {message && (
        <ModalPortal>
          <SuccessCard
            text="Added Successfully"
            onClose={() => setMessage(false)}
            duration={3000} // 3 seconds
          />
        </ModalPortal>
      )}
      {showAdd && (
        <ModalPortal>
          <div className="modal-overlay">
            <div className="flow-card">
              <div className="add-post">
                <h3>Add Quiz To My List</h3>
              </div>
              <input
                type="date"
                onChange={(e) => setQuizDate(e.target.value)}
              />

              {error && <div className="failed-message">{error}</div>}
              <div className="button-group">
                <button
                  type="button"
                  className="close-button"
                  onClick={() => setShowAdd(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="post-button"
                  onClick={handleAddToMyTodo}
                >
                  {isLoading ? (
                    <div className="mt-2">
                      <Loading4 />
                    </div>
                  ) : (
                    "Add"
                  )}
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
}

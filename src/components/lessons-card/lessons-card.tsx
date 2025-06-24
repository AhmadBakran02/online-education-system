import { useEffect, useState } from "react";
import "./style.css";
import Image from "next/image";
import AddToMyLessons from "./add-lesson";
import DeleteFormMyLessons from "./delete-lessos";
import { EditLesson } from "./EditLesson";
// import { getFile, streamAndDownloadPdf } from "../api/get-file";
// import { downloadPdf } from "../services/downloadService";
import { TypeOfParamsCard } from "../../app/interfaces/type";
// import { Linefont } from "next/font/google";
import Link from "next/link";
// import LessonId from "@/app/(allPart)/lessons/[lessonId]/page";
// import VideoPlayer from "../show-video/page";

export const Card = ({
  title,
  description,
  id,
  action,
  isIn,
}: TypeOfParamsCard) => {
  const [message, setMessage] = useState<boolean>(false);
  const [addButton, setAddButton] = useState<boolean>(false);

  const [deletePic, setDeletePic] = useState<string>("./delete.svg");
  const [editPic, setEditPic] = useState<string>("./delete.svg");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // const [showLesson, setShowLesson] = useState<boolean>(false);
  const [editId, setEditId] = useState<string>("");
  const [newTitle, setNewTitle] = useState<string>("");
  const [newdDescription, setNewDescription] = useState<string>("");

  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
  }>();

  const handleAddToLessons = async () => {
    setIsLoading(true);
    console.log(id);
    try {
      const response = await AddToMyLessons(id);
      setResult(response);

      if (response.success) {
        setMessage(true);
        setAddButton(true);
        console.log("Success:", response.message);
      } else {
        console.error("Error:", response.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    const f = action === "edit";
    console.log(f);
    const success = await DeleteFormMyLessons(id);
    if (success) {
      window.location.reload();
    }
  };

  useEffect(() => {
    if (message) {
      setMessage(true);
      const timer = setTimeout(() => {
        setMessage(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleEdit = async () => {
    setNewTitle(title);
    setNewDescription(description);

    setEditId(id);
    console.log(editId);
    console.log(result);
    setIsOpen(true);
  };

  const handleEditApi = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const response = await EditLesson(id, newTitle, newdDescription);
      setResult(response);

      if (response.success) {
        // setMessage(true);
        window.location.reload();
        console.log("Success:", response.message);
      } else {
        console.error("Error:", response.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card" key={id}>
      {action === "add" && (
        <div className="header-card">
          <Link href={`/lessons/${id}`}>
            <p className="title">{title}</p>
          </Link>
          <p className={`success ${message ? "" : "hid"}`}>
            Lesson Added Successfully
          </p>
        </div>
      )}
      {action !== "remove" && action !== "add" && (
        <Link href={`/lessons/${id}`}>
          <p className="title">{title}</p>
        </Link>
      )}
      {action == "remove" && <p className="title">{title}</p>}
      <h2 className="subject-name">{description}</h2>
      {action == "add" && (
        <button
          onClick={handleAddToLessons}
          disabled={isLoading || isIn}
          className={isIn || addButton ? "is-in" : "add"}
        >
          {isLoading ? (
            "Adding..."
          ) : (
            <>
              <Image src={"./plus-gray-s.svg"} width={20} height={20} alt="" />
              <span> Add to my lessons</span>
            </>
          )}
        </button>
      )}

      {action == "remove" && (
        <div className="two-button">
          <button className="show-lesson">
            <Link href={`/lessons/${id}`}>
              <span> Show Lesson</span>
            </Link>
          </button>
          <button
            onClick={() => handleDelete()}
            className="delete"
            onMouseEnter={() => setDeletePic("./delete-white.svg")}
            onMouseLeave={() => setDeletePic("./delete.svg")}
          >
            <Image src={deletePic} width={20} height={20} alt="" />
          </button>
        </div>
      )}

      {action == "edit" && (
        <div className="two-button">
          <button
            className="edit-button"
            onClick={() => handleEdit()}
            onMouseEnter={() => setEditPic("./edit-white.svg")}
            onMouseLeave={() => setEditPic("./edit.svg")}
          >
            <Image src={editPic} width={18} height={18} alt="" />
            <span> Edit</span>
          </button>
          <button
            onClick={() => handleDelete()}
            className="delete-button"
            onMouseEnter={() => setDeletePic("./delete-white.svg")}
            onMouseLeave={() => setDeletePic("./delete.svg")}
          >
            <Image src={deletePic} width={20} height={20} alt="" />
            <span> Delete</span>
          </button>
        </div>
      )}

      {isOpen && (
        <div className="modal-overlay">
          <div className="flow-card">
            <h3>Create New Item</h3>
            <form>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newdDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  required
                />
              </div>
              <div className="button-group">
                <button type="submit" onClick={handleEditApi}>
                  {isLoading ? "Updating..." : "Submit"}
                </button>
                <button type="button" onClick={() => setIsOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* {showLesson && (
        <div className="modal-overlay">
          <div className="flow-card">
            <form>
              {id}
              <div className="form-group">
                <div className="lesson-title-show flex">
                  <h2 className="font-bold">{title}</h2>
                </div>
              </div>
              <div className="form-group">
                <div className="lesson-des-show ">
                  <p className="font-bold">Description:</p>
                  <h3>{description}</h3>
                </div>
              </div>

              {videoID && <Link href={""}></Link>}
              <div className="button-group">
                <button type="button" onClick={handleDownload}>
                  {isLoading ? "Downloading..." : "Download PDF File"}
                </button>
                <button type="button" onClick={() => setShowLesson(false)}>
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )} */}
    </div>
  );
};

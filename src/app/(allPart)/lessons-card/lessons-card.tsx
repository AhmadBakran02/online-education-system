import { useEffect, useState } from "react";
import "./style.css";
import Image from "next/image";
import AddToMyLessons from "./add-lesson";
import DeleteFormMyLessons from "./delete-lessos";
import { EditLesson } from "./EditLesson";
// import { getFile, streamAndDownloadPdf } from "../api/get-file";
// import { downloadPdf } from "../services/downloadService";
import { TypeOfParamsCard } from "../../interfaces/type";
// import VideoPlayer from "../show-video/page";

export const Card = ({
  title,
  description,
  id,
  action,
  isIn,
  pdfID,
  videoID,
}: TypeOfParamsCard) => {
  const [message, setMessage] = useState<boolean>(false);
  const [addButton, setAddButton] = useState<boolean>(false);

  const [deletePic, setDeletePic] = useState<string>("./delete.svg");
  const [editPic, setEditPic] = useState<string>("./delete.svg");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showLesson, setShowLesson] = useState<boolean>(false);
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

  const handleShow = async () => {
    setShowLesson(true);
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setLoading(true);
    setError(null);
    console.log(pdfID);
    console.log(id);
    console.log(loading);
    try {
      // 1. Get token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // 3. Make the API call
      const response = await fetch(
        `https://online-education-system-quch.onrender.com/file?fileID=${videoID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        }
      );

      // 4. Handle errors
      if (!response.ok) {
        console.log(error);
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to download PDF");
      }
      console.log("sss");

      // 5. Extract filename from headers or use default
      const contentDisposition = response.headers.get("content-disposition");
      const filenameMatch = contentDisposition?.match(
        /filename="?(.+?)"?(;|$)/
      );
      const filename = filenameMatch?.[1] || "document.pdf";

      // 6. Create and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      setError(err instanceof Error ? err.message : "Failed to download PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" key={id}>
      {action === "add" && (
        <div className="header-card">
          <p className="title">{title}</p>
          <p className={`success ${message ? "" : "hid"}`}>
            Lesson Added Successfully
          </p>
        </div>
      )}
      {action !== "add" && <p className="title">{title}</p>}
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
          <button className="show-lesson" onClick={() => handleShow()}>
            {/* <Image src={"./delete.svg"} width={20} height={20} alt="" /> */}
            <span> Show Lesson</span>
          </button>
          <button
            onClick={() => handleDelete()}
            className="delete"
            onMouseEnter={() => setDeletePic("./delete-white.svg")}
            onMouseLeave={() => setDeletePic("./delete.svg")}
          >
            <Image src={deletePic} width={20} height={20} alt="" />
            {/* <span> Delete</span> */}
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

      {showLesson && (
        <div className="modal-overlay">
          <div className="flow-card">
            {/* <h3>Create New Item</h3> */}
            <form>
              <div className="form-group">
                <div className="lesson">
                  <p>Title:</p>
                  <p>{title}</p>
                </div>
              </div>
              <div className="form-group">
                <div className="lesson">
                  <p>Description:</p>
                  <p>{description}</p>
                </div>
              </div>

              <div className="form-group">
                <div className="lesson">
                  <p>Description:</p>
                  <p>{description}</p>
                </div>
              </div>
              {/* <VideoPlayer viID={videoID} /> */}
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
      )}
    </div>
  );
};

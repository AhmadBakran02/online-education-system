import { useState } from "react";
import "./style.css";
import Image from "next/image";
import { deletePost } from "./delete-post";
import { EditPost } from "./Edit-post";
import { Post } from "@/types/type";
import { redirect } from "next/navigation";

export const PostCard = ({
  title,
  article,
  _id,
  photoID,
  photoUrl,
  editPost,
  showFull,
}: Post) => {
  const [deletePic, setDeletePic] = useState<string>("./delete.svg");
  const [editPic, setEditPic] = useState<string>("./edit.svg");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showPost, setShowPost] = useState<boolean>(false);
  const [editId, setEditId] = useState<string>("");
  const [deleted, setDeleted] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>("");
  const [newArticle, setNewArticle] = useState<string>("");

  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
  }>();

  const handleDelete = async () => {
    console.log(_id);
    setLoadingDelete(true);
    const success = await deletePost(_id);

    if (success) {
      setDeleted(true);
      setLoadingDelete(false);
    }
  };

  const handleEdit = async () => {
    setNewTitle(title);
    setNewArticle(article);

    setEditId(_id);
    console.log(editId);
    console.log(result);
    setIsOpen(true);
  };

  const handleShow = async () => {
    if (editPost) setShowPost(true);
    else {
      redirect(`/post/${_id}`);
    }
  };

  const handleEditApi = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const response = await EditPost(_id, newTitle, newArticle, photoID);
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

  function isValidUrl(string: string) {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  }

  console.log(photoUrl);
  return (
    <div
      key={_id}
      className={`post bg-white rounded-lg overflow-hidden ${
        deleted ? "hid" : ""
      }  ${showFull ? "show-full-post" : "dont-show-full-post"}`}
    >
      <Image
        src={photoUrl && isValidUrl(photoUrl) ? photoUrl : "/images/pic2.jpg"}
        alt={`Event ${_id}`}
        width={200}
        height={200}
        className="object-cover w-full h-48"
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/images/pic2.jpg";
        }}
      />
      <div
        className={`post-body ${
          editPost ? "justify-between" : "justify-evenly gap-6"
        }`}
      >
        <h3 onClick={handleShow} className="text-lg font-semibold post-title">
          {title}
        </h3>
        <p
          className={`text-sm text-gray-600 ${
            showFull ? "show-full" : "post-article"
          }`}
        >
          {article}
        </p>

        {editPost && (
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
              <span>{loadingDelete ? "Deleting..." : "Delete"} </span>
            </button>
          </div>
        )}
      </div>

      {isOpen && (
        <div className="modal-overlay">
          <div className="flow-card">
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
                <label>Article</label>
                <textarea
                  value={newArticle}
                  onChange={(e) => setNewArticle(e.target.value)}
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

      {showPost && (
        <div className="modal-overlay">
          <div className="flow-card">
            <form>
              <div className="form-group">
                <p className="image-post-show">
                  <Image
                    src={
                      photoUrl && isValidUrl(photoUrl)
                        ? photoUrl
                        : "/images/pic2.jpg"
                    }
                    alt={`Event ${_id}`}
                    width={200}
                    height={200}
                    className="image-show object-cover w-full h-48"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/pic2.jpg";
                    }}
                  />
                </p>
                <div className="post-title-show">
                  {/* <p>Title:</p> */}
                  <p>{title}</p>
                </div>
              </div>
              <div className="form-group">
                <div className="post-article-show">
                  {/* <p>article:</p> */}
                  <p>{article}</p>
                </div>
              </div>
              <div className="button-group">
                <button
                  className="button-show"
                  type="button"
                  onClick={() => setShowPost(false)}
                >
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

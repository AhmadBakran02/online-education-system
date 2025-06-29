"use client";
import { useCallback, useEffect, useState } from "react";
import "./style.css";

import Image from "next/image";
import { apiUrl } from "../url";
import EditBlog from "./EditBlog";
import deleteBlog from "./delete-blog";
import { GetComments } from "@/types/type";
import Comment from "../comment/Comment";
import Loading2 from "../loading2/loading2";

interface TypeOfValue {
  title: string;
  article: string;
  category: string;
  show: boolean;
  createdAt: string;
  id: string;
  name: string;
  role: string;
  edit: boolean;
}
export const ForumCard = ({
  title,
  article,
  category,
  show,
  createdAt,
  id,
  role,
  name,
  edit,
}: TypeOfValue) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");
  const [commentNumber, setCommentNumber] = useState<string>("0");
  const [success, setSuccess] = useState<boolean>(false);
  const [deleted, setDeleted] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [commentsLoading, setCommentsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [editId, setEditId] = useState<string>("");
  const [newTitle, setNewTitle] = useState<string>("");
  const [newArticle, setNewArticle] = useState<string>("");
  const [comments, setComments] = useState<GetComments[]>([]);
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
  }>();

  function answer() {
    setIsActive(!isActive);
    if (!isActive) getAllComments();
  }
  const dateOnly = createdAt?.split("T")[0] || "N/A";

  const addComment = async () => {
    // setIsUploading(true);
    try {
      console.log("start-2");

      const response = await fetch(apiUrl + `/blog/comment`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token") || "",
        },
        body: JSON.stringify({
          blogID: id,
          comment: comment,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Handle successful login
      setSuccess(true);
      console.log("add", success);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
      return false;
      console.log(error);
    } finally {
      // setLoading(false);
      // setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    const success = await deleteBlog(id);
    if (success) {
      setDeleted(true);
    }
  };

  const getAllComments = useCallback(async () => {
    setCommentsLoading(true);
    console.log("get comments");
    try {
      const token = localStorage.getItem("token") || "";
      const response = await fetch(
        apiUrl + `/blog/comment/all?limit=99&page=1&blogID=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token,
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
      setComments(data.comments);
      console.log(data.comments);
      return data;
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    } finally {
      setCommentsLoading(false);
    }
  }, [id]);

  const getNumberOfComments = useCallback(async () => {
    setCommentsLoading(true);
    console.log("get comments");
    try {
      const token = localStorage.getItem("token") || "";
      const response = await fetch(
        apiUrl + `/blog/comment/number?blogID=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token,
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
      console.log(data);
      setCommentNumber(data.numberOfComments);
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    } finally {
      setCommentsLoading(false);
    }
  }, [id]);

  // Initial data fetch
  const handelAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    const addsuccessfuly = await addComment();
    if (addsuccessfuly) {
      setComment("");
      getAllComments();
    }
  };
  useEffect(() => {
    getNumberOfComments();
  }, [getNumberOfComments]);

  const handleEditApi = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const response = await EditBlog(id, newTitle, newArticle, category);
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

  const handleEdit = async () => {
    setNewTitle(title);
    setNewArticle(article);

    setEditId(id);
    console.log(editId);
    console.log(result);
    setShowEdit(true);
  };
  return (
    // <div className="topic-card">
    //   <div className="card-header">
    //     <h4 className="card-title">
    //       Practical: How to solve quadratic equations?
    //     </h4>
    //     <span className="card-meta">Posted by Student • 2 days ago</span>
    //   </div>
    //   {show && (
    //     <div className="card-body">
    //       <p>
    //         I&apos;m struggling with understanding the quadratic formula. Can
    //         someone explain how to apply it to solve 2x² + 5x - 3 = 0 step by
    //         step?
    //       </p>
    //     </div>
    //   )}
    //   {show && (
    //     <div className="card-actions hidden">
    //       <button className="icon-btn">
    //         <Image src="./like.svg" width={20} height={20} alt="" /> 5
    //       </button>
    //       <button onClick={() => answer()} className="icon-btn">
    //         <Image src="./comment.svg" width={21} height={21} alt="" /> 3
    //       </button>
    //     </div>
    //   )}

    //   <div className={`answer-section ${isActive ? "active" : ""}`}>
    //     <div className="answer-input">
    //       <textarea placeholder="Write your answer..."></textarea>
    //       <button className="primary-btn">Post Answer</button>
    //     </div>
    //     <div className="answers-list">
    //       <div className="answer">
    //         <strong>Teacher:</strong> Let&apos;s break it down: 1) Identify a=2,
    //         b=5, c=-3...
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div className={`topic-card ${deleted ? "hid" : ""}`}>
      <div className="card-header">
        <div>
          <h4 className="card-title">Practical: {title}</h4>
          <span className="card-meta">{category}</span>
          <span className="card-meta">
            Posted by {role} • {name} • {dateOnly}
          </span>
        </div>
        {edit && (
          <div className="edit-delete">
            <Image
              onClick={() => handleEdit()}
              className="edit-blog"
              src={"./edit.svg"}
              width={20}
              height={20}
              alt=""
            />
            <Image
              onClick={() => handleDelete()}
              className="edit-blog"
              src={"./delete.svg"}
              width={20}
              height={20}
              alt=""
            />
          </div>
        )}
      </div>
      {show && (
        <div className="card-body">
          <p>{article}</p>
        </div>
      )}
      {show && (
        <div className="card-actions hidden">
          <button className="icon-btn">
            <Image src="./like.svg" width={20} height={20} alt="" /> 5
          </button>
          <button onClick={() => answer()} className="icon-btn">
            <Image src="./comment.svg" width={21} height={21} alt="" />{" "}
            {commentNumber}
          </button>
        </div>
      )}

      <div className={`answer-section ${isActive ? "active" : ""}`}>
        <div className="answer-input">
          <textarea
            value={comment}
            placeholder="Write your answer..."
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
          <button className="primary-btn" onClick={handelAddComment}>
            Post Answer
          </button>
        </div>
        <div className="answers-list">
          {Array.isArray(comments) && comments.length > 0
            ? comments.map((item) => (
                <Comment
                  key={item._id}
                  role={item.role}
                  name={item.name}
                  comment={item.comment}
                />
              ))
            : !commentsLoading && (
                <div className="no-comments">
                  <p>No comments yet. Leave the first one!</p>
                </div>
              )}
          {commentsLoading && <Loading2 />}
        </div>
      </div>

      {showEdit && (
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
              <div className="button-group-blog">
                <button type="submit" onClick={handleEditApi}>
                  {isLoading ? "Updating..." : "Submit"}
                </button>
                <button type="button" onClick={() => setShowEdit(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

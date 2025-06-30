"use client";
import Image from "next/image";
import "./style.css";
import "../../globals.css";
import { ForumCard } from "../../../components/forum-card/forum-card";
import { useCallback, useEffect, useState } from "react";
import { apiUrl } from "@/components/url";
import Success from "../../../components/Success/success-text";
import { GetBlogsType } from "@/types/type";
import Loading from "@/components/loading/Loading";

export default function Discussions() {
  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [blogAdd, setBlogAdd] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [emptyCategory, setEmptyCategory] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [title, setTitle] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [article, setArticle] = useState<string>("");
  const [blogs, setBlogs] = useState<GetBlogsType[]>([]);
  const [category, setCategory] = useState<string>("");

  const handleGetAllBlogs = useCallback(async () => {
    setLoading(true);
    // setError(null);

    try {
      const token = localStorage.getItem("token") || "";
      const response = await fetch(`${apiUrl}/blog/all?page=${1}&limit=${120}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      setBlogs(data.blogs);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Request failed:", errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []); 

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      await handleGetAllBlogs();
    };
    fetchData();
  }, [handleGetAllBlogs]);

  const submitBlog = async () => {
    setBlogAdd(true);
    try {
      console.log("start-2");
      console.log(title);
      console.log(article);
      console.log(category);
      const response = await fetch(apiUrl + `/blog`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token") || "",
        },
        body: JSON.stringify({
          title: title,
          article: article,
          category: category,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Handle successful login
      setSuccess(true);
      console.log("successful ");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setBlogAdd(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (category == "") {
      setEmptyCategory(true);
      return
    }
    setEmptyCategory(false);
    submitBlog();
    if (error) console.log(error);
  };

  const [activeTab, setActiveTab] = useState<
    "all" | "programming" | "math" | "english" | "physics" | "general"
  >("all");

  const filteredBlogs = Array.isArray(blogs)
    ? blogs.filter((type) => activeTab === "all" || type.category === activeTab)
    : [blogs];

  // console.log(filteredBlogs);
  console.log(blogs);

  return (
    <div className="forum-container">
      <div className="forum-header">
        <div className="text-header">
          <h3>Forum</h3>
          <p>
            Discuss topics, ask questions, and share ideas with calssmates and
            teachers.
          </p>
        </div>

        <button className="new-topics" onClick={() => setShowAdd(true)}>
          <Image src="./plus.svg" width={13} height={13} alt="" />
          <span>New Topics</span>
        </button>
      </div>
      <div className="forum-main">
        <div className="forum-first">
          <input type="search" placeholder="Search topics..." />
          <div className="select-task">
            <div className="tabs">
              <button
                className={activeTab === "all" ? "active" : ""}
                onClick={() => setActiveTab("all")}
              >
                All
              </button>
              <button
                className={activeTab === "general" ? "active" : ""}
                onClick={() => setActiveTab("general")}
              >
                General
              </button>
              <button
                className={activeTab === "programming" ? "active" : ""}
                onClick={() => setActiveTab("programming")}
              >
                Programming
              </button>
              <button
                className={activeTab === "math" ? "active" : ""}
                onClick={() => setActiveTab("math")}
              >
                Math
              </button>
              <button
                className={activeTab === "english" ? "active" : ""}
                onClick={() => setActiveTab("english")}
              >
                English
              </button>
              <button
                className={activeTab === "physics" ? "active" : ""}
                onClick={() => setActiveTab("physics")}
              >
                Physics
              </button>
            </div>
          </div>
          <div className="topics-exist">
            {loading && <Loading />}
            {filteredBlogs.length > 0
              ? filteredBlogs.map((item) => (
                  <ForumCard
                    key={item._id}
                    title={item.title}
                    article={item.article}
                    category={item.category}
                    show={true}
                    createdAt={item.createdAt}
                    id={item._id}
                    name={item.name}
                    role={item.role}
                    edit={false}
                    // commentNumber={"4"}
                  />
                ))
              : !loading && (
                  <div className="forum-file">
                    <Image src="./message2.svg" width={40} height={40} alt="" />
                    <h3>No topics found</h3>
                    <p>Be the first to start a discussion</p>
                    <button onClick={() => setShowAdd(true)}>
                      Create topic
                    </button>
                  </div>
                )}
          </div>
        </div>
        <div className="forum-second">
          <Image src="./message2.svg" width={40} height={40} alt="" />
          <h3>Select a Topic</h3>
          <p>
            Choose a discussion topic from the list to view replies or start a
            new discussion by clicking the &quot;New Topic&quot; button.
          </p>
          <button className="btn" onClick={() => setShowAdd(true)}>
            Create topic
          </button>
        </div>
      </div>

      {showAdd && (
        <div className="modal-overlay">
          <div className="flow-card">
            <div className="add-post">
              <h3>Create New Topic</h3>
              <p>
                Start a discussion, ask a question, or share information with
                your peers.
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter topic title"
                  required
                  className="blog-input"
                />
              </div>
              <div className="select-group">
                <label htmlFor="category">Category</label>
                <select
                  value={category}
                  id="category"
                  name="category"
                  onChange={(e) => setCategory(e.target.value)}
                  className="category-select"
                >
                  <option value="">Select a category</option>
                  <option value="general">General</option>
                  <option value="programming">Programming</option>
                  <option value="math">Math</option>
                  <option value="english">English</option>
                  <option value="physics">Physics</option>
                </select>
              </div>
              <div className="input-group">
                <label>Content</label>
                <textarea
                  value={article}
                  onChange={(e) => setArticle(e.target.value)}
                  placeholder="Describe your topic or qquestion in detail"
                  required
                  className="blog-input blog-textarea"
                />
              </div>
              <div className="button-group">
                {success && <Success text={"The topic added succesfully"} />}
                {emptyCategory && (
                  <div className="failed-message">
                    Please fill in all fields
                  </div>
                )}
                <button
                  type="button"
                  className="close-button"
                  onClick={() => setShowAdd(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="post-button">
                  {blogAdd ? "Updating..." : "Post Topic"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";
import Image from "next/image";
import "./style.css";
import { useCallback, useEffect, useState } from "react";
import { GetBlogsType } from "@/types/type";
import { ForumCard } from "../../../components/forum-card/forum-card";
import { AuthGuard } from "@/components/AuthGuard";
import { useRouter } from "next/navigation";
import { apiUrl } from "@/components/url";
import SuccessCard from "@/components/success-card/SuccessCard";
import Loading5 from "@/components/loading5/Loading5";
import Loading from "@/components/loading/Loading";
import Cookies from "js-cookie";

export default function Discussions() {
  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [blogAdd, setBlogAdd] = useState<boolean>(false);
  const [emptyCategory, setEmptyCategory] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [title, setTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [blogs, setBlogs] = useState<GetBlogsType[]>([]);
  const [article, setArticle] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const router = useRouter();

  const handleGetAllBlogs = useCallback(async () => {
    setLoading(true);
    // setError(null);

    try {
      const token = Cookies.get("token") || "";
      const response = await fetch(
        `${apiUrl}/blog/all?page=${1}&limit=${120}`,
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
          token: Cookies.get("token") || "",
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
      setShowAdd(false);
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
      return;
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

  const filteredLessonsSearch = filteredBlogs.filter((lesson) =>
    lesson.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleGetBlog = (id: string) => {
    router.push(`discussions/${id}`);
  };

  return (
    <AuthGuard allowedRoles={["admin", "teacher", "student"]}>
      <div className="forum-container">
        <div className="forum-header">
          <div className="text-header">
            <h3 className="font-semibold text-2xl">Forum</h3>
            <p className="text-sm text-[#737373]">
              Discuss topics, ask questions, and share ideas with calssmates and
              teachers.
            </p>
          </div>

          <button className="add-topic-button" onClick={() => setShowAdd(true)}>
            <Image
              src="./plus.svg"
              width={13}
              height={13}
              alt=""
              className="inline"
            />
            <span className="text-sm">New Topics</span>
          </button>
        </div>

        <div className="forum-main">
          <div className="forum-first">
            <input
              className="placeholder-text-sm forum-input"
              type="search"
              placeholder="Search topics by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="bg-[#f5f5f5] rounded-md overflow-hidden">
              <div className="forum-tabs ">
                <button
                  className={`forum-category ${
                    activeTab === "all" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("all")}
                >
                  All
                </button>
                <button
                  className={`forum-category ${
                    activeTab === "general" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("general")}
                >
                  General
                </button>
                <button
                  className={`forum-category ${
                    activeTab === "programming" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("programming")}
                >
                  Programming
                </button>
                <button
                  className={`forum-category ${
                    activeTab === "math" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("math")}
                >
                  Math
                </button>
                <button
                  className={`forum-category ${
                    activeTab === "english" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("english")}
                >
                  English
                </button>
                <button
                  className={`forum-category ${
                    activeTab === "physics" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("physics")}
                >
                  Physics
                </button>
              </div>
            </div>

            <div className="topics-exist">
              {loading && <Loading />}
              {filteredLessonsSearch.length > 0
                ? filteredLessonsSearch.map((item) => (
                    <div
                      onClick={() => handleGetBlog(item._id)}
                      key={item._id}
                      className="cursor-pointer"
                    >
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
                        vote={item.vote}
                      />
                    </div>
                  ))
                : !loading && (
                    <div className="forum-file">
                      <Image
                        src="./message2.svg"
                        width={40}
                        height={40}
                        alt=""
                      />
                      <h3 className="forum-file-h3">No topics found</h3>
                      <p className="forum-file-p">
                        Be the first to start a discussion
                      </p>
                      <button
                        className="forum-file-button cursor-pointer"
                        onClick={() => setShowAdd(true)}
                      >
                        Create topic
                      </button>
                    </div>
                  )}
            </div>
          </div>
          <div className="forum-second">
            <Image src="./message2.svg" width={40} height={40} alt="" />
            <h3 className="forum-second-h3">Select a Topic</h3>
            <p className="forum-second-p">
              Choose a discussion topic from the list to view replies or start a
              new discussion by clicking the &quot;New Topic&quot; button.
            </p>
            <button
              content="forum-second-button"
              className="bg-[#4351af] text-white p-3 rounded-md"
              onClick={() => setShowAdd(true)}
            >
              Create topic
            </button>
          </div>
        </div>

        {success && (
          <SuccessCard
            text="The topic added succesfully"
            onClose={() => setSuccess(false)}
            duration={3000} // 3 seconds
          />
        )}
        {showAdd && (
          <div className="modal-overlay">
            <div className="flow-card">
              <div className="add-post">
                <h3 className="text-xl font-medium">Create New Topic</h3>
                <p className="text-sm text-gray-500">
                  Start a discussion, ask a question, or share information with
                  your peers.
                </p>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <label htmlFor="title" className="text-lg">
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter topic title"
                    required
                    className="blog-input"
                  />
                </div>
                <div className="select-group">
                  <label htmlFor="category" className="text-lg">
                    Category
                  </label>
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
                  <label htmlFor="content" className="text-lg">
                    Content
                  </label>
                  <textarea
                    id="content"
                    value={article}
                    onChange={(e) => setArticle(e.target.value)}
                    placeholder="Describe your topic or qquestion in detail"
                    required
                    className="blog-input blog-textarea"
                  />
                </div>
                <div className="button-group">
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
                    {blogAdd ? (
                      <div className="mt-1.5">
                        <Loading5 />
                      </div>
                    ) : (
                      "Post Topic"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}

"use client";
import { ForumCard } from "@/components/forum-card/forum-card";
import Loading from "@/components/loading/Loading";
import { apiUrl } from "@/components/url";
import { GetBlogsType } from "@/types/type";
import { useCallback, useEffect, useState } from "react";
import "./../../globals.css";
import "./style.css";
import { AuthGuard } from "@/components/AuthGuard";

export default function BlogArchive() {
  const [blogs, setBlogs] = useState<GetBlogsType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleGetAllBlogs = useCallback(async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token") || "";
      const response = await fetch(
        `${apiUrl}/blog/my/all?page=${1}&limit=${10}`,
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
      // console.log(error);
      console.error("Request failed:", errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []); // Added numberOfLessons to dependencies

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      await handleGetAllBlogs();
    };
    fetchData();
  }, [handleGetAllBlogs]);

  // return loading && <Loading />;

  return (
    <AuthGuard allowedRoles={["admin", "teacher", "student"]}>
      <div className="my-blog">
        {loading && <Loading />}
        {!loading &&
          blogs.map((item) => (
            <ForumCard
              key={item._id}
              title={item.title}
              article={"lorem asdasd "}
              category={item.category}
              show={true}
              createdAt={item.createdAt}
              id={item._id}
              name={item.name}
              role={item.role}
              edit={true}
            />
          ))}
        {error && !error && <h1>{error}</h1>}
      </div>
    </AuthGuard>
  );
}

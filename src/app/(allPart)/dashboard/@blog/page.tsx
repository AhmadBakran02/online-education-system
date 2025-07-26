"use client";
import { useCallback, useEffect, useState } from "react";
import { GetBlogsType } from "@/types/type";
import Image from "next/image";
import "./style.css";
import Cookies from "js-cookie";
import { apiUrl } from "@/components/url";
import { ForumCard } from "@/components/forum-card/forum-card";
import Loading from "@/components/loading/Loading";

export default function BlogDash() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [blogs, setBlogs] = useState<GetBlogsType[]>([]);

  const handleGetAllBlogs = useCallback(async () => {
    setLoading(true);
    // setError(null);

    try {
      const token = Cookies.get("token") || "";
      const response = await fetch(`${apiUrl}/blog/all?page=${1}&limit=${3}`, {
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

  if (error) console.log(error);

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      await handleGetAllBlogs();
    };
    fetchData();
  }, [handleGetAllBlogs]);

  return (
    <div className="topics-exist">
      {loading && <Loading />}
      {blogs.length > 0
        ? blogs.map((item) => (
            <ForumCard
              key={item._id}
              title={item.title}
              article={item.article}
              category={item.category}
              show={false}
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
            </div>
          )}
    </div>
  );
}

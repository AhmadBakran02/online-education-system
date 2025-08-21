"use client";
import { ForumCard } from "@/components/forum-card/forum-card";
import { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { apiUrl } from "@/components/url";
import { GetBlogsType } from "@/types/type";
import { usePathname } from "next/navigation";
import "./style.css";
import Loading from "@/components/loading/Loading";

export default function BlogID() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [blog, setBlog] = useState<GetBlogsType>();
  const pathName = usePathname();
  const id = pathName.split("/").pop();

  const handleGetAllBlog = useCallback(async () => {
    setLoading(true);
 
    try {
      const token = Cookies.get("token") || "";
      const response = await fetch(`${apiUrl}/blog?blogID=${id}`, {
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
      setBlog(data.blog);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.log(error);
      console.error("Request failed:", errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [error, id]);

  useEffect(() => {
    const fetchData = async () => {
      await handleGetAllBlog();
    };
    fetchData();
  }, [handleGetAllBlog]);

  if (loading) return <Loading />;
  return (
    <div className="one-blog-page">
      <ForumCard
        title={blog?.title || "..."}
        article={blog?.article || "..."}
        category={blog?.category || "..."}
        show={true}
        createdAt={blog?.createdAt || "..."}
        id={blog?._id || "..."}
        name={blog?.name || "..."}
        role={blog?.role || "..."}
        edit={false}
        vote={blog?.vote || "null"}
      />
    </div>
  );
}

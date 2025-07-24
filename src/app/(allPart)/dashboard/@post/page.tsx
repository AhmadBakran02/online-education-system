"use client";
import { apiUrl } from "@/components/url";
import { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { GetPost } from "@/types/type";
import "./style.css";
import { useRouter } from "next/navigation";
export default function PostDash() {
  const [loading, setLoading] = useState<boolean>(false);
  const [postItems, setPostItems] = useState<GetPost[]>([]);
  const router = useRouter();
  const handleGetAllPost = useCallback(async () => {
    setLoading(true);
    // setError(null);

    try {
      const token = Cookies.get("token") || "";
      const response = await fetch(apiUrl + `/post/all?limit=2&page=1`, {
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
      setPostItems(data.posts);
      return data.posts;
    } catch (error) {
      console.error("Request failed:", error);
      // setError(error instanceof Error ? error.message : "Request failed");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await handleGetAllPost();
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };

    fetchData();
  }, [handleGetAllPost]);

  const handleShowPost = (id: string) => {
    router.push(`/post/${id}`);
  };

  return (
    <div className="all-post-dash">
      {!loading &&
        postItems.map((post) => (
          <div
            key={post._id}
            className="post-dash"
            onClick={() => handleShowPost(post._id)}
          >
            <h2>{post.title}</h2>
            <p>{post.article}</p>
          </div>
        ))}
    </div>
  );
}

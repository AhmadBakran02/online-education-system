"use client";
import "./style.css";
// import { Card } from "../lessons-card/lessons-card";
import { useEffect, useState, useCallback } from "react";
import Loading from "../../../../components/loading/Loading";
// import { LessonsType } from "../../interfaces/type";
import { GetPost } from "../../../interfaces/type";
import Image from "next/image";
import Link from "next/link";

// interface NumPage {
//   page: string;
//   limit: string;
// }

export default function Post() {
  const [postsItems, setPostsItems] = useState<GetPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleGetAllPost = useCallback(async () => {
    setLoading(true);
    setError(null);
    console.log(error);

    try {
      const token = localStorage.getItem("token") || "";
      const response = await fetch(
        `https://online-education-system-quch.onrender.com/post/all?limit=10&page=1`,
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
      setPostsItems(data.posts);
      return data;
    } catch (error) {
      console.error("Request failed:", error);
      setError(error instanceof Error ? error.message : "Request failed");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [error]); // Empty dependency array since we don't use any external values

  useEffect(() => {
    handleGetAllPost();
  }, [handleGetAllPost]);

  return (
    <div className="lessons-main">
      {loading && <Loading />}
      {!loading &&
        postsItems.map((index) => (
          <div
            key={index._id}
            className="post bg-white rounded-lg overflow-hidden"
          >
            <Image
              src={`/images/pic2.jpg`}
              alt={`Event ${index}`}
              width={200}
              height={10}
              className="object-cover w-full h-48"
            />
            <div className="post-body">
              <Link href={`post/${index._id}`}>
                <h3 className="text-lg font-semibold post-title">
                  {index.title}
                </h3>
              </Link>
              <p className="text-sm text-gray-600 post-article">
                {index.article}
              </p>
            </div>
          </div>
        ))}
    </div>
  );
}

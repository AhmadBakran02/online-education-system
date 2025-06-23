"use client";
import "./style.css";
// import { Card } from "../lessons-card/lessons-card";
import { useEffect, useState, useCallback } from "react";
import Loading from "../loading/Loading";
// import { LessonsType } from "../../interfaces/type";
import { GetPost } from "../../interfaces/type";
// import Image from "next/image";
// import Link from "next/link";
import { PostCard } from "../post-card/post-card";

// interface NumPage {
//   page: string;
//   limit: string;
// }

export default function DeletePosts() {
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
    <div className="lessons-container">
      <div className="lessons-header">
        <h3>Post</h3>
        <p>Add new post, events and activities.</p>
      </div>

      <div className="lessons-main">
        {loading && <Loading />}
        {!loading && postsItems.length > 0
          ? postsItems.map((index) => (
              <PostCard
                key={index._id}
                _id={index._id}
                title={index.title}
                article={index.article}
                postedBy={""}
                photoID={index.photoID}
                __v={0}
              />
            ))
          : !loading && (
              <h3>No posts found.</h3>
            )}
        {/* {!loading &&
          postsItems.map((index) => (
            <PostCard
              key={index._id}
              _id={index._id}
              title={index.title}
              article={index.article}
              postedBy={""}
              photoID={index.photoID}
              __v={0}
            />
          ))} */}
      </div>
    </div>
  );
}

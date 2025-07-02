"use client";
import "./style.css";
import { useEffect, useState, useCallback } from "react";
// import Loading from "@/components/loading/Loading";
import { GetPost } from "../../../types/type";
import { PostCard } from "@/components/post-card/post-card";
import { apiUrl } from "@/components/url";
import { AuthGuard } from "@/components/AuthGuard";

export default function EditePosts() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [photoUrls, setPhotoUrls] = useState<Record<string, string>>({}); // { photoID: url }
  const [postItems, setPostItems] = useState<GetPost[]>([]);

  const handleGetAllPost = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token") || "";
      const response = await fetch(apiUrl + `/post/all?limit=10&page=1`, {
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
      setError(error instanceof Error ? error.message : "Request failed");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch photo URLs for all posts
  const fetchPhotoUrls = useCallback(async (posts: GetPost[]) => {
    try {
      const token = localStorage.getItem("token") || "";
      const urls: Record<string, string> = {};

      // Process posts with photoIDs in parallel
      await Promise.all(
        posts.map(async (post) => {
          if (!post.photoID) return;

          try {
            const response = await fetch(
              apiUrl + `/file?fileID=${post.photoID}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  token,
                },
              }
            );

            if (!response.ok) throw new Error(`Error: ${response.status}`);

            const contentType = response.headers.get("content-type");
            if (!contentType?.startsWith("image/")) {
              throw new Error("Received data is not an image");
            }

            const blob = await response.blob();
            urls[post.photoID] = URL.createObjectURL(blob);
            console.log(urls[post.photoID]);
          } catch (err) {
            console.error(`Error fetching photo ${post.photoID}:`, err);
            // Fallback to default image if there's an error
            urls[post.photoID] = "/images/pic2.jpg";
          }
        })
      );

      setPhotoUrls(urls);
      console.log(urls);
    } catch (error) {
      console.error("Error in fetchPhotoUrls:", error);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const posts = await handleGetAllPost();
        await fetchPhotoUrls(posts);
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };

    fetchData();
  }, [handleGetAllPost, fetchPhotoUrls]);

  return (
    <AuthGuard allowedRoles={["admin"]}>
      <div className="lessons-container">
        <div className="lessons-header">
          <h3>Post</h3>
          <p>Add new post, events and activities.</p>
        </div>

        <div className="lessons-main">
          {loading &&
            [1, 2, 3, 4, 5].map((index) => (
              <PostCard
                key={index.toString()}
                _id={index.toString()}
                postedBy={""}
                title={"Loading..."}
                article={"Loading content..."}
                photoUrl={""}
                __v={0}
                editPost={false}
                photoID={""}
                showFull={false}
              />
            ))}
          {error && <div className="error-message">{error}</div>}
          {!loading &&
            postItems.length > 0 &&
            postItems.map((post) => (
              <PostCard
                key={post._id}
                _id={post._id}
                title={post.title}
                article={post.article}
                postedBy={""}
                photoUrl={photoUrls[post.photoID]}
                __v={0}
                editPost={true}
                photoID={post.photoID}
                showFull={false}
              />
            ))}
        </div>
        {!loading && postItems.length == 0 && (
          <h3 className="no-item">No posts found</h3>
        )}
      </div>
    </AuthGuard>
  );
}

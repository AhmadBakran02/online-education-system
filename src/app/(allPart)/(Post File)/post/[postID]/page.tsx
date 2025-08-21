"use client";
import "./style.css";
import { useCallback, useEffect, useState } from "react";
import { OnePost } from "../../../../../types/type";
import { usePathname } from "next/navigation";
import { apiUrl } from "@/components/url";
import Image from "next/image";
import Loading from "@/components/loading/Loading";
import Cookies from "js-cookie";

export default function Post() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [url, setUrl] = useState<string>("/images/pic2.jpg");
  const [postItems, setPostItems] = useState<OnePost>({
    _id: "685985e93a6ce92e99a654b2",
    postedBy: "6855b2861b2eec2da05b4415",
    title: "Loading...",
    article: "Loading...",
    photoID: "",
    __v: 0,
  });
  const [id, setId] = useState<string | null>(null);

  const pathname = usePathname();

  // 1. Get ID from URL path
  useEffect(() => {
    const newId = pathname.split("/")[2];
    setId(newId);
  }, [pathname]);

  // 2. Fetch post data when ID changes
  const handleGetPost = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const token = Cookies.get("token") || "";
      const response = await fetch(`${apiUrl}/post?postID=${id}`, {
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
      setPostItems(data.post);
      return data.post._id;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Request failed:", errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // 3. Fetch photo URL when post data changes
  const fetchPhotoUrl = useCallback(async () => {
    if (!postItems.photoID) return;

    try {
      const response = await fetch(
        `${apiUrl}/file?fileID=${postItems.photoID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: Cookies.get("token") || "",
          },
        }
      );

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const contentType = response.headers.get("content-type");
      if (!contentType?.startsWith("image/")) {
        throw new Error("Received data is not an image");
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      // setPhotoUrl((prev) => ({ ...prev, [postItems.photoID]: objectUrl }));
      setUrl(objectUrl);
    } catch (err) {
      console.error(`Error fetching photo ${postItems.photoID}:`, err);
      setUrl("/images/pic2.jpg");
    }
  }, [postItems.photoID]);

  // Main effect to sequence the operations
  useEffect(() => {
    const fetchData = async () => {
      try {
        await handleGetPost();
        await fetchPhotoUrl();
      } catch (error) {
        console.error("Error in data fetching sequence:", error);
      }
    };

    fetchData();
  }, [handleGetPost, fetchPhotoUrl]);

  function isValidUrl(string: string) {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  }

  if (loading || error) return <Loading />;
  return (
    <div
      key={postItems._id}
      className={`post bg-white rounded-lg overflow-hidden`}
    >
      <Image
        src={url && isValidUrl(url) ? url : "/images/pic2.jpg"}
        alt={`Event ${postItems._id}`}
        width={200}
        height={200}
        className="object-cover w-full h-48"
      />
      <div
        className={`post-body "justify-evenly gap-6"
        `}
      >
        <h3 className="text-lg font-semibold">{postItems.title}</h3>
        <p className={`text-sm text-gray-600 show-full my-5`}>
          {postItems.article}
        </p>
      </div>
    </div>
  );
}

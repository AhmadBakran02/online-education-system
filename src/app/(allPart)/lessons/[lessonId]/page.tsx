"use client"; // Required since we're using client-side hooks

import { Lesson } from "@/types/type";
import { apiUrl } from "@/components/url";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import "./style.css";
import Loading from "@/components/loading/Loading";
import Link from "next/link";
import Downloading from "@/components/downloading/downloading";
import VideoDownload from "@/components/video-download/VideoDownload";

export default function LessonId() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [lessonId, setLessonId] = useState<string>("");
  // const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [videoLoading, setVideoLoading] = useState<boolean>(false);
  // const [isUploading, setIsUploading] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [lessonItems, setLessonItems] = useState<Lesson | null>(null);

  useEffect(() => {
    // If you just need the path and query
    const pathWithQuery = `${pathname}${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;
    console.log("Path with query:", pathWithQuery);
    setLessonId(pathWithQuery.substring(9));
  }, [pathname, searchParams]);

  const handleGetLesson = useCallback(async () => {
    setLoading(true);
    setError(null);
    if (lessonId.length < 1) return;

    try {
      const token = localStorage.getItem("token") || "";
      const response = await fetch(apiUrl + `/lesson?lessonID=` + lessonId, {
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
      setLessonItems(data.Lesson);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Request failed:", errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [lessonId]); 

  useEffect(() => {
    const fetchData = async () => {
      await handleGetLesson();
    };
    fetchData();
  }, [lessonId, handleGetLesson]);

  const handleDownload = async () => {
    if (lessonItems?.pdfID == "") return;

    setDownloading(true);
    setError(null);

    try {
      // 1. Get token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // 3. Make the API call
      const response = await fetch(
        apiUrl + `/file?fileID=${lessonItems?.pdfID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        }
      );

      // 4. Handle errors
      if (!response.ok) {
        console.log(error);
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to download PDF");
      }
      console.log("sss");

      // 5. Extract filename from headers or use default
      const contentDisposition = response.headers.get("content-disposition");
      const filenameMatch = contentDisposition?.match(
        /filename="?(.+?)"?(;|$)/
      );
      const filename = filenameMatch?.[1] || "document.pdf";

      // 6. Create and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      setDownloading(false);
    } catch (err) {
      console.error("Download error:", err);
      setError(err instanceof Error ? err.message : "Failed to download PDF");
    } finally {
      setLoading(false);
    }
  };

  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    // console.log(lessonItems?.videoID);
    setVideoLoading(true);
    if (lessonItems?.videoID.length || 0 < 10) return;

    const fetchVideo = async () => {
      setError("");
      try {
        const token = localStorage.getItem("token") || "";

        if (!lessonItems?.videoID) {
          throw new Error("No video ID provided");
        }

        const response = await fetch(
          apiUrl + `/file?fileID=${lessonItems?.videoID}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              token,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType?.startsWith("video/")) {
          throw new Error("Received data is not a video");
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch video");
        console.error("Error fetching video:", err);
      } finally {
        setVideoLoading(false);
      }
    };
    if (lessonItems?.videoID) {
      fetchVideo();
    }

    // Cleanup function to revoke object URL
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [lessonItems?.videoID, videoUrl]);

  return (
    <div className="post-page">
      <div className="post-body">
        <div className="lesson-title">
          <h1>{lessonItems?.title}</h1>
        </div>
        <p className="lesson-description">{lessonItems?.description}</p>
        {loading && <Loading />}
        {(lessonItems?.videoID.length || 0) > 1 && !loading && (
          <div
          className="video-container"
          style={{
            border: "2px solid #ddd",
            borderRadius: "8px",
            width: "100%",
            maxWidth: "800px",
            aspectRatio: "16/9",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f5f5f5",
            position: "relative",
            overflow: "hidden",
          }}
          >
            {error && (
              <div className="error-message">
                <p>Error: {error}</p>
              </div>
            )}

            {videoLoading && <VideoDownload />}
            {videoUrl && (
              <video
                controls
                autoPlay
                muted
                className="lesson-video"
                style={{
                  objectFit: "contain",
                  display: loading ? "none" : "block",
                }}
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        )}
        <div className="pdf-body">
          <p className="pdf-text">You can download the PDF File from here</p>
          <button
            type="button"
            name="download-button"
            className="download-button"
            onClick={handleDownload}
          >
            {downloading ? (
              <div className="downloading-button">
                Downloading
                <Downloading />
              </div>
            ) : (
              "Download"
            )}
          </button>
        </div>

        <Link href={`${lessonId}/ai-quiz`}>
          <div className="ai-body">
            <p className="ai-text">Give me practice questions by</p>
            <div className="ai-text-animation">
              <span className="letter">G</span>
              <span className="letter">e</span>
              <span className="letter">m</span>
              <span className="letter">i</span>
              <span className="letter">n</span>
              <span className="letter">i</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

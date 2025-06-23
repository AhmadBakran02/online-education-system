"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface VideoPlayerProps {
  viID: string;
}

export const VideoPlayer = ({ viID }: VideoPlayerProps) => {
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);

  const fetchVideo = useCallback(async () => {
    if (!viID) {
      setError("No video ID provided");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token") || "";
      const response = await fetch(
        `https://online-education-system-quch.onrender.com/file?fileID=${viID}`,
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

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch video");
    } finally {
      setLoading(false);
    }
  }, [viID]);

  useEffect(() => {
    if (viID) {
      fetchVideo();
    }

    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [viID, fetchVideo, videoUrl]);

  if (!viID) return null;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1>Video Player</h1>

      {error && (
        <div style={{ color: "red", marginBottom: "20px" }}>{error}</div>
      )}

      {loading && <div>Loading video...</div>}

      {videoUrl && (
        <div>
          <video
            ref={videoRef}
            controls
            autoPlay
            style={{
              width: "100%",
              maxHeight: "500px",
              backgroundColor: "#000",
            }}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div style={{ marginTop: "10px", fontSize: "14px", color: "#666" }}>
            Now playing: {viID}
          </div>
        </div>
      )}
    </div>
  );
};

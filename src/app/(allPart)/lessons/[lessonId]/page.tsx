"use client";

import { Lesson } from "@/types/type";
import { apiUrl } from "@/components/url";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import "./style.css";
import Loading from "@/components/loading/Loading";
import Link from "next/link";
import Downloading from "@/components/downloading/downloading";
import VideoDownload from "@/components/video-download/VideoDownload";
import { Download, Sparkles } from "lucide-react";

export default function LessonPage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [lessonId, setLessonId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [videoLoading, setVideoLoading] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [lessonItems, setLessonItems] = useState<Lesson | null>(null);

  useEffect(() => {
    const pathWithQuery = `${pathname}${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;
    // console.log("Path with query:", pathWithQuery);
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
    console.log(lessonItems?.videoID.length);
    setVideoLoading(true);
    if ((lessonItems?.videoID.length || 0) < 2) return;

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
        console.log("here");
        const contentType = response.headers.get("content-type");
        if (!contentType?.startsWith("video/")) {
          throw new Error("Received data is not a video");
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setVideoLoading(false);
        console.log(videoLoading);
        setVideoUrl(url);
        console.log("finsh");
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
  }, [lessonItems?.videoID, videoUrl, videoLoading]);

  //   return (
  //     <div className="post-page">
  //       {!loading && (
  //         <div className="post-body">
  //           <div className="lesson-title">
  //             <h1>{lessonItems?.title}</h1>
  //           </div>
  //           <p className="lesson-description">{lessonItems?.description}</p>
  //           {(lessonItems?.videoID.length || 0) > 1 && !loading && (
  //             <div
  //               className="video-container"
  //               style={{
  //                 border: "2px solid #ddd",
  //                 borderRadius: "8px",
  //                 width: "100%",
  //                 maxWidth: "800px",
  //                 aspectRatio: "16/9",
  //                 display: "flex",
  //                 justifyContent: "center",
  //                 alignItems: "center",
  //                 backgroundColor: "#f5f5f5",
  //                 position: "relative",
  //                 overflow: "hidden",
  //               }}
  //             >
  //               {error && (
  //                 <div className="error-message">
  //                   <p>Error: {error}</p>
  //                 </div>
  //               )}

  //
  //           <div className="pdf-body">
  //             <p className="pdf-text">You can download the PDF File from here</p>
  //             <button
  //               type="button"
  //               name="download-button"
  //               className="download-button"
  //               onClick={handleDownload}
  //             >
  //               {downloading ? (
  //                 <div className="downloading-button">
  //                   Downloading
  //                   <Downloading />
  //                 </div>
  //               ) : (
  //                 "Download"
  //               )}
  //             </button>
  //           </div>

  //           <Link href={`${lessonId}/ai-quiz`}>
  //             <div className="ai-body">
  //               <p className="ai-text">Give me practice questions by</p>
  //               <div className="ai-text-animation">
  //                 <span className="letter">G</span>
  //                 <span className="letter">e</span>
  //                 <span className="letter">m</span>
  //                 <span className="letter">i</span>
  //                 <span className="letter">n</span>
  //                 <span className="letter">i</span>
  //               </div>
  //             </div>
  //           </Link>
  //         </div>
  //       )}
  //       {loading && <Loading />}
  //     </div>
  //   );
  // }
  console.log(lessonItems?.videoID);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="container mx-auto">
        {/* Lesson Title and Metadata */}
        {loading && <Loading />}
        {!loading && (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {lessonItems?.title}
              </h2>
            </div>

            {/* Two-column layout */}
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Column - Video and Description */}
              <div className="lg:w-2/3">
                {/* Video Player */}
                <div className="bg-black rounded-lg overflow-hidden mb-6 aspect-video">
                  <div className="w-full h-full flex items-center justify-center text-white">
                    {/* <p className="text-xl">Video Player Will Appear Here</p> */}
                    {!videoUrl && <VideoDownload />}
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
                </div>

                {/* Lesson Description */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    Lesson Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {lessonItems?.description}
                  </p>
                </div>
              </div>

              {/* Right Column - Resources and Actions */}
              <div className="lg:w-1/3">
                {/* Download Card */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    Lesson Materials
                  </h3>
                  {/* <button className=""></button> */}
                  <button
                    type="button"
                    name="download-button"
                    className="download-button w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg transition-colors"
                    onClick={handleDownload}
                  >
                    {downloading ? (
                      <div className="downloading-button">
                        Downloading
                        <Downloading />
                      </div>
                    ) : (
                      <>
                        <Download size={18} />
                        Download PDF File
                      </>
                    )}
                  </button>
                </div>

                {/* Generate Quiz Card */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    Practice Questions
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Generate customized practice questions using AI
                  </p>
                  <Link href={`${lessonId}/ai-quiz`}>
                    <button className="ai-button w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-lg transition-colors cursor-pointer flex-wrap">
                      <Sparkles size={18} />
                      Generate Questions with
                      <div className="ai-text-animation">
                        <span className="letter">G</span>
                        <span className="letter">e</span>
                        <span className="letter">m</span>
                        <span className="letter">i</span>
                        <span className="letter">n</span>
                        <span className="letter">i</span>
                      </div>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

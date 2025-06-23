"use client";

import { useState } from "react";

const PDFDownloader = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Get token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // 2. Prepare the request (replace with your actual pdfPath)
      const pdfPath =
        "/opt/render/project/src/persistent/uploads/pdfs/8321249d-ffe8-40e0-9849-e622b041b80d.pdf";
        
      // 3. Make the API call
      const response = await fetch(
        "https://online-education-system-quch.onrender.com/file/stream",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify({ filePath: pdfPath }),
        }
      );

      // 4. Handle errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to download PDF");
      }

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
    } catch (err) {
      console.error("Download error:", err);
      setError(err instanceof Error ? err.message : "Failed to download PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleDownload}
        disabled={loading}
        style={{
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        {loading ? "Downloading..." : "Download PDF"}
      </button>

      {error && (
        <div style={{ color: "red", marginTop: "10px" }}>Error: {error}</div>
      )}
    </div>
  );
};

export default PDFDownloader;

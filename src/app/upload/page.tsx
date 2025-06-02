"use client";
import { useState } from "react";

export default function FileUploader() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    console.log(localStorage.getItem("token"));
    if (!file) {
      setMessage("Please select a file first");
      return;
    }

    setIsUploading(true);
    setMessage("");
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Get your auth token (from localStorage, cookies, etc.)
      const token = localStorage.getItem("token"); // or from context/state

      const response = await fetch(
        "https://online-education-system-quch.onrender.com/upload",
        {
          method: "POST",
          headers: {
            token: token,
            // Don't set Content-Type - the browser will set it automatically with the boundary
          },
          body: formData,
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          },
        }
      );

      const data = await response.json();
      // console.log(data.path);
      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      setMessage("File uploaded successfully!");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="file-uploader">
      <input type="file" onChange={handleFileChange} disabled={isUploading} />
      <hr />
      <hr />
      <hr />
      <hr />
      <hr />
      <hr />
      <hr />
      <hr />
      <hr />
      <hr />
      <hr />
      <hr />
      <button onClick={handleUpload} disabled={!file || isUploading}>
        {isUploading ? "Uploading..." : "Upload File"}
      </button>

      {isUploading && (
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>
      )}

      {message && <div className="message">{message}</div>}

      <style jsx>{`
        .file-uploader {
          max-width: 500px;
          margin: 20px auto;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
        }
        .progress-bar {
          height: 10px;
          background: #f0f0f0;
          margin: 10px 0;
          border-radius: 5px;
          overflow: hidden;
        }
        .progress {
          height: 100%;
          background: #4caf50;
          transition: width 0.3s;
        }
        .message {
          margin-top: 10px;
          padding: 10px;
          border-radius: 4px;
        }
        .message.error {
          background: #ffebee;
          color: #f44336;
        }
        .message.success {
          background: #e8f5e9;
          color: #4caf50;
        }
      `}</style>
    </div>
  );
}

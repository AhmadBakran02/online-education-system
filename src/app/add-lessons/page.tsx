"use client";
import { formatDate } from "react-calendar/dist/esm/shared/dateFormatter.js";
import Sidebar from "../aside/Sidebar";
import { Header } from "../header/Header";
import "./style.css";
import { useState } from "react";

export default function AddLessons() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState("");
  const [path, setPath] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  interface LoginData {
    title: string;
    description: string;
    category: string;
    videoPath?: string;
    pdfPath: string;
  }

  const [fileInformation, setFileInformation] = useState<LoginData>({
    title: "",
    description: "",
    category: "",
    videoPath: "",
    pdfPath: "",
  });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFileInformation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpload = async () => {
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

      const response = await fetch(
        "https://online-education-system-quch.onrender.com/file/upload",
        {
          method: "POST",
          headers: {
            token: localStorage.getItem("token"),
            // Don't set Content-Type - the browser will set it automatically with the boundary
          },
          body: formData,
          // onUploadProgress: (progressEvent) => {
          //   const percentCompleted = Math.round(
          //     (progressEvent.loaded * 100) / progressEvent.total
          //   );
          //   setProgress(percentCompleted);
          // },
        }
      );

      const data = await response.json();
      console.log(data.path);
      setPath(data.path);
      setFileInformation((prevState) => ({
        ...prevState,
        pdfPath: data.path,
      }));

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      setMessage("File uploaded successfully!");
    } catch (error) {
      setMessage(error.message);
    } finally {
      // setIsUploading(false);
    }

    // upload title - and another information
    // setLoading(true);
    // setIsUploading(true);
    // setError(null);
    setSuccess(false);

    console.log(fileInformation);

    try {
      const response = await fetch(
        "https://online-education-system-quch.onrender.com/course/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token"),
          },
          body: JSON.stringify(fileInformation),
        }
      );

      // const data = await response.json();
      const data = await response.json();
      console.log(data.massage);
      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Handle successful login
      setSuccess(true);
      console.log("ssss");
    } catch (err) {
      console.log(err);
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      console.log("6666");
      setLoading(false);
      setIsUploading(false);
    }
  };

  return (
    <div className="all-add-lesson">
      <Header />
      <Sidebar />
      <div className="add-lesson">
        <h1>Add New Lesson</h1>
        <p>
          Upload lesson materials, share resources, and organize content for
          your className.
        </p>

        <hr />

        <h3>Create a New Lesson</h3>
        <p>Prepare and share educational materials with your students.</p>

        <div className="form-group">
          <label htmlFor="lesson-title">Lesson Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={fileInformation.title}
            onChange={handleChange}
            placeholder="Enter lesson title (e.g., 'Introduction to Algebra')"
          />
        </div>

        <div className="form-group">
          <label htmlFor="lesson-description">Description</label>
          <textarea
            name="description"
            id="description"
            value={fileInformation.description}
            onChange={(e) => handleChange(e)}
            placeholder="Provide details about the lesson objectives and content"
          ></textarea>
        </div>

        <div className="form-group">
          <label>Upload Materials</label>
          <div className="file-upload">
            {/* <span className="file-upload-text">No file selected</span> */}
            <label className="file-upload-button" htmlFor="file-upload">
              Select File
            </label>
            <input
              id="file-upload"
              type="file"
              // className="bg-amber-300 border-amber-300"
              accept=".pdf,.docx,.ppt,.pptx"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            {/* {file} */}
            {/* {isUploading && (
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )} */}
            {/* {message && <div className="message">{message}</div>} */}
          </div>
          <div className="file-footer">
            <p className="my-5">(Maximum file size: 25MB)</p>
            <p className="my-5">(Supports PDF, DOCX, PPT)</p>
          </div>
        </div>
        <div className="select">
          <label htmlFor="gender">Category</label>
          <select
            value={fileInformation.category}
            id="category"
            name="category"
            onChange={(e) => handleChange(e)}
            className="signup-select"
          >
            <option value="null">Select Topic</option>
            <option value="programming">Programming</option>
            <option value="physics">Physics</option>
            <option value="english">English</option>
            <option value="math">Math</option>
          </select>
        </div>

        <div className="button-group">
          <button className="button button-secondary">Cancel</button>
          <button className="button button-secondary">Save Draft</button>
          <button
            onClick={handleUpload}
            // disabled={!file || isUploading}
            className="button button-primary"
          >
            {isUploading ? "Uploading..." : "Publish Lesson"}
          </button>
        </div>

        <div className="tips">
          <h4>Tips for Effective Lessons</h4>
          <ul>
            <li>Clearly state learning objectives</li>
            <li>Break content into manageable sections</li>
            <li>Include real-world examples</li>
            <li>Provide practice exercises</li>
          </ul>
        </div>

        <p>
          <a href="#" className="help-link">
            Access our lesson creation guide
          </a>
        </p>
        <p>
          <a href="#" className="help-link">
            View Teaching Resources
          </a>
        </p>
      </div>
    </div>
  );
}

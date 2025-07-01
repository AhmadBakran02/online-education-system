"use client";
// import { formatDate } from "react-calendar/dist/esm/shared/dateFormatter.js";
import "./style.css";
import { useState } from "react";
import Success from "../../../components/Success/success-text";
import { AddLesson } from "../../../types/type";
import { apiUrl } from "@/components/url";
import { AuthGuard } from "@/components/AuthGuard";

export default function AddLessons() {
  const [file, setFile] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const [lessonInforamtion, setLessonInforamtion] = useState<AddLesson>({
    title: "",
    description: "",
    category: "",
    videoID: "",
    pdfID: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Handle video upload
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideo(e.target.files[0]);
    }
  };

  // Handle text input changes (title, description, etc.)
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setLessonInforamtion((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Reset form
  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLessonInforamtion({
      title: "",
      description: "",
      category: "",
      videoID: "",
      pdfID: "",
    });
    setFile(null);
    setVideo(null);
    setMessage("");
    setSuccess(false);
  };

  const uploadVideo = async () => {
    if (video) {
      try {
        const formData = new FormData();
        formData.append("file", video);

        const response = await fetch(`${apiUrl}/file`, {
          method: "PUT",
          headers: {
            token: localStorage.getItem("token") || "",
          },
          body: formData,
        });

        const data = await response.json();
        // console.log(data.path);
        // setVideo(data.fileID);

        // setLessonInforamtion((prev) => ({
        //   ...prev,
        //   videoPath: data.fileID,
        // }));
        if (!response.ok) {
          throw new Error(data.message || "Upload failed");
        }

        setMessage("File uploaded successfully!");
        return data.fileID;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Sign up failed");
        return "";
      } finally {
        // setIsUploading(false);
      }
    } else return "?";
  };

  const uploadPDF = async () => {
    if (!file) {
      setMessage("Please select a file first");
      return false; // Return false if upload fails
    }

    setIsUploading(true);
    setMessage("");
    // setProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${apiUrl}/file`, {
        method: "PUT",
        headers: {
          token: localStorage.getItem("token") || "",
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      // Update both path state and lessonInforamtion
      console.log(data.fileID);
      setLessonInforamtion((prev) => ({
        ...prev,
        pdfID: data.fileID,
      }));

      setMessage("File uploaded successfully!");
      return data.fileID; // Return true if upload succeeds
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      return "";
    }
  };

  const submitLesson = async () => {
    setIsUploading(true);
    console.log("start");
    try {
      // First upload the PDF
      if (
        !lessonInforamtion.category ||
        !lessonInforamtion.title ||
        !lessonInforamtion.description ||
        lessonInforamtion.category == "null"
      ) {
        setMessage("Please fill in all required fields");
        setIsUploading(false);

        return;
      }
      const pdfUploadSuccess = await uploadPDF();
      const videoUploadSuccess = await uploadVideo();
      console.log("pdf", pdfUploadSuccess);
      console.log("video", videoUploadSuccess);
      // console.log("path", path);
      if (pdfUploadSuccess == "" || videoUploadSuccess == "") return;
      setMessage("");

      const response = await fetch(apiUrl + "/lesson", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token") || "",
        },
        body: JSON.stringify({
          title: lessonInforamtion.title,
          description: lessonInforamtion.description,
          category: lessonInforamtion.category,
          videoID: videoUploadSuccess,
          pdfID: pdfUploadSuccess,
        }),
      });
      const data = await response.json();
      console.log(data.massage);

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Handle successful login
      setSuccess(true);
      console.log("ssss");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      // setLoading(false);
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setSuccess(false);
    submitLesson();

    if (error) console.log(error);
  };

  return (
    <AuthGuard allowedRoles={["admin", "teacher"]}>
      <div className="add-lesson">
        <h1>Add New Lesson</h1>
        <p>
          Upload lesson materials, share resources, and organize content for
          your className.
        </p>

        <hr />

        <p>Prepare and share educational materials with your students.</p>

        {/* --------------- Title --------------- */}
        <div className="form-group">
          <label htmlFor="lesson-title">Lesson Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={lessonInforamtion.title}
            onChange={handleChange}
            placeholder="Enter lesson title (e.g., 'Introduction to Algebra')"
            required
          />
        </div>
        {/* --------------- Description --------------- */}
        <div className="form-group">
          <label htmlFor="lesson-description">Description</label>
          <textarea
            name="description"
            id="description"
            value={lessonInforamtion.description}
            onChange={handleChange}
            placeholder="Provide details about the lesson objectives and content"
            required
          ></textarea>
        </div>
        {/* --------------- File --------------- */}

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
          </div>
          <div className="file-footer">
            <p className="my-5">(Maximum file size: 25MB)</p>
            <p className="my-5">(Supports PDF, DOCX, PPT)</p>
          </div>
        </div>
        {/* --------------- Video --------------- */}
        <div className="form-group">
          <label>Upload Video</label>
          <div className="file-upload">
            {/* <span className="file-upload-text">No file selected</span> */}
            <label className="file-upload-button" htmlFor="video-upload">
              Select Video
            </label>
            <input
              id="video-upload"
              type="file"
              // className="bg-amber-300 border-amber-300"
              accept="video/*"
              className="hidden"
              onChange={handleVideoChange}
              disabled={isUploading}
            />
          </div>
          <div className="file-footer">
            <p className="my-5">(Maximum Video size: 250MB)</p>
            <p className="my-5">(Supports MP4, MOV, AVI, WMV, WEBM)</p>
          </div>
        </div>

        {/* --------------- Select --------------- */}

        <div className="select">
          <label htmlFor="gender">Category</label>
          <select
            value={lessonInforamtion.category}
            id="category"
            name="category"
            onChange={handleChange}
            className="signup-select"
            required
          >
            <option value="null">Select Topic</option>
            <option value="programming">Programming</option>
            <option value="physics">Physics</option>
            <option value="english">English</option>
            <option value="math">Math</option>
          </select>
        </div>

        {/* --------------- Button --------------- */}
        <div className="button-group">
          {success && (
            <div className="">
              <Success text={"The lesson has been added successfully."} />
            </div>
          )}
          <button className="button button-secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            // disabled={!file || isUploading}
            className="button button-primary"
          >
            {isUploading ? "Uploading..." : "Publish Lesson"}
          </button>
        </div>
        {message && <div className="message-error">{message}</div>}

        {/* {error && (
        <div className="text-red-400 border-solid border-red-400 border rounded-sm my-5 text-center bg-red-50">
          {error} {message}
        </div>
      )} */}

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
    </AuthGuard>
  );
}

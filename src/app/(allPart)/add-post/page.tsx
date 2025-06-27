"use client";
import "./style.css";
import { useState } from "react";
import Success from "../Success/success-text";
import { apiUrl } from "@/components/url";
// import { AddPost } from "../../interfaces/type";

export default function AddPosts() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [titleValue, setTitleValue] = useState<string>("");
  const [articleValue, setArticleValue] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  // const [loading, setLoading] = useState<boolean>(false);
  // const [path, setPath] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent default form behavior (if inside a form)
    setTitleValue("");
    setArticleValue("");
    setPhoto(null); // Clear selected file (optional)
  };

  const uploadPhoto = async () => {
    if (!photo) {
      setMessage("Please select a file first");
      return false; // Return false if upload fails
    }

    setIsUploading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", photo);

      const response = await fetch("${apiUrl}/file", {
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

      // Update both path state and fileInformation
      // setPath(await data.fileID);
      // console.log(data.fileID);
      // setFileInformation((prev) => ({
      //   ...prev,
      //   photoID: path,
      // }));

      setMessage("File uploaded successfully!");
      console.log("successfully");
      // console.log(fileInformation.photoID);
      return data.fileID; // Return true if upload succeeds
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      return "";
    } finally {
      setIsUploading(false);
    }
  };

  const submitLesson = async () => {
    setIsUploading(true);
    try {
      // First upload the Photo
      const photoUploadSuccess = await uploadPhoto();

      if (photoUploadSuccess == "") return;

      console.log("start-2");

      const response = await fetch(apiUrl + `/post`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token") || "",
        },
        body: JSON.stringify({
          title: titleValue,
          article: articleValue,
          photoID: photoUploadSuccess,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Handle successful login
      setSuccess(true);
      console.log("successful ");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
      console.log(error);
    } finally {
      // setLoading(false);
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitLesson();
  };

  return (
    <div className="add-lesson">
      <h1>Add New Post</h1>
      <p>Add the latest events and activities in the academy</p>

      <hr />

      {/* --------------- Title --------------- */}
      <div className="form-group">
        <label htmlFor="lesson-title">Post Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={titleValue}
          onChange={(e) => setTitleValue(e.target.value)}
          placeholder="Enter post title (e.g., 'Math Olympiad Registration Now Open!')"
        />
      </div>
      {/* --------------- Article --------------- */}
      <div className="form-group">
        <label htmlFor="lesson-description">Article</label>
        <textarea
          name="article"
          id="article"
          value={articleValue}
          onChange={(e) => setArticleValue(e.target.value)}
          placeholder="Provide details about the events or activities and content"
        ></textarea>
      </div>
      {/* --------------- Photo --------------- */}

      <div className="form-group">
        <label>Upload Image</label>
        <div className="file-upload">
          {/* <span className="file-upload-text">No file selected</span> */}
          <label className="file-upload-button" htmlFor="file-upload">
            Select Image
          </label>
          <input
            id="file-upload"
            type="file"
            // className="bg-amber-300 border-amber-300"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>
        <div className="file-footer">
          <p className="my-5">(Maximum Image size: 25MB)</p>
          <p className="my-5">(Supports JPEG, PNG, GIF, BMP, TIFF)</p>
        </div>
      </div>

      {/* --------------- Button --------------- */}
      <div className="button-group">
        <button className="button button-secondary" onClick={handleCancel}>
          Cancel
        </button>
        {/* <button className="button button-secondary">Save Draft</button> */}
        <button
          type="button"
          onClick={handleSubmit}
          // disabled={!file || isUploading}
          className="button button-primary"
        >
          {isUploading ? "Uploading..." : "Publish Lesson"}
        </button>
      </div>
      {success && (
        <div className="mt-3.5">
          <Success text={"The lesson has been added successfully."} />
        </div>
      )}
      {error && (
        <div className="text-red-500 border-solid border-red-500 border rounded-sm my-5 text-center">
          {error} {message}
        </div>
      )}
    </div>
  );
}

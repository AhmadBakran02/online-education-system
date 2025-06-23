"use client";
import "./style.css";
import { useEffect, useState } from "react";
import Success from "../Success/success-text";
import { AddPost } from "../../interfaces/type";

export default function AddPosts() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);
  const [photo, setPhoto] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  // const [loading, setLoading] = useState<boolean>(false);
  // const [path, setPath] = useState<string>("");

  const [fileInformation, setFileInformation] = useState<AddPost>({
    title: "",
    article: "",
    photoID: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };
  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent default form behavior (if inside a form)
    setFileInformation({
      title: "",
      article: "",
      photoID: "",
    });
    setPhoto(null); // Clear selected file (optional)
  };

   const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFileInformation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const uploadLesson = async () => {
  //   try {
  //     const response = await fetch(
  //       "https://online-education-system-quch.onrender.com/lesson/add",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           token: localStorage.getItem("token") || "",
  //         },
  //         body: JSON.stringify(fileInformation),
  //       }
  //     );

  //     // const data = await response.json();
  //     const data = await response.json();
  //     console.log(data.massage);
  //     if (!response.ok) {
  //       throw new Error(data.error || "Login failed");
  //     }

  //     // Handle successful login
  //     setSuccess(true);
  //     console.log("ssss");
  //   } catch (err) {
  //     // console.log(err);
  //     setError(err instanceof Error ? err.message : "Sign up failed");
  //   } finally {
  //     // console.log("6666");
  //     setLoading(false);
  //     setIsUploading(false);
  //   }
  // };

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

      const response = await fetch(
        "https://online-education-system-quch.onrender.com/file",
        {
          method: "PUT",
          headers: {
            token: localStorage.getItem("token") || "",
          },
          body: formData,
        }
      );

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
    console.log("start");
    try {
      // First upload the PDF
      const photoUploadSuccess = await uploadPhoto();
      // console.log(photoUploadSuccess);
      // console.log(path);
      if (photoUploadSuccess == "") return;
      setFileInformation((prev) => ({
        ...prev,
        photoID: photoUploadSuccess,
      }));
      console.log("start-2");
      // console.log(path);
      const response = await fetch(
        "https://online-education-system-quch.onrender.com/post",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token") || "",
          },
          body: JSON.stringify(fileInformation),
        }
      );

      // const data = await response.json();
      const data = await response.json();
      // console.log(data.massage);
      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Handle successful login
      setSuccess(true);
      console.log("ssss");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
      console.log(error);
    } finally {
      console.log("6666");
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
          value={fileInformation.title}
          onChange={handleChange}
          placeholder="Enter post title (e.g., 'Math Olympiad Registration Now Open!')"
        />
      </div>
      {/* --------------- Description --------------- */}
      <div className="form-group">
        <label htmlFor="lesson-description">Article</label>
        <textarea
          name="article"
          id="article"
          value={fileInformation.article}
          onChange={(e) => handleChange(e)}
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
      {success && <Success text={"The lesson has been added successfully."} />}
      {error && (
        <div className="text-red-500 border-solid border-red-500 border rounded-sm my-5 text-center">
          {error} {message}
        </div>
      )}
    </div>
  );
}

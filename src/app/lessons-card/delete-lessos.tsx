import { useState } from "react";
import React from "react";

interface Course {
  CourseID: string;
}

// let id = "68388b65aeae4223ba4ee816";

// console.log(id);

export const DeleteFormMyLessons = async (id: string) => {
  // const [message, setMessage] = useState("");
  // const [isUploading, setIsUploading] = useState(false);

  // setIsUploading(true);
  // setMessage("");

  const course = {
    courseID: id,
  };

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }
    const response = await fetch(
      "https://online-education-system-quch.onrender.com/course/library/delete",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify(course),
      }
    );

    if (!response.ok) {
      const data = await response.json();
      console.log(data.massage);
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    console.log(data.Message);
    // setMessage("File uploaded successfully!");
  } catch (error) {
    console.error("API Error:", error);
    // setMessage(error.message);
  } finally {
    // setIsUploading(false);
  }
};

export default DeleteFormMyLessons;

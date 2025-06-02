import { useState } from "react";
import React from "react";

interface Course {
  courseID: string;
}

// const [message, setMessage] = useState("");
// const [isUploading, setIsUploading] = useState(false);
// let id = "68388b65aeae4223ba4ee816";

export const AddToMyLessons = async (id: string) => {
  console.log(id);
  // setIsUploading(true);
  const course = {
    courseID: id,
  };
  // setMessage("");
  // setCourseID(id);

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }
    const response = await fetch(
      "https://online-education-system-quch.onrender.com/course/library/add",
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
    console.log("File uploaded successfully!");
    // setMessage("File uploaded successfully!");
  } catch (error) {
    // console.error("API Error:", error);
    // setMessage(error.message);
  } finally {
    // setIsUploading(false);
  }
};

export default AddToMyLessons;

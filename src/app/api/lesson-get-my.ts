// services/lessonService.ts

import { apiUrl } from "@/components/url";
import Cookies from "js-cookie";

// Define proper interfaces for your lesson data
interface Lesson {
  _id: string;
  title: string;
  description: string;
  teacherID: string;
  category: string;
  studentsEnrolled: string[]; // or any[] if the enrolled students might have more complex data
  videoID: string;
  pdfID: string;
  createdAt: string; // or Date if you'll convert it
  updatedAt: string; // or Date if you'll convert it
  __v: number;
  isInLibrary: boolean;
  level: string;
}

interface LessonResponse {
  lessons: Lesson[];
  // Add other pagination/response properties if needed
}

export const getAllLessons = async (): Promise<LessonResponse> => {
  try {
    const token = Cookies.get("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch(apiUrl + `/lesson/my/all?page=1&limit=1000`, {
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

    return await response.json();
  } catch (error) {
    console.error("Request failed:", error);
    throw error;
  }
};

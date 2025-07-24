import { apiUrl } from "../url";
import Cookies from "js-cookie";

interface Lesson {
  lessonID: string;
  title: string;
  description: string;
}

export const EditLesson = async (
  id: string,
  title: string,
  description: string
): Promise<{ success: boolean; message?: string }> => {
  const lesson: Lesson = {
    lessonID: id,
    title: title,
    description: description,
  };
  console.log(id);
  try {
    const token = Cookies.get("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(apiUrl + `/lesson`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify(lesson),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    console.log("File uploaded successfully!");

    return { success: true, message: data.message };
  } catch (error) {
    console.error("API Error:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

export default EditLesson;

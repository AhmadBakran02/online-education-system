import { apiUrl } from "../url";
import Cookies from "js-cookie";

interface Lesson {
  lessonID: string;
}

export const DeleteLesson = async (id: string): Promise<boolean> => {
  const lesson: Lesson = {
    lessonID: id,
  };

  try {
    const token = Cookies.get("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(apiUrl + `/lesson`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        token,
      },
      body: JSON.stringify(lesson),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return true;
  } catch (error) {
    console.error("Error deleting lesson:", error);
    return false;
  }
};

export default DeleteLesson;

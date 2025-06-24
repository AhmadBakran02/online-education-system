import { apiUrl } from "../url";

interface Lesson {
  lessonID: string;
}

export const deleteLessonFromMyLibrary = async (
  id: string
): Promise<boolean> => {
  const lesson: Lesson = {
    lessonID: id,
  };

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(apiUrl + `/lesson/library`, {
      method: "DELETE", // Fixed typo from "DELET" to "DELETE"
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

export default deleteLessonFromMyLibrary;

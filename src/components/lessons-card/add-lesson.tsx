import { apiUrl } from "../url";

interface Lesson {
  lessonID: string;
}

export const AddToMyLessons = async (
  id: string
): Promise<{ success: boolean; message?: string }> => {
  const lesson: Lesson = {
    lessonID: id,
  };

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(apiUrl + `/lesson/library`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token: token || "",
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
    console.log(id);
    console.error("API Error:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

export default AddToMyLessons;

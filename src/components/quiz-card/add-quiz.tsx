import { apiUrl } from "../url";
import Cookies from "js-cookie";

interface Quiz {
  quizID: string;
  date: string;
}

export const AddToMyTodo = async (
  id: string,
  date: string
): Promise<{ success: boolean; message?: string }> => {
  const quiz: Quiz = {
    quizID: id,
    date: date
  };

  try {
    const token = Cookies.get("token") || "";
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(apiUrl + `/quiz/todo`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token,
      },
      body: JSON.stringify(quiz),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    console.log("Quiz added successfully!");

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

export default AddToMyTodo;

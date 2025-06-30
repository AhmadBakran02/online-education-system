import { apiUrl } from "@/components/url";

interface Quiz {
  quizID: string;
}

export const DeleteQuiz = async (quizID: string): Promise<boolean> => {
  const quiz: Quiz = {
    quizID: quizID,
  };

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(apiUrl + `/quiz`, {
      method: "DELETE",
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

    return true;
  } catch (error) {
    console.error("Error deleting lesson:", error);
    return false;
  }
};

export default DeleteQuiz;

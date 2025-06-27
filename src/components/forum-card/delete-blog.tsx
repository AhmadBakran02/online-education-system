import { apiUrl } from "../url";

interface Blog {
  blogID: string;
}

export const deleteBlog = async (id: string): Promise<boolean> => {
  const blog: Blog = {
    blogID: id,
  };

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(apiUrl + `/blog`, {
      method: "DELETE", // Fixed typo from "DELET" to "DELETE"
      headers: {
        "Content-Type": "application/json",
        token,
      },
      body: JSON.stringify(blog),
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

export default deleteBlog;

import { apiUrl } from "../url";

interface Blog {
  blogID: string;
  title: string;
  article: string;
  category: string;
}

export const EditBlog = async (
  blogID: string,
  title: string,
  article: string,
  category: string
): Promise<{ success: boolean; message?: string }> => {
  const blog: Blog = {
    blogID: blogID,
    title: title,
    article: article,
    category: category,
  };
  // console.log(blogID);
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(apiUrl + `/blog`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify(blog),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    console.log("Edit successfully!");

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

export default EditBlog;

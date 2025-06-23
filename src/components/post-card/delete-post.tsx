interface PostID {
  postID: string;
}

export const deletePost = async (id: string): Promise<boolean> => {
  const postID: PostID = {
    postID: id,
  };

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      "https://online-education-system-quch.onrender.com/post",
      {
        method: "DELETE", // Fixed typo from "DELET" to "DELETE"
        headers: {
          "Content-Type": "application/json",
          token,
        },
        body: JSON.stringify(postID),
      }
    );

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

export default deletePost;

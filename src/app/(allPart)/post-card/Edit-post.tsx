interface Post {
  postID: string;
  title: string;
  article: string;
  photoID: string;
}

export const EditPost = async (
  id: string,
  title: string,
  article: string,
  photoID: string
): Promise<{ success: boolean; message?: string }> => {
  const post: Post = {
    postID: id,
    title: title,
    article: article,
    photoID: photoID,
  };
  console.log(id);
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      "https://online-education-system-quch.onrender.com/post",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify(post),
      }
    );

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

export default EditPost;

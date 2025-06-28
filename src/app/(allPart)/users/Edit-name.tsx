import { apiUrl } from "@/components/url";

interface Name {
  name: string;
}

export const EditName = async (
  name: string
): Promise<{ success: boolean; message?: string }> => {
  const userName: Name = {
    name: name,
  };

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(apiUrl + `/user/change/name`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify(userName),
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

export default EditName;

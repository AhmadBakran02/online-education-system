// services/courseService.ts
import { ICoursesResponse } from "../types/course";

const data1 = {
  page: "1",
  limit: "10",
};

export const fetchAllCourses = async (
  token: string
): Promise<ICoursesResponse> => {
  try {
    const response = await fetch(
      "https://online-education-system-quch.onrender.com/course/get/all",
      {
        method: "POST",
        headers: {
          token: token,
        },
          body: JSON.stringify(data1) ,
      
      }
    );
    console.log(JSON.stringify(data1));
    console.log("Response status:", response.status); // Debug log

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ICoursesResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};

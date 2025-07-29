// types/course.ts
export interface ICourse {
  _id: string;
  title: string;
  description: string;
  teacherID: string;
  category: string;
  studentsEnrolled: string[];
  videoPath: string;
  pdfPath: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ICoursesResponse {
  courses: ICourse[];
}

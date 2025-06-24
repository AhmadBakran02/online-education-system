export interface LessonsType {
  category: string;
  isInLibrary: boolean | undefined;
  title: string;
  description: string;
  _id: string;
  pdfID: string;
  videoID: string;
}

export interface Lesson {
  _id: string;
  title: string;
  description: string;
  teacherID: string;
  category: string;
  studentsEnrolled: [];
  videoID: string;
  pdfID: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  isInLibrary: boolean;
}

export interface GetPost {
  _id: string;
  postedBy: string;
  title: string;
  article: string;
  photoID: string;
  __v: number;
}
export interface AddLesson {
  title: string;
  description: string;
  category: string;
  videoID: string;
  pdfID: string;
}
export interface Post {
  _id: string;
  postedBy: string;
  title: string;
  article: string;
  photoUrl: string;
  photoID: string;
  __v: number;
  editPost: boolean;
}
export interface AddPost {
  title: string;
  article: string;
  photoID: string;
}

export interface NumPage {
  page: string;
  limit: string;
}
export interface NumPage {
  page: string;
  limit: string;
}

export interface TypeOfParamsCard {
  title: string;
  description: string;
  id: string;
  action: string;
  isIn?: boolean;
}

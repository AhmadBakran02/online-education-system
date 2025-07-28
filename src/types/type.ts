import { ReactNode } from "react";

export interface LessonsType {
  category: string;
  isInLibrary: boolean | undefined;
  title: string;
  description: string;
  _id: string;
  pdfID: string;
  videoID: string;
  level: string;
}

export interface HistoryType {
  title: ReactNode;
  _id: string;
  quizID: string;
  studentID: string;
  answers: number[];
  score: number;
  __v: number;
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
  level: string;
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
  showFull: boolean;
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

export interface BlogsType {
  title: string;
  category: string;
  article: string;
}
export interface GetBlogsType {
  _id: string;
  title: string;
  BlogedBy: string;
  article: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  role: string;
  __v: number;
  vote: string;
}

export interface Users {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  gender: string;
  isVerified: boolean;
  isBlocked: boolean;
  photoID: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface GetComments {
  _id: string;
  userID: string;
  blogID: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  name: string;
  role: string;
  photoID: string;
}

export interface OnePost {
  _id: string;
  postedBy: string;
  title: string;
  article: string;
  photoID: string;
  __v: number;
}

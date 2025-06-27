export interface Question {
  text: string;
  options: string[];
  correctAnswer: number;
}
export interface GetQuestion {
  id: string;
  text: string;
  question: string;
  options: string[];
}

export interface QuizData {
  title: string;
  description: string;
  questions: Question[];
}

export interface QuizListResponse {
  quizzes: Quiz[];
  total: number;
  page: number;
  limit: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface QuizQuestion {
  _id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface QuizApiResponse {
  quizzes: Quiz[];
  // Include other response fields if they exist
  total?: number;
  page?: number;
  limit?: number;
}

// types/quiz.ts
export interface Quiz {
  _id: string;
  title: string;
  description: string;
  teacherID: string;
  questions: QuizQuestion[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface QuizResponse {
  quizes: Quiz[];
}

export interface EditQuizPayload {
  quizID: string; // Added for edit endpoint
  title: string;
  description: string;
  questions: {
    text: string;
    options: string[];
    correctAnswer: number;
    _id?: string; // Optional for existing questions
  }[];
}

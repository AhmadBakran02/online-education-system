type Category = "math" | "physics" | "english" | "programming";

export interface QuizStatisticsResponse {
  statisticsByCategory: Partial<Record<Category, number>>;
  AIStatisticsByCategory: Partial<Record<Category, number>>;
}

"use client";

import { useState } from "react";
import { QuizData } from "@/types/quiz";
import "../../app/globals.css";
import "./style.css";
import { apiUrl } from "../url";
import Cookies from "js-cookie";

export default function QuizForm() {
  const [quizData, setQuizData] = useState<QuizData>({
    title: "",
    description: "",
    questions: [],
    category: "",
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  // Handle changes for title and description
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setQuizData((prev) => ({ ...prev, [name]: value }));
  };

  // Add a new question
  const addQuestion = () => {
    setQuizData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        { text: "", options: ["", ""], correctAnswer: 0 },
      ],
    }));
  };

  // Remove a question
  const removeQuestion = (index: number) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions.splice(index, 1);
    setQuizData((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  // Update question text
  const updateQuestionText = (index: number, value: string) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[index].text = value;
    setQuizData((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  // Add an option to a question
  const addOption = (questionIndex: number) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[questionIndex].options.push("");
    setQuizData((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  // Remove an option from a question
  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[questionIndex].options.splice(optionIndex, 1);

    // Adjust correctAnswer if needed
    const currentCorrect = updatedQuestions[questionIndex].correctAnswer;
    if (currentCorrect >= optionIndex) {
      updatedQuestions[questionIndex].correctAnswer = Math.max(
        0,
        currentCorrect - 1
      );
    }

    setQuizData((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  // Update an option text
  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuizData((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  // Set correct answer
  const setCorrectAnswer = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[questionIndex].correctAnswer = optionIndex;
    setQuizData((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  // Submit the quiz
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (category == "") {
      setError("Please fill in all fields");
      return;
    }
    setIsSubmitting(true);
    setError("");
    setSubmitSuccess(false);

    try {
      // Validate data
      if (!quizData.title.trim()) throw new Error("Title is required");
      if (quizData.questions.length === 0)
        throw new Error("At least one question is required");

      for (const question of quizData.questions) {
        if (!question.text.trim())
          throw new Error("All questions must have text");
        if (question.options.length < 2)
          throw new Error("Each question needs at least 2 options");
        if (question.options.some((opt) => !opt.trim()))
          throw new Error("All options must be filled");
      }

      const response = await fetch(apiUrl + "/quiz", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: Cookies.get("token") || "",
        },
        body: JSON.stringify({
          title: quizData.title,
          description: quizData.description,
          questions: quizData.questions,
          category: category,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create quiz");
      }

      setSubmitSuccess(true);
      // Reset form
      setQuizData({ title: "", description: "", questions: [], category: "" });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Create New Quiz</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {submitSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Quiz created successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 ">
        {/* -------Title-------*/}
        <div>
          <label className="block text-sm font-medium mb-1">Quiz Title*</label>
          <input
            type="text"
            name="title"
            value={quizData.title}
            onChange={handleInputChange}
            className="w-full p-2  quiz-button"
            placeholder="Enter quiz title"
            required
          />
        </div>
        {/* -------Description-------*/}
        <div>
          <label className="block text-sm font-medium mb-1">Description*</label>
          <textarea
            name="description"
            value={quizData.description}
            onChange={handleInputChange}
            className="w-full p-2 quiz-button"
            rows={3}
            placeholder="Enter quiz description"
          />
        </div>
        {/* -------Category-------*/}
        <div className="select-group">
          <label htmlFor="category">Category*</label>
          <select
            value={category}
            id="category"
            name="category"
            onChange={(e) => setCategory(e.target.value)}
            className="category-select"
          >
            <option value="">Select a category</option>
            <option value="programming">Programming</option>
            <option value="math">Math</option>
            <option value="english">English</option>
            <option value="physics">Physics</option>
          </select>
        </div>
        {/* -------Questions-------*/}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Questions</h2>
            <button
              type="button"
              onClick={addQuestion}
              className="main-blue text-white px-3 py-1 rounded"
            >
              Add Question
            </button>
          </div>

          {quizData.questions.length === 0 && (
            <p className="text-gray-500">No questions added yet</p>
          )}

          {quizData.questions.map((question, qIndex) => (
            <div key={qIndex} className=" p-4 rounded-lg space-y-4 quiz-button">
              <div className="flex justify-between">
                <h3 className="font-medium">Question {qIndex + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeQuestion(qIndex)}
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Question Text*
                </label>
                <input
                  type="text"
                  value={question.text}
                  onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                  className="w-full p-2 quiz-button"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="block text-sm font-medium">Options*</label>
                  <button
                    type="button"
                    onClick={() => addOption(qIndex)}
                    className="color-main-blue text-sm"
                  >
                    Add Option
                  </button>
                </div>

                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`correct-${qIndex}`}
                      checked={question.correctAnswer === oIndex}
                      onChange={() => setCorrectAnswer(qIndex, oIndex)}
                    />
                    <input
                      type="text"
                      value={option}
                      onChange={(e) =>
                        updateOption(qIndex, oIndex, e.target.value)
                      }
                      className="flex-1 p-2 quiz-button"
                      required
                    />
                    {question.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(qIndex, oIndex)}
                        className="text-red-400 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* -------Button-------*/}
        <button
          type="submit"
          disabled={isSubmitting || quizData.questions.length === 0}
          className={`w-full py-2 px-4 red-6 text-white ${
            isSubmitting || quizData.questions.length === 0
              ? "bg-gray-400"
              : "bg-gray-800 hover:bg-gray-900"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Create Quiz"}
        </button>
      </form>
    </div>
  );
}

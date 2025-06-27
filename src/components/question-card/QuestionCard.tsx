import { GetQuestion } from "@/types/quiz";
import { useState } from "react";
import "./style.css";

export default function QuestionCard({ id, options, question }: GetQuestion) {
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [submitted] = useState<boolean>(false);

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  // const handleSubmit = () => {
  //   setSubmitted(true);
  // };

  return (
    <div className="question-box">
      <h3 className="question">{question}</h3>
      <div className="answer">
        {options.map((option, index) => (
          <div key={index} className="choice">
            <input
              type="radio"
              id={`${id}-${index}`}
              name={id}
              checked={userAnswers[id] === index}
              onChange={() => handleAnswerSelect(id, index)}
              disabled={submitted}
              className="input-choice"
            />
            <label htmlFor={`${id}-${index}`}>{option}</label>
          </div>
        ))}
      </div>
    </div>
  );
}

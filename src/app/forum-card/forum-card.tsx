"use client";
import { useState } from "react";
import "./style.css";
import Image from "next/image";
interface TypeOfValue {
  show: boolean;
}
export const ForumCard = ({ show }: TypeOfValue) => {
  const [isActive, setIsActive] = useState(false);

  function answer() {
    setIsActive(!isActive);
  }

  return (
    <div className="topic-card">
      <div className="card-header">
        <h4 className="card-title">
          Practical: How to solve quadratic equations?
        </h4>
        <span className="card-meta">Posted by Student • 2 days ago</span>
      </div>
      {show && (<div className="card-body">
        <p>
          I'm struggling with understanding the quadratic formula. Can someone
          explain how to apply it to solve 2x² + 5x - 3 = 0 step by step?
        </p>
      </div>)}
      {show && (<div className="card-actions hidden">
        <button className="icon-btn">
          <Image src="./like.svg" width={20} height={20} alt=""/> 5
        </button>
        <button onClick={() => answer()} className="icon-btn">
          <Image src="./comment.svg" width={21} height={21} alt=""/> 3
        </button>
      </div> )}

      <div
        className={`answer-section ${isActive ? "active" : ""}`}
      >
        <div className="answer-input">
          <textarea placeholder="Write your answer..."></textarea>
          <button className="primary-btn">Post Answer</button>
        </div>
        <div className="answers-list">
          <div className="answer">
            <strong>Teacher:</strong> Let's break it down: 1) Identify a=2, b=5,
            c=-3...
          </div>
        </div>
      </div>

    </div>
  );
};

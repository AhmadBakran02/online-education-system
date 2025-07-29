"use client";
import Image from "next/image";
import "./style.css";
import "./error.css";

export default function FaildPage() {
  return (
    <div className="lesson-not-found">
      <div className="text">
        <div className="error-header">
          <Image src={"/task-not-found.svg"} width={75} height={75} alt="" />
        </div>
        <p>
          Oops! Our servers took a coffee break.
          <button onClick={() => (window.location.href = "/login")}>
            Try again?
          </button>
        </p>
      </div>
    </div>
  );
}

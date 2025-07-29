import "./error.css";
import Image from "next/image";
interface ErrorType {
  errorType: string;
}

export default function QuizzesError({ errorType }: ErrorType) {
  return (
    <div className="lesson-not-found">
      <div className="text">
        <div className="error-header">
          <Image src={"/task-not-found.svg"} width={45} height={45} alt="" />
          <h1>{errorType} </h1>
        </div>
        <p>
          Oops! Our servers took a coffee break.
          <button onClick={() => (window.location.href = "/quizzes")}>
            Try again?
          </button>
        </p>
      </div>
    </div>
  );
}

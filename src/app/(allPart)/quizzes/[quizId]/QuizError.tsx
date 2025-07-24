import Link from "next/link";
import "./error.css";
import Image from "next/image";
export default function QuizError() {
  return (
    <div className="lesson-not-found">
      <div className="text">
        <div className="error-header">
          <Image src={"/task-not-found.svg"} width={45} height={45} alt="" />
          <h1>Quiz Not Available </h1>
        </div>
        <p>We couldn&apos;t find the quiz you&apos;re looking for</p>
        <div className="link">
          <p>Browse Available </p>
          <Link href="/quizzes">Quiz</Link>
        </div>
      </div>
    </div>
  );
}

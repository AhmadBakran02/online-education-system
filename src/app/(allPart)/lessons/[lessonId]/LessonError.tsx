import Link from "next/link";
import "./error.css";
import Image from "next/image";
export default function LessonError() {
  return (
    <div className="lesson-not-found">
      <div className="text">
        <div className="error-header">
          <Image src={"/books.svg"} width={45} height={45} alt="" />
          <h1>Lesson Not Available </h1>
        </div>
        <p>We couldn&apos;t find the lesson you&apos;re looking for</p>
        <div className="link">
          <p>Browse Available </p>
          <Link href="/lessons">Lessons</Link>
        </div>
      </div>
    </div>
  );
}

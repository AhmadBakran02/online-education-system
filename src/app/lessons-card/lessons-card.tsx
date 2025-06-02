import { useState } from "react";
import "./style.css";
import Image from "next/image";
import { json } from "stream/consumers";
import AddToMyLessons from "./add-lesson";
import DeleteFormMyLessons from "./delete-lessos";

interface TypeOfParams {
  title: string;
  name: string;
  description: string;
  id: string;
  action: string;
}

interface Course {
  CourseID: string;
}

export const Card = ({ title, description, id, action }: TypeOfParams) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  console.log(id);


  function removeFromList() {
    localStorage.removeItem(id);
    // localStorage.setItem(22, `${title}-${name}`);
  }

  return (
    <div className="card" key={id}>
      <p className="title">{title}</p>
      <h2 className="subject-name">{description}</h2>
      {action == "add" && (
        <button onClick={() => AddToMyLessons(id)}>
          <Image src={"./plus-gray-s.svg"} width={20} height={20} alt="" />
          <span> Add to my lessons</span>
        </button>
      )}

      {action == "remove" && (
        <div className="two-button">
          <button onClick={() => removeFromList()} className="show-lesson">
            {/* <Image src={"./delete.svg"} width={20} height={20} alt="" /> */}
            <span> Show Lesson</span>
          </button>
          <button onClick={() => DeleteFormMyLessons(id)} className="delete">
            <Image src={"./delete.svg"} width={20} height={20} alt="" />
            {/* <span> Delete</span> */}
          </button>
        </div>
      )}
      {message}
    </div>
  );
};

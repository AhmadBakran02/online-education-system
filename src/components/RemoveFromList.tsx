import Image from "next/image";
import { apiUrl } from "./url";
import Cookies from "js-cookie";
import { useState } from "react";
import Loading4 from "./loading4/Loading4";

interface RemoveFromListProps {
  setDeleted: (value: boolean) => void;
  id: string;
}

export default function RemoveFromList({
  setDeleted,
  id,
}: RemoveFromListProps) {
  const [loading, setLoading] = useState<boolean>(false);

  const handleRmove = async () => {
    setLoading(true);
    console.log(id);

    try {
      const response = await fetch(apiUrl + "/quiz/todo", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          token: Cookies.get("token") || "",
        },
        body: JSON.stringify({
          quizID: id,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }
      console.log("succes");
      console.log(id);
      setDeleted(true);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <button
      className={`todo-quiz`}
      onClick={(e) => {
        e.stopPropagation();
        handleRmove();
      }}
    >
      {loading ? (
        <Loading4 />
      ) : (
        <>
          <Image src={"/delete.svg"} width={17} height={17} alt="" />
          <p>Remove</p>
        </>
      )}
    </button>
  );
}

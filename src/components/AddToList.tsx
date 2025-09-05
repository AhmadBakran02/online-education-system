import Image from "next/image";

interface AddToListProps {
  setShowAdd: (value: boolean) => void;
}

export default function AddToList({ setShowAdd }: AddToListProps) {
  return (
    <button
      className="todo-quiz"
      onClick={(e) => {
        e.stopPropagation();
        setShowAdd(true);
      }}
    >
      <Image src={"/plus-gray.svg"} width={17} height={17} alt="" />
      <p>Add To List</p>
    </button>
  );
}

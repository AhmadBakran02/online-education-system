import { useEffect } from "react";
import "./style.css"; // or your preferred styling method

interface SuccessProps {
  text: string;
  onClose: () => void;
  duration?: number;
}

export default function SuccessCard({
  text,
  onClose,
  duration = 3000,
}: SuccessProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={"successCard"}>
      <span>{text}</span>
    </div>
  );
}

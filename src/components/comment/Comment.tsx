import "./style.css";

interface Comment {
  role: string;
  name: string;
  comment: string;
}

export default function Comment({ role, name, comment }: Comment) {
  return (
    <div className="answer">
      <strong>
        ({role}) <span>{name}:</span>
      </strong>
      <p>{comment}</p>
    </div>
    // <div className="answer">
    //   <strong>Teacher:</strong> Let&apos;s break it down: 1) Identify a=2, b=5,
    //   c=-3...
    // </div>
  );
}

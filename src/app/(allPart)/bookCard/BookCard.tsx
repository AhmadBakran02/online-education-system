// BookCard.jsx
import { FaHeart, FaBookmark, FaSearch } from "react-icons/fa";
import "./style.css";
import Image from "next/image";

interface ibook {
  book: {
    id: number;
    title: string;
    author: string;
    description: string;
    coverUrl: string;
    isFavorite: boolean;
  };
}

export const BookCard = ({ book }: ibook) => {
  return (
    <div className="book-card">
      <div className="book-cover-container">
        <Image
          src={book.coverUrl || "/default-book-cover.jpg"}
          alt={book.title}
          width={600}
          height={20}
          className="book-cover"
        />
        <div className="book-actions">
          <button className="favorite-btn">
            <FaHeart className={book.isFavorite ? "filled" : ""} />
          </button>
        </div>
      </div>

      <div className="book-details">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">{book.author}</p>
        <p className="book-description">
          {book.description.substring(0, 100)}...
        </p>

        <div className="book-footer">
          <button className="add-to-library">
            <FaBookmark /> Add to My Library
          </button>
          <button className="view-details">
            <FaSearch /> Details
          </button>
        </div>
      </div>
    </div>
  );
};

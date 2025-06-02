// BookCard.jsx
import { FaHeart, FaBookmark, FaSearch } from "react-icons/fa";
import "./style.css";
export const BookCard = ({ book }) => {
  return (
    <div className="book-card">
      <div className="book-cover-container">
        <img
          src={book.coverUrl || "/default-book-cover.jpg"}
          alt={book.title}
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

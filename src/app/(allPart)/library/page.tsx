"use client";
import { useEffect, useState } from "react";
import { BookCard } from "../bookCard/BookCard";
import "./style.css";

export default function Library() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);
  const [books] = useState([
    {
      id: 1,
      title: "Advanced Mathematics",
      author: "Dr. Sarah Johnson",
      description:
        "Comprehensive guide to advanced mathematical concepts for high school students.",
      coverUrl: "/images/pic2.jpg",
      isFavorite: false,
    },
    {
      id: 2,
      title: "Advanced Mathematics",
      author: "Dr. Sarah Johnson",
      description:
        "Comprehensive guide to advanced mathematical concepts for high school students.",
      coverUrl: "/images/pic2.jpg",
      isFavorite: false,
    },
    {
      id: 3,
      title: "Advanced Mathematics",
      author: "Dr. Sarah Johnson",
      description:
        "Comprehensive guide to advanced mathematical concepts for high school students.",
      coverUrl: "/images/pic2.jpg",
      isFavorite: false,
    },
    {
      id: 4,
      title: "Advanced Mathematics",
      author: "Dr. Sarah Johnson",
      description:
        "Comprehensive guide to advanced mathematical concepts for high school students.",
      coverUrl: "/images/pic2.jpg",
      isFavorite: false,
    },
  ]);

  return (
    <div className="library-container">
      <div className="resource-tabs">
        <h1>Digital Library</h1>
        <p>Explore our colltion of e-book, references, and learing resouces</p>
      </div>

      <div className="lessons-search">
        <input
          type="serach"
          placeholder="Search lessons, assignments, or questions.."
        />
      </div>

      <div className="books-grid">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      <div className="help-section">
        <p>
          Need help? <a href="#">View Support Center →</a>
        </p>
      </div>
    </div>
  );
}

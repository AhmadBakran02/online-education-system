"use client";
import { useState } from "react";
import { BookCard } from "../bookCard/BookCard";
import { Header } from "../header/Header";
import Sidebar from "../aside/Sidebar";
import "./style.css";

export default function Library() {
  const [books, setBooks] = useState([
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
    <div className="all-library">
      <Header />
      <Sidebar />
      <div className="library-container">
        <div className="resource-tabs">
          <h1>Digital Library</h1>
          <p>
            Explore our colltion of e-book, references, and learing resouces
          </p>
        </div>

        <div className="lessons-search">
          <input
            type="serach"
            placeholder="Search lessons, assignments, or questions.."
          />
          {/* <select id="subjects" name="subjects">
            <option value="all-subject">All Subjects</option>
            <option value="value2">value2</option>
            <option value="value3">value3</option>
            <option value="value4">value4</option>
          </select> */}
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
    </div>
  );
}

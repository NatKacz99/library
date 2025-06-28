import React from "react";
import "./BookCard.css";
import { useNavigate } from "react-router-dom";

function BookCard({ book }) {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/details/${book.isbn}`);
  }
  const bookCoverURL = book.isbn ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg` : ""
  return (
    <div className="book-card" onClick={handleClick}>
      <img src={bookCoverURL} alt={`Cover book: ${book.title}`} />
      <h3>{book.title}</h3>
      <p><strong>{book.author}</strong></p>
    </div>
  );
}

export default BookCard;

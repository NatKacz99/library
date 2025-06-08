import React from "react";
import "./BookCard.css";

function BookCard({ book }) {
  return (
    <div className="book-card">
      <h3>{book.title}</h3>
      <p><strong>{book.author}</strong></p>
    </div>
  );
}

export default BookCard;

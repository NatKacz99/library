import React from "react";
import "./BookCard.css";

function BookCard({ book }) {
  const bookCoverURL = book.isbn ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg` : ""
  return (
    <div className="book-card">
      <img src={bookCoverURL} alt={`Cover book: ${book.title}`} />
      <h4>{book.title}</h4>
      <p><strong>{book.author}</strong></p>
    </div>
  );
}

export default BookCard;

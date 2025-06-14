import React, { useEffect, useState } from 'react';
import './BookDetails.css';
import { useParams } from 'react-router-dom';

function BookDetails() {
  const { isbn } = useParams();
  const [book, setBook] = useState(null);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:3000/api/books/${isbn}`)
      .then((res) => res.json())
      .then((data) => {
        setBook(data);
      })
      .catch((error) => {
        console.error("Error retriving book:", error);
      });
  }, [isbn]);

  if (!book) return <p>Book not found.</p>;

  const bookCoverURL = `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`;


  return (
    <div className="wrapper">
      <div className="content">
        <div className="title-and-author">
          <h2>{book.title}</h2>
          <p><strong>{book.author}</strong></p>
        </div>
        <div className="main">
          <div className="rate">
            <img className="imageDetail" src={bookCoverURL} alt={`Cover: ${book.title}`} />
            <div className="stars">
              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  role="img"
                  aria-label="star"
                  className={index < rating ? 'active' : ''}
                  onClick={() => setRating(index + 1)}
                >
                  {index < rating ? '★' : '☆'}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="description">{book.description}</p>
          </div>
        </div>
      </div>
      <div className="buttons">
        <button className="buttonDetail" style={{ borderRadius: "15px" }}>Check the book out</button>
        <button className="buttonDetail" style={{ borderRadius: "15px" }}>Book up</button>
      </div>
    </div>
  );
}

export default BookDetails;
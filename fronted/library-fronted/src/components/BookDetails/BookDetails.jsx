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
        console.log("Fetched book:", data);
        setBook(data);
      })
      .catch((error) => {
        console.error("Error retriving book:", error);
      });
  }, [isbn]);

  if (!book) return <p>Book not found.</p>;

  const bookCoverURL = `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`;

  const handleCheckOut = async () => {
    const user = JSON.parse(localStorage.getItem('token'));
    const userId = user?.id;

    console.log(user.id);

    if (!userId) {
      alert("User not logged in!");
      return;
    }

    const responseBorrowing = await fetch(`http://localhost:3000/details/borrow/${isbn}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        title: book.title,
        author: book.author,
        pieces_amount: book.pieces_amount
      }),
    });

    if (responseBorrowing.ok) {
      alert("Book successfully checked out!");

      fetch(`http://localhost:3000/api/books/${isbn}`)
        .then(res => res.json())
        .then(data => setBook(data))
        .catch(error => console.error("Error updating book info:", error));
    } else {
      alert("Something went wrong...");
    }
  };

  const handleBookUp = async () => {
    const user = JSON.parse(localStorage.getItem('token'));
    const userId = user?.id;

    console.log(user.id);

    if (!userId) {
      alert("User not logged in!");
      return;
    }

    const responseOrder = await fetch(`http://localhost:3000/details/order/${isbn}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        title: book.title,
        author: book.author,
      }),
    });

    if (responseOrder.ok) {
      alert("Book successfully order!");
    } else {
      alert("Something went wrong...");
    }
  }

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
            <p>Rate the book</p>
          </div>

          <div>
            <p className="description">{book.description}</p>
          </div>
        </div>
      </div>
      <p style={{ color: "white" }}><strong>Avaliable copies: {book.pieces_amount}</strong></p>
      <div className="buttons">
        <button className="buttonDetail" style={{ borderRadius: "15px" }}
          onClick={handleCheckOut} disabled={book.pieces_amount === 0}>Check the book out</button>
        <button className="buttonDetail" style={{ borderRadius: "15px" }}
          onClick={handleBookUp} disabled={book.pieces_amount > 0}>Book up</button>
      </div>
    </div>
  );
}

export default BookDetails;
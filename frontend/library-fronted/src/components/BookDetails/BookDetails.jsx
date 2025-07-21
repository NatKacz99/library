import React, { useEffect, useState } from 'react';
import './BookDetails.css';
import { useParams } from 'react-router-dom';

function BookDetails() {
  const { isbn } = useParams();
  const [book, setBook] = useState(null);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    fetch(`http://116.202.101.142:3000/api/books/${isbn}`)
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
    let userId = null;
    try {
    const user = JSON.parse(localStorage.getItem('userData'));
    userId = user?.id;
  } catch (error) {
    console.error("Could not parse userData:", error);
    setMessage("User not logged in!");
    return;
  }

    if (!userId) {
      setMessage("User not logged in!");
      setMessageType("warning");
      return;
    }

    const responseBorrowing = await fetch(`http://116.202.101.142:3000/details/borrow/${isbn}`, {
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
      setMessage("Book successfully checked out!");
      setMessageType("successful");

      fetch(`http://116.202.101.142:3000/api/books/${isbn}`)
        .then(res => res.json())
        .then(data => setBook(data))
        .catch(error => console.error("Error updating book info:", error));
    } else {
      setMessage("Something went wrong...");
      setMessageType("warning")
    }
  };

  const handleBookUp = async () => {
    let userId = null;
    try {
    const user = JSON.parse(localStorage.getItem('userData'));
    userId = user?.id;
  } catch (error) {
    console.error("Could not parse userData:", error);
    setMessage("User not logged in!");
    return;
  }

    if (!userId) {
      setMessage("User not logged in!");
      setMessageType("warning");
      return;
    }

    const responseOrder = await fetch(`http://116.202.101.142:3000/details/order/${isbn}`, {
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
    const data = await responseOrder.json();
    if (responseOrder.ok) {
      setMessage("Book successfully order!");
      setMessageType("successful");
    } else {
      setMessage(data.message || "Something went wrong...");
      setMessageType("warning")
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
        {message && messageType === "warning" && (
          <div className="alert alert-warning mt-3">
            {message}
          </div>
        )}
        {message && messageType === "successful" && (
        <div className="alert alert-success" role="alert">{message}</div>)}
        <button className="buttonDetail" style={{ borderRadius: "15px" }}
          onClick={handleBookUp} disabled={book.pieces_amount > 0}>Book up</button>
      </div>
    </div>
  );
}

export default BookDetails;
import React, { useState, useEffect } from 'react'
import './App.css';
import BookList from './../BookList/BookList'

function App() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/")
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error("Błąd:", err));
  }, []);

  return (
    <div>
      <h1>Light Feather</h1>
      <h2>Library</h2>
      <div className="wrapper"><BookList books={books} /></div>
    </div>
  );
}

export default App

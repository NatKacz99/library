import React, { useState, useEffect } from 'react'
import './App.css'

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
      <ul>
        {books.map((book, index) => (
          <li key={index}>{book.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App

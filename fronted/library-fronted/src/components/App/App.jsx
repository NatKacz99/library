import React, { useState, useEffect } from 'react'
import './App.css';
import BookList from './../BookList/BookList';
import NavbarMain from './../Navbar/NavbarMain';
import Navbar from './../Navbar/Navbar';
import SignUp from './../SignUp/SignUp';
import { Route, Routes } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

function App() {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch("http://localhost:3000/")
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error("Error:", err));

    fetch("http://localhost:3000/genres")
      .then((res) => res.json())
      .then((data) => setGenres(data))
      .catch((err) => console.error("Error while retrieving species: ", err));
  }, [])

  const fetchBooks = async (term) => {
    try {
      const response = await fetch(`http://localhost:3000/books?search=${term}`);
      const data = await response.json();
      setBooks(data);
    } catch (err) {
      console.error("Error while retriving data:", err);
    }
  };

  useEffect(() => {
    fetchBooks(searchTerm);
  }, [searchTerm]);

  const filteredBooks = selectedGenre
    ? books.filter(book => book.genre === selectedGenre)
    : books;
  const location = useLocation();

  return (
    <div className="wrapper">

      {location.pathname === '/' ?
        (<NavbarMain
          onSearchChange={setSearchTerm}
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
          genres={genres}
          searchTerm={searchTerm}
        />) : (<Navbar />)}
      <Routes>
        <Route path="/" element={<BookList books={filteredBooks} />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </div>
  );
}

export default App

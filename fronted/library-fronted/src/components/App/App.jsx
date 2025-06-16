import React, { useState, useEffect } from 'react'
import './App.css';
import BookList from './../BookList/BookList';
import NavbarMain from './../Navbar/NavbarMain';
import Navbar from './../Navbar/Navbar';
import SignUp from './../SignUp/SignUp';
import Login from './../Login/Login';
import Borrowings from './../MyAccount/Borrowings/Borrowings';
import PersonalData from './../MyAccount/PersonalData/PersonalData';
import BookDetails from './../BookDetails/BookDetails';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';


function App() {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [token, setToken] = useState();

  useEffect(() => {
    fetch("http://localhost:3000/")
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error("Error:", err));

    fetch("http://localhost:3000/genres")
      .then((res) => res.json())
      .then((data) => setGenres(data))
      .catch((err) => console.error("Error while retrieving species: ", err));

    const storedUser = localStorage.getItem('token');
    if (storedUser) {
      const storedUser = localStorage.getItem('token');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        fetch(`http://localhost:3000/account/${user.id}`)
          .then(res => res.json())
          .then(data => {
            console.log("Borrowings:", data);
          });
      }
    }
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
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/details/:isbn" element={<BookDetails />} />
        <Route
          path="/my-borrowings"
          element={token ? <Borrowings userName={token.name} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/my-data"
          element={token ? <PersonalData userName={token.name} /> : <Navigate to="/login" replace />}
        />

      </Routes>
    </div>
  );
}

export default App

import React, { useState, useEffect } from 'react'
import './App.css';
import BookList from './../BookList/BookList'

function App() {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);

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

  const filteredBooks = selectedGenre
    ? books.filter(book => book.genre === selectedGenre)
    : books;

  return (
    <div className="wrapper">
      <nav className="navbar navbar-expand-lg bg-white border-bottom">
        <div className="container-fluid">
          <a className="navbar-brand text-dark fw-bold" href="#">Light Feather Library</a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse justify-content-between" id="navbarContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link text-dark" href="#">Sign Up</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-dark" href="#">Sign In</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-dark" href="#">My Account</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-dark" href="#">Events</a>
              </li>
            </ul>

            <form className="d-flex align-items-center gap-2" role="search">
              <div className="dropdown">
                <button
                  className="btn btn-outline-dark dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {selectedGenre || "Genre"}
                </button>
                <ul className="dropdown-menu">
                  {genres.map((genre, id) => (
                    <li key={id}>
                      <a className="dropdown-item" href="#" onClick={() => setSelectedGenre(genre.genre)}>
                        {genre.genre}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <input
                className="form-control"
                type="search"
                placeholder="Search by title or author"
                aria-label="Search"
              />
            </form>
          </div>
        </div>
      </nav>

      <div><BookList books={filteredBooks} /></div>
    </div>
  );
}

export default App

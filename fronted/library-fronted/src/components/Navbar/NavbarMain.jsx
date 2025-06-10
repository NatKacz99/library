import React from 'react';
import SearchBar from '../SearchBar/SearchBar';
import { Link } from 'react-router-dom';

function NavbarMain({
  onSearchChange,
  selectedGenre,
  setSelectedGenre,
  genres,
  searchTerm
}) {
  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom">
      <div className="container-fluid">
        <Link className="navbar-brand text-dark fw-bold" to="/">Light Feather Library</Link>

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
              <Link className="nav-link text-dark" to="/signup">Sign Up</Link>
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
                    <button
                      className="dropdown-item"
                      type="button"
                      onClick={() => setSelectedGenre(genre.genre)}
                    >
                      {genre.genre}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <SearchBar searchTerm={searchTerm} onSearchChange={onSearchChange} />
          </form>
        </div>
      </div>
    </nav>
  );
}

export default NavbarMain;

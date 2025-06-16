import React, { useEffect, useState } from 'react';
import SearchBar from '../SearchBar/SearchBar';
import { Link } from 'react-router-dom';
import featherIcon from '../../assets/feather.svg';
import LogOut from './../LogOut/LogOut';
import './Navbar.css'

function NavbarMain({
  onSearchChange,
  selectedGenre,
  setSelectedGenre,
  genres,
  searchTerm
}) {
  const [userName, setUserName] = useState("");
  const [isAccountOpen, setIsAccountOpen] = useState(false)

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom">
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          <img
            src={featherIcon}
            alt="feather"
            style={{ width: '24px', marginRight: '8px' }}
          />
          <Link className="navbar-brand text-dark fw-bold yellowtail-regular" to="/">Light Feather Library</Link>
        </div>

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
              <Link className="nav-link text-dark" to="/login">Sign In</Link>
            </li>
            <li className="nav-item dropdown">
              <div
                className="nav-link text-dark dropdown-toggle"
                onClick={() => setIsAccountOpen(prev => !prev)}
                style={{ cursor: 'pointer' }}
              >
                My Account
              </div>
              {isAccountOpen && (
                <ul className="dropdown-menu show">
                  <li>
                    <Link className="dropdown-item" to="/my-data">My personal data</Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/my-borrowings">My borrowings</Link>
                  </li>
                  <li className="dropdown-item">
                    <LogOut />
                  </li>
                </ul>
              )}
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

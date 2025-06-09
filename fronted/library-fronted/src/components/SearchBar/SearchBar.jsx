import React from 'react';

function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <input
      className="form-control"
      type="search"
      placeholder="Search by title or author"
      aria-label="Search"
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
    />
  )
}

  export default SearchBar;
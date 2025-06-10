import React from 'react';
import { Link } from 'react-router-dom';

function Navbar(){
  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom">
      <div className="container-fluid">
        <Link className="navbar-brand text-dark fw-bold" to="/">Light Feather Library</Link>
      </div>
    </nav>
  )
}

export default Navbar;
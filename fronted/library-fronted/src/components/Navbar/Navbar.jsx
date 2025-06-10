import React from 'react';
import { Link } from 'react-router-dom';
import featherIcon from '../../assets/feather.svg'

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom">
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          <img
            src={featherIcon}
            alt="feather"
            style={{ width: '24px', marginRight: '8px' }}
          />
          <Link className="navbar-brand text-dark fw-bold" to="/">Light Feather Library</Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;
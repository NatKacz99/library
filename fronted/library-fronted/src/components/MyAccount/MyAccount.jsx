import React, { useState, useEffect } from 'react';
import LogOut from './../LogOut/LogOut';
import './MyAccount.css';

function MyAccount() {
const [user, setUser] = useState(null);
const [rentals, setRentals] = useState([]);
const [loadingRentals, setLoadingRentals] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('token');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      fetch(`http://localhost:3000/account/${parsedUser.id}`)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch rentals');
          return res.json();
        })
        .then((data) => {
          setRentals(data);
          setLoadingRentals(false);
        })
        .catch((err) => {
          console.error('Error fetching rentals:', err);
          setLoadingRentals(false);
        });
    }
  }, []);

  if (!user) {
    return <div>Loading user data...</div>;
  }
  return (
    <div class="wrapper">
      <div className="rentals">
      <h2>
        Your rentals
      </h2>
      <p>The loan period for all books is 30 days</p>
      {loadingRentals ? (
        <p>Loading rentals...</p>
      ) : rentals.length === 0 ? (
        <p>You have no active rentals.</p>
      ) : (
        <ul className="rental-list">
          {rentals.map((book, index) => (
            <li key={index}>
              <strong>{book.title}</strong> by {book.author} <br />
              <small>Rental date: {new Date(book.rented_at).toLocaleDateString()}</small>
              <br />
              <small>Return date: {new Date(book.return_at).toLocaleDateString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
      <div className="personal-data">
        <h2>Your personal data</h2>
        <div className="userData">
          <p><strong>Nickname:</strong> {user.name}</p>
          <div className="icon-edit">
            <i className="fas fa-edit"></i>
          </div>
        </div>
        <div className="userData">
          <p><strong>Email:</strong> {user.email}</p>
          <div className="icon-edit">
            <i className="fas fa-edit"></i>
          </div>
        </div>
        <div className="userData">
          <p class="edit-password">Edit your password</p>
        </div>
      </div>
      <div className="buttons">
        <LogOut />
        <button style={{borderRadius: "5px"}}>Delete your account <i className="fa-solid fa-trash"></i></button>
      </div>
    </div>
  );
}

export default MyAccount;

import React, { useState, useEffect } from 'react';
import './../MyAccount.css';

function Borrowings() {
  const [user, setUser] = useState(null);
  const [rentals, setRentals] = useState([]);
  const [loadingRentals, setLoadingRentals] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('token');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setFormData({ name: parsedUser.name, email: parsedUser.email });

      fetch(`http://localhost:3000/my-borrowings/${parsedUser.id}`)
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
      </div>)}

export default Borrowings;
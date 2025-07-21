import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../../../contexts/UserContext';
import './../MyAccount.css';

function Borrowings() {
  const { user, setUser } = useContext(UserContext);
  const [rentals, setRentals] = useState([]);
  const [loadingRentals, setLoadingRentals] = useState(true);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setFormData({ name: parsedUser.name, email: parsedUser.email });

      fetch(`http://116.202.101.142:3000/my-borrowings/${parsedUser.id}`)
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

      fetch(`http://116.202.101.142:3000/my-borrowings/order/${parsedUser.id}`)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch order');
          return res.json();
        })
        .then((data) => {
          setOrders(data);
          setLoadingOrders(false);
        })
        .catch((err) => {
          console.error('Error fetching orders:', err);
          setLoadingOrders(false);
        });
    }
  }, []);

  if (user === undefined) return <p style={{color:"white"}}>Loading user data...</p>;
  if (user === null) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="wrapper">
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

      <div className="orders">
        <h2>
          Your orders
        </h2>
        <p>
          Here you will find a list of books that you can order if there are no copies available.
          When a free copy becomes available, you will receive a notification to your email address.</p>
        {loadingOrders ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p>You have no active orders.</p>
        ) : (<ul className="orders-list">
          {orders.map((book, index) => (
            <li key={index}>
              <strong>{book.title}</strong> by {book.author} <br />
            </li>))}
        </ul>)}
      </div>
    </div>
  )
}

export default Borrowings;
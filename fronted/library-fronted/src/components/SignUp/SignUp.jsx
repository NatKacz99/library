import React, { useState, useEffect } from 'react';
import './SignUp.css';
import { Link } from 'react-router-dom';

function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: "include",
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage(data.message);
        setMessageType('success');
      } else {
        setMessage(data.message || 'Something wrong.');
        setMessageType('error');
      }

    } catch (error) {
      console.error(error);
      setMessage('Connecting to the server error.');
      setMessageType('error');
    }
  };


  return (
    <div
      className="d-flex justify-content-center align-items-start"
      style={{ minHeight: '100vh', paddingTop: '80px' }}
    >
      <div
        className="bg-white p-4 shadow rounded"
        style={{ maxWidth: '400px', width: '100%' }}
      >
        <main className="form-signin w-100">
          <form onSubmit={handleSubmit}>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="name"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
              <label htmlFor="floatingInput">Username</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="name@example.com"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              <label htmlFor="floatingInput">Email address</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              <label htmlFor="floatingPassword">Password</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control"
                id="repeatPassword"
                placeholder="Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <label htmlFor="floatingPassword">Repeat password</label>
            </div>
            <button className="btn btn-primary w-100 py-2" type="submit">
              Sign Up
            </button>
          </form>
          {message && messageType !== 'success' && (
            <div className="alert alert-danger" role="alert">
              {message}
            </div>
          )}
          {message && messageType === 'success' && (
            <div className="alert alert-success" role="alert">
              {message} <br />
              You can now <Link to="/login">sign in to your account</Link>.
            </div>
          )}

          <div className="mt-2">
            <div className="card-body text-center">
              <a className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2" href="http://localhost:3000/auth/google" role="button">
                <i className="fab fa-google"></i>
                Sign Up with Google
              </a>
            </div>
          </div>
        </main>

      </div>
    </div>
  );
}

export default SignUp
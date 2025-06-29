import React, { useState, useContext } from "react";
import PropTypes from 'prop-types';
import './Login.css';
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { AuthService } from '../../services/AuthService';

function Login({ setToken }) {
  const { user, setUser } = useContext(UserContext);
  const { loginUser } = useContext(UserContext);
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        loginUser(data.user); 
        navigate("/");
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Network error occurred");
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
                autoComplete="off"
                onChange={e => setUserName(e.target.value)}
              />
              <label htmlFor="floatingInput">Username</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
                name="password"
                onChange={e => setPassword(e.target.value)}
              />
              <label htmlFor="floatingPassword">Password</label>
            </div>
            <button className="btn btn-primary w-100 py-2" type="submit">
              Sign In
            </button>
            {message && (
              <div className="alert alert-danger" role="alert">
                {message}
              </div>
            )}
          </form>

          <div className="mt-2">
            <div className="card-body text-center">
              <a className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2" href="http://localhost:3000/auth/google" role="button">
                <i className="fab fa-google"></i>
                Sign In with Google
              </a>
            </div>
          </div>
        </main>

      </div>
    </div>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
}

export default Login
import React from 'react';
import './SignUp.css'

function SignUp() {
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
          <form>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="floatingInput"
                placeholder="name"
              />
              <label htmlFor="floatingInput">Username</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                id="floatingInput"
                placeholder="name@example.com"
              />
              <label htmlFor="floatingInput">Email address</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control"
                id="floatingPassword"
                placeholder="Password"
              />
              <label htmlFor="floatingPassword">Password</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control"
                id="floatingPassword"
                placeholder="Password"
              />
              <label htmlFor="floatingPassword">Repeat password</label>
            </div>
            <button className="btn btn-primary w-100 py-2" type="submit">
              Sign Up
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}

export default SignUp
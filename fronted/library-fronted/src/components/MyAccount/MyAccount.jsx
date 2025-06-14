import React, { useState, useEffect } from 'react';
import LogOut from './../LogOut/LogOut';
import './MyAccount.css';

function MyAccount() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('token');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div class="wrapper">
      <div className="rentals">
        <h2>
          Your rentals
        </h2>
        <p>The loan period for all books is 30 days</p>
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
        <button>Delete your account <i className="fa-solid fa-trash"></i></button>
      </div>
    </div>
  );
}

export default MyAccount;

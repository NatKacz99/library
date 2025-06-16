import React, { useState, useEffect } from 'react';
import LogOut from '../../LogOut/LogOut';
import './../MyAccount.css';

function PersonalData() {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    return token ? JSON.parse(token) : null;
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [editField, setEditField] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3000/my-data/updatePersonalData/${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        alert('Your data has been updated');
        const updatedUser = { ...user, ...formData };
        localStorage.setItem('token', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setEditField(null);
      } else {
        alert('Error updating data');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="personal-data">
      <h2>Your personal data</h2>

      {editField === 'name' ? (
        <form onSubmit={handleEditSubmit}>
          <input name="name" value={formData.name} onChange={handleChange} />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setEditField(null)}>Cancel</button>
        </form>
      ) : (
        <div className="userData">
          <p><strong>Nickname:</strong> {user.name}</p>
          <button className="icon-edit" onClick={() => setEditField('name')}>
            <i className="fas fa-edit"></i>
          </button>
        </div>
      )}

      {editField === 'email' ? (
        <form onSubmit={handleEditSubmit}>
          <input name="email" value={formData.email} onChange={handleChange} />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setEditField(null)}>Cancel</button>
        </form>
      ) : (
        <div className="userData">
          <p><strong>Email:</strong> {user.email}</p>
          <button className="icon-edit" onClick={() => setEditField('email')}>
            <i className="fas fa-edit"></i>
          </button>
        </div>
      )}

      <div className="userData">
        <p className="edit-password" onClick={() => setEditField('password')}>
          Edit your password
        </p>
      </div>

      {editField === 'password' && (
        <form onSubmit={handleEditSubmit}>
          <input name="password" type="password" value={formData.password} onChange={handleChange} />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setEditField(null)}>Cancel</button>
        </form>
      )}

      <div className="buttons">
        <div style={{ textAlign: 'center' }}>
          <LogOut />
        </div>
        <button type="submit" style={{ borderRadius: "5px", marginTop: "10px" }}>
          Delete your account <i className="fa-solid fa-trash"></i>
        </button>
      </div>
    </div>
  );
}

export default PersonalData;

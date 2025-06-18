import React, { useState, useEffect, useContext } from 'react';
import {useNavigate} from 'react-router-dom';
import { UserContext } from '../../../contexts/UserContext';
import LogOut from '../../LogOut/LogOut';
import './../MyAccount.css';

function PersonalData() {
  const { user, setUser } = useContext(UserContext);

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

  const navigate = useNavigate();

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3000/my-data/updatePersonalData/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        alert('Your data has been updated');
        const updatedUser = {
          ...user,
          ...(formData.name && { name: formData.name }),
          ...(formData.email && { email: formData.email }),
        };
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

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action is irreversible.")) return;

    try {
      const response = await fetch(`http://localhost:3000/my-data/delete-account/${user.id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        alert("Your account has been successfully deleted.");
        setUser(null);
        localStorage.removeItem("token");
        navigate("/");
      } else {
        alert(`Error deleting account: ${data.error}`);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Server error occurred while deleting your account.");
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
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
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
        <button type="submit" style={{ borderRadius: "5px", marginTop: "10px" }} onClick={handleDeleteAccount}>
          Delete your account <i className="fa-solid fa-trash"></i>
        </button>
      </div>
    </div>
  );
}

export default PersonalData;

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../contexts/UserContext';
import LogOut from '../../LogOut/LogOut';
import './../MyAccount.css';

function PersonalData() {
  const { user, setUser } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const navigate = useNavigate();

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const payloadEditDataForm = {};
    if (formData.name) payloadEditDataForm.name = formData.name;
    if (formData.email) payloadEditDataForm.email = formData.email;
    if (formData.password) payloadEditDataForm.password = formData.password;

    try {
      const response = await fetch(`http://[2a01:4f8:c013:c304::1]:3000/my-data/updatePersonalData/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadEditDataForm)
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Your data has been updated');
        setMessageType("successful");
        const updatedUser = {
          ...user,
          ...(formData.name && { name: formData.name }),
          ...(formData.email && { email: formData.email }),
        };
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsEditing(false);
      } else {
        setMessage('Error updating data');
        setMessageType("error")
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action is irreversible.")) return;

    try {
      const response = await fetch(`http://[2a01:4f8:c013:c304::1]:3000/my-data/delete-account/${user.id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setUser(null);
        localStorage.removeItem("userData");
        navigate("/");
      } else {
        setMessage(`Error deleting account: ${data.error}`);
        setMessageType("error")
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      setMessage("Server error occurred while deleting your account.");
      setMessageType("error")
    }
  };

  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="personal-data">
      <h2>Your personal data</h2>

      {!isEditing ? (
        <div className="userData">
          <p><strong>Nickname:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <button type="submit" class="custom-button" style={{
            borderRadius: "5px", backgroundColor:
              "rgb(209, 209, 86)"
          }}
            onClick={() => setIsEditing(true)}>
            <i className="fas fa-edit"></i> Edit your data
          </button>
        </div>
      ) : (
        <form onSubmit={handleEditSubmit} className="edit-form">
          <label htmlFor="name">Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />

          <label htmlFor="email">Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />

          <label htmlFor="password">Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
          <div className="form-buttons">
            <button type="submit" style={{ borderRadius: "5px" }}>Save changes</button>
            <button type="button" style={{ borderRadius: "5px" }} onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="buttons">
        <div style={{ textAlign: 'center' }}>
          <LogOut />
        </div>
        <button
          type="button"
          class="custom-button"
          style={{ borderRadius: "5px", marginTop: "8px" }}
          onClick={handleDeleteAccount}
        >
          <i className="fa-solid fa-trash"></i> Delete your account
        </button>
      </div>

      {message && (
        <div
          className={`alert mt-8 ${messageType === 'successful' ? 'alert-success' : 'alert-warning'}`}
          role="alert"
        >
          {message}
        </div>
      )}
    </div>
  );
}

export default PersonalData;

import React from 'react';
import { useNavigate } from "react-router-dom";

function LogOut() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();   
    navigate("/login");      
  };

  return (
    <button onClick={handleLogout} className="btn btn-danger">
      Logout <i class="fa-solid fa-right-from-bracket"></i>
    </button>
  );
}

export default LogOut;

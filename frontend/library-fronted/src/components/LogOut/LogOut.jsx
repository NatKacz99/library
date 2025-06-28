import React, {useContext} from 'react';
import { useNavigate } from "react-router-dom";
import { UserContext } from '../../contexts/UserContext';

function LogOut() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleLogout = () => {
    localStorage.clear();  
    setUser(null);  
    navigate("/login");      
  };

  return (
    <button onClick={handleLogout} className="btn btn-danger">
      Logout <i class="fa-solid fa-right-from-bracket"></i>
    </button>
  );
}

export default LogOut;

import React from 'react';
import { getAuth } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const { currentUser } = getAuth();

  const handleTitleClick = () => {
    navigate('/');
  };

  const handleAccountClick = () => {
    if (currentUser) navigate('/account');
  };
    
    return (
    <div className="header">
        <h1 className="header-title" onClick={handleTitleClick}>
        <span>Brampton</span>
        <br />
        Tennis Queue
        </h1>

        {currentUser && (
        <button className="header-title account-button" onClick={handleAccountClick}>
          <span>Account</span>
        </button>
        )}
    </div>
    );
};

export default Header;
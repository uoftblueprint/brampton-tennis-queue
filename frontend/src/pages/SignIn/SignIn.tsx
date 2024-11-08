import React, { useState } from "react";
import { auth } from "../../firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import "./SignIn.css";

const Login: React.FC = () => {
    // Declare provider object for Google Auth
    const provider = new GoogleAuthProvider();
    
    // State to track if user is authenticated
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Accessing location/nickname information through local storage
    const location = localStorage.getItem('selectedLocation') || 'Cassie Campbell';
    const nickname = localStorage.getItem('nickname') || 'User';

    // Hook for navigating to the next page
    const navigate = useNavigate();

    const handleGoogleSignIn = () => {
        signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            console.log("User: ", user);
            // Set authenticated state to true
            setIsAuthenticated(true);
            localStorage.setItem("userID", user.uid);
            navigate('/current-state'); // Navigate to the next page
        }).catch((error) => {
            console.log("Error: ", error);
        });
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Login with Google</h2>
            {!isAuthenticated && (
                <div>
                <h1>Welcome, {nickname}!</h1>
                    <button className="login-button" onClick={handleGoogleSignIn}>
                        Sign in with Google
                    </button>
                </div>
            )}
            {/* Display something if the user is authenticated with Google */}
            {isAuthenticated && (
                <div className="welcome-message">
                    <h3>You are successfully logged in!</h3>
                    <p>Enjoy your stay, {nickname}!</p>
                </div>
            )}
        </div>
    );
};

export default Login;
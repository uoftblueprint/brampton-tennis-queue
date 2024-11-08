import React, { useState } from "react";
import { auth } from "../../firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useLocation } from 'react-router-dom';
import "./SignIn.css";

const Login: React.FC = () => {
    const provider = new GoogleAuthProvider();
    const location = useLocation();
    const nickname = (location.state as { nickname?: string })?.nickname || 'User';
    
    // State to track if user is authenticated
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleGoogleSignIn = () => {
        signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            console.log("User: ", user);
            // Set authenticated state to true
            setIsAuthenticated(true);
            localStorage.setItem("userID", user.uid);
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

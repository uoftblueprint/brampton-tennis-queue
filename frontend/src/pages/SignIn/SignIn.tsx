import React, { useState } from "react";
import { auth } from "../../firebase";
import { signInWithPopup, GoogleAuthProvider, TwitterAuthProvider } from "firebase/auth";
import { useLocation } from 'react-router-dom';
import "./SignIn.css";

const Login: React.FC = () => {
    const googleProvider = new GoogleAuthProvider();
    const twitterProvider = new TwitterAuthProvider();
    const location = useLocation();
    const nickname = (location.state as { nickname?: string })?.nickname || 'User';
    
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loginProvider, setLoginProvider] = useState<string | null>(null);

    const handleGoogleSignIn = () => {
        signInWithPopup(auth, googleProvider)
            .then((result) => {
                const user = result.user;
                console.log("User (Google): ", user);
                setIsAuthenticated(true);
                setLoginProvider("Google");
            }).catch((error) => {
                console.log("Google Sign-in Error: ", error);
            });
    };

    const handleTwitterSignIn = () => {
        signInWithPopup(auth, twitterProvider)
            .then((result) => {
                const user = result.user;
                console.log("User (Twitter): ", user);
                setIsAuthenticated(true);
                setLoginProvider("Twitter");
            }).catch((error) => {
                console.log("Twitter Sign-in Error: ", error);
            });
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Login</h2>
            {!isAuthenticated && (
                <div>
                    <h1>Welcome, {nickname}!</h1>
                    <p>Please choose one of the options below to sign in:</p>
                    <button className="login-button google-button" onClick={handleGoogleSignIn}>
                        Sign in with Google
                    </button>
                    <br></br>
                    <h3>or</h3>
                    <button className="login-button twitter-button" onClick={handleTwitterSignIn}>
                        Sign in with Twitter
                    </button>
                </div>
            
            )}
            {isAuthenticated && (
                <div className="welcome-message">
                    <h3>You are successfully logged in with {loginProvider}!</h3>
                    <p>Enjoy your stay, {nickname}!</p>
                </div>
            )}
        </div>
    );
};

export default Login;

import React, { useState } from "react";
import { auth } from "../../firebase";
import {
    signInWithPopup,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./SignIn.css";

// Import Google icon
import googleIcon from "../../assets/google-icon.svg";

const Login: React.FC = () => {
    const provider = new GoogleAuthProvider(); // Google authentication provider

    // State management for inputs and toggles
    const [email, setEmail] = useState(""); // Email input
    const [password, setPassword] = useState(""); // Password input
    const [isSigningUp, setIsSigningUp] = useState(false); // Toggle for sign-up or sign-in
    const [errorMessage, setErrorMessage] = useState(""); // Error message display

    const navigate = useNavigate(); // Navigation hook for redirecting

    // Handle Google sign-in
    const handleGoogleSignIn = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                navigate("/active-view"); // Navigate to active view on success
            })
            .catch((error) => {
                setErrorMessage("Google sign-in failed. Please try again."); // Set error message
            });
    };

    // Handle email-based authentication
    const handleEmailAuth = (e: React.FormEvent) => {
        e.preventDefault(); // Prevent page reload
        const authFunction = isSigningUp
            ? createUserWithEmailAndPassword
            : signInWithEmailAndPassword;

        authFunction(auth, email, password)
            .then(() => {
                navigate("/active-view"); // Navigate to active view on success
            })
            .catch((error) => {
                // Map Firebase error codes to user-friendly messages
                let errorMsg = "An unexpected error occurred. Please try again.";
                switch (error.code) {
                    case "auth/email-already-in-use":
                        errorMsg = "This email is already in use. Please try signing in instead.";
                        break;
                    case "auth/invalid-email":
                        errorMsg = "Invalid email address. Please try again.";
                        break;
                    case "auth/weak-password":
                        errorMsg = "Weak password. Choose a stronger one.";
                        break;
                    case "auth/wrong-password":
                        errorMsg = "Incorrect password. Please try again.";
                        break;
                    case "auth/user-not-found":
                        errorMsg = "No account found. Please sign up.";
                        break;
                    case "auth/network-request-failed":
                        errorMsg = "Network error. Check your connection.";
                        break;
                    case "auth/invalid-credential":
                        errorMsg = "Invalid credentials. Try again.";
                        break;
                    default:
                        errorMsg = error.message; // Default error message
                        break;
                }
                setErrorMessage(errorMsg); // Update error message
            });
    };

    return (
        <div className="login-container">
            <h2 className="login-title">{isSigningUp ? "Sign Up" : "Sign In"}</h2>

            {/* Form for email and password */}
            <form className="login-form" onSubmit={handleEmailAuth}>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        className="form-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        className="form-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="form-button email-button">
                    {isSigningUp ? "Sign Up with Email" : "Sign In with Email"}
                </button>
            </form>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            {/* Toggle between sign-in and sign-up */}
            <p className="toggle-message">
                {isSigningUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <span
                    className="toggle-link"
                    onClick={() => {
                        setIsSigningUp(!isSigningUp);
                        setErrorMessage("");
                    }}
                >
                    {isSigningUp ? "Sign In" : "Sign Up"}
                </span>
            </p>

            {/* Google sign-in button */}
            <div className="google-signin-container">
                <button className="button google-signin-button" onClick={handleGoogleSignIn}>
                    <img src={googleIcon} alt="Google Icon" className="button-icon" />
                    Sign in with Google
                </button>
            </div>
        </div>
    );
};

export default Login;
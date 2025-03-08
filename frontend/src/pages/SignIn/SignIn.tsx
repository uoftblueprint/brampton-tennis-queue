import React, { useContext, useState, useEffect } from "react";
import { auth } from "../../firebase";
import {
    signInWithPopup,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    TwitterAuthProvider,
    User,
    sendEmailVerification,

} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./SignIn.css";
import googleIcon from "../../assets/google-icon.svg";
import xIcon from "../../assets/x-icon.png";
import Header from '../../components/Header'; 

import { LocalStorageContext } from "../../context/LocalStorageContext";
import { AuthProvider, AuthContext } from "../../context/AuthContext";

const Login: React.FC = () => {

    const context = useContext(LocalStorageContext);
    const authContext = useContext(AuthContext);
    const twitterProvider = new TwitterAuthProvider() // Twitterv(X) authentication provider
    const googleProvider = new GoogleAuthProvider(); // Google authentication provider

    // State management for inputs and toggles
    const [email, setEmail] = useState(""); // Email input
    const [password, setPassword] = useState(""); // Password input
    const [isSigningUp, setIsSigningUp] = useState(false); // Toggle for sign-up or sign-in
    const [errorMessage, setErrorMessage] = useState(""); // Error message display
    const [emailError, setEmailError] = useState(""); // Email-specific error state
    const [passwordError, setPasswordError] = useState(""); // Password-specific error state
    
    const navigate = useNavigate(); // Navigation hook for redirecting

    // Redirect if user is already authenticated
    useEffect(() => {
        if (authContext?.currentUser && !context.recentLoginRequired) {
            context.setAddedToGame(false);  // Reset added to game status
            context.setRecentLoginRequired(false);
            navigate("/messaging-permission");
        }
    }, [authContext, navigate]);

    // Handle google-based authentication
    const handleGoogleSignIn = () => {
        context.setAddedToGame(false); // Reset added to game status
        signInWithPopup(auth, googleProvider)
            .then((result) => {
                const user = result.user
                console.log("user", user)

                context.setFirebaseUID(user.uid); // Store user UID in local storage
                setTimeout(() => {}, 1000); // Delay to ensure UID is stored before redirect
                navigate("/messaging-permission"); // Navigate to active view on success
            })
            .catch(() => {
                setErrorMessage("Google sign-in failed. Please try again.");
            });
    };

    // Handle X-based authentication
    const handleTwitterSignIn = () => {
        context.setAddedToGame(false); // Reset added to game status
        signInWithPopup(auth, twitterProvider)
            .then((result) => {
                const user = result.user;
                console.log("User (X): ", user);
          
                context.setFirebaseUID(user.uid); // Store user UID in local storage
                setTimeout(() => {}, 1000);
                navigate("/messaging-permission");
            }).catch((error) => {
                setErrorMessage("X sign-in failed. Please try again.");
            });
    };

    // Register a new user or sign in an existing user with email and password
    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Validate password length (minimum 8 characters)
    const isValidPassword = (password: string) => {
        return password.length >= 8;
    };

    const sendVerificationEmail = (user: User) => {
        if (!user.emailVerified) {
            // resend verification email
            sendEmailVerification(user).then(() => { console.log("finished sending email verification") });
        }
    }


    // Handle email-based authentication
const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(""); 
    setPasswordError(""); 
    setErrorMessage("");

    let isValid = true;

    if (!isValidEmail(email)) {
        setEmailError("Invalid email format. Please enter a valid email address.");
        isValid = false;
    }

    if (!isValidPassword(password)) {
        setPasswordError("Password must be at least 8 characters long.");
        isValid = false;
    }

    if (!isValid) return;

    const authFunction = isSigningUp
        ? createUserWithEmailAndPassword
        : signInWithEmailAndPassword;

    authFunction(auth, email, password)
        .then((userCredential) => {
            context.setAddedToGame(false);
            const user = userCredential.user; // This is the user object
            console.log("User UID:", user.uid); // This is the user's UID
            context.setFirebaseUID(user.uid); // Store the UID in localStorage if needed
            console.log("User:", user);

            sendVerificationEmail(user);
            navigate("/messaging-permission"); // Navigate to the next page
        })
        // Handle Firebase errors if authentication fails
        .catch((error) => {
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
        <div className="main-container">
            <Header />
            <div className="login-container">
                <h2 className="login-title">{isSigningUp ? "Sign Up" : "Log In"}</h2>

                {/* Form for email and password */}
                <form className="login-form" onSubmit={handleEmailAuth}>
                    <label htmlFor="email" className="form-label">Email:</label>
                    <input
                        type="email"
                        id="email"
                        className={`form-input ${emailError ? "input-error" : ""}`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    {emailError && <p className="error-message">{emailError}</p>}
                    <label htmlFor="password" className="form-label">Password:</label>
                    <input
                        type="password"
                        id="password"
                        className={`form-input ${passwordError ? "input-error" : ""}`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {passwordError && <p className="error-message">{passwordError}</p>}
                    <button type="submit" className="form-button">
                        {isSigningUp ? "Sign up with Email" : "Log in with Email"}
                    </button>

                    {/* Google sign-in button */}
                    <div className="google-signin-container">
                        <button id="google-button" className="form-button" onClick={handleGoogleSignIn}>
                            <img src={googleIcon} alt="Google Icon" className="button-icon" />
                            Log in with Google
                        </button>
                    </div>
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
                            setEmailError("");
                            setPasswordError("");
                        }}
                    >
                        {isSigningUp ? "Log In" : "Sign Up"}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;

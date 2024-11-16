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

// Import icon images
import googleIcon from "../../assets/google-icon.svg";

const Login: React.FC = () => {
    const provider = new GoogleAuthProvider();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSigningUp, setIsSigningUp] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const handleGoogleSignIn = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                console.log("User: ", user);
                navigate("/active-view");
            })
            .catch((error) => {
                console.log("Error: ", error);
                setErrorMessage("Google sign-in failed. Please try again.");
            });
    };

    const handleEmailAuth = (e: React.FormEvent) => {
        e.preventDefault();
        const authFunction = isSigningUp
            ? createUserWithEmailAndPassword
            : signInWithEmailAndPassword;

        authFunction(auth, email, password)
            .then((result) => {
                const user = result.user;
                console.log("User: ", user);
                navigate("/active-view");
            })
            .catch((error) => {
                console.log("Error: ", error);

                let errorMsg = "An unexpected error occurred. Please try again.";
                switch (error.code) {
                    case "auth/email-already-in-use":
                        errorMsg = "This email is already in use. Please try signing in instead.";
                        break;
                    case "auth/invalid-email":
                        errorMsg = "The email address is not valid. Please check and try again.";
                        break;
                    case "auth/weak-password":
                        errorMsg = "The password is too weak. Please choose a stronger password.";
                        break;
                    case "auth/wrong-password":
                        errorMsg = "Incorrect password. Please try again.";
                        break;
                    case "auth/user-not-found":
                        errorMsg = "No account found with this email. Please sign up first.";
                        break;
                    case "auth/network-request-failed":
                        errorMsg = "Network error. Please check your connection and try again.";
                        break;
                    case "auth/invalid-credential":
                        errorMsg = "Invalid credential. Please ensure your credentials are correct.";
                        break;
                    default:
                        errorMsg = error.message;
                        break;
                }
                setErrorMessage(errorMsg);
            });
    };

    return (
        <div className="login-container">
            <h2 className="login-title">{isSigningUp ? "Sign Up" : "Sign In"}</h2>

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

            <p className="toggle-message">
                {isSigningUp
                    ? "Already have an account?"
                    : "Don't have an account?"}{" "}
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

import React, { useContext, useState, useEffect } from "react";
import { getAuth, deleteUser, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { fetchCurrentState } from '../../utils/api';
import Header from '../../components/Header'; 
import "./Account.css";

import { LocalStorageContext } from "../../context/LocalStorageContext";

const Account: React.FC = () => {

    const context = useContext(LocalStorageContext);

    const navigate = useNavigate(); // Navigation hook for redirecting
    //const CACHE_EXPIRY_THRESHOLD = 60 * 1000;  // 60 seconds
    const CACHE_EXPIRY_THRESHOLD = 10 * 1000;  // For testing!

    // Redirect if user is not authenticated
    useEffect(() => {
        if (!context || !context.nickname || !context.firebaseUID || !context.selectedLocation) {
            navigate("/");
        }
    }, [context, navigate]);

    const [errorMessage, setErrorMessage] = useState(""); // Error message display

    const deleteAccount = async () => {
        const selectedLocation = context?.selectedLocation;
        const auth = getAuth();
        const user = auth.currentUser;
        try {
            // Check whether the user exists in the current state of this location
            const cachedTimestamp = context?.playerDataLastUpdateTime;
            const cacheAge = cachedTimestamp ? Date.now() - new Date(cachedTimestamp).getTime() : null;
            if (!cacheAge || cacheAge >= CACHE_EXPIRY_THRESHOLD) {
                // Cache is missing or outdated, so fetch current state
                const fetchedData = await fetchCurrentState(selectedLocation);
                if (fetchedData.activeFirebaseUIDs.includes(context?.firebaseUID)) {
                    context?.setAddedToGame(true);
                } else {
                    context?.setAddedToGame(false);
                }
            }
        } catch (error) {
            console.error("Error fetching current state: ", error);
        }
        if (!context?.addedToGame) 
            try {
                if (user) {
                    await deleteUser(user);
                }
                context?.clear();
                navigate("/");
            } catch (error: any) {
                if (error.code == 'auth/requires-recent-login') {
                    context?.setRecentLoginRequired(true);
                    setErrorMessage("Requires recent sign in - redirecting...");
                    setTimeout(() => {
                        navigate('/sign-in');
                    }, 3000);
                } else {
                    setErrorMessage("Error deleting account");
                console.error("Error deleting account: ", error);
                }
            }
         else {
            setErrorMessage("Account cannot be deleted while in game");
        }
    };
    
    const resetPassword = async () => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user && user.email) {
            try {
                sendPasswordResetEmail(auth, user.email)
                alert("Password reset email sent!");
            } catch (error) {
                setErrorMessage("Error sending password reset email");
                console.error("Error sending password reset email: ", error);
            }
        } else {
            setErrorMessage("No email found");
        }
    }

    return (
        <div className="main-container">
            <Header />
            <div className="account-container">
                <h2 className="account-title">Account</h2>
                <div className="account-form-text">
                    <span className="account-form-label">Nickname</span>
                    <span className="account-form-value">{context?.nickname} </span>
                </div>
                <div className="account-form-text">
                    <span className="account-form-label">Selected Location</span>
                    <span className="account-form-value">{context?.selectedLocation} </span>
                </div>

                <button type="button" className="account-form-button hollow-button" onClick={resetPassword}>
                    Reset Password
                </button>
                <button type="button" className="account-form-button delete-button" onClick={deleteAccount}>
                    Delete Account
                </button>

                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>
        </div>
    );
};

export default Account;

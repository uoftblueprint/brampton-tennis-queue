import React, { useContext, useState, useEffect } from "react";
import { getAuth, deleteUser } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { fetchCurrentState } from '../../utils/api';
import Header from '../../components/Header'; 
import ResetPassword from "../../components/ResetPassword";

import "./Account.css";

import { LocalStorageContext } from "../../context/LocalStorageContext";

const Account: React.FC = () => {

    const context = useContext(LocalStorageContext);
    const auth = getAuth();
    const user = auth.currentUser;

    const navigate = useNavigate(); // Navigation hook for redirecting
    const CACHE_EXPIRY_THRESHOLD = 60 * 1000;  // 60 seconds

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
                const fetchedData = await fetchCurrentState(selectedLocation ? selectedLocation : "Cassie Campbell");
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

    return (
        <div className="account-main-container">
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
                <ResetPassword initialEmail={user && user.email ? user.email : ''} onAccountPage={true}/>
                
                <button type="button" className="account-form-button delete-button" onClick={deleteAccount}>
                    Delete Account
                </button>

                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>
        </div>
    );
};

export default Account;

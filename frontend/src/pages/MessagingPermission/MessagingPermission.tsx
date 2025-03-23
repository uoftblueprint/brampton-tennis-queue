import React, { useContext, useState } from "react";
import { getMessaging, getToken } from 'firebase/messaging';
import { useNavigate } from "react-router-dom";
import Header from '../../components/Header'; 

import "./MessagingPermission.css";

import { LocalStorageContext } from "../../context/LocalStorageContext";

const MessagingPermission: React.FC = () => {

    const context = useContext(LocalStorageContext);

    const navigate = useNavigate(); // Navigation hook for redirecting

    const [errorMessage, setErrorMessage] = useState(""); // Error message display

    const requestPermission = async () => {
        try {
            const messaging = getMessaging();
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                setErrorMessage('Notification permission denied.');
                return;
            }

            const vapidKey = 'BIn7HfgGhmz1NJ7T0SOYcxQC1MkNjRlwT4awKTSJp9yvruJFZxzShp4reOdk1kpeKO6CRI2d68F0X_Dr1zrhfSI';
            const token = await getToken(messaging, { vapidKey });
    
            if (token && context) {
                context.setToken(token);
                setErrorMessage('');
                navigate("/active-view");
            } else {
                setErrorMessage('Failed enabling notification permissions.');
            }
        } catch (error) {
            setErrorMessage('Error... Mobile Users: Share > Add to Home Screen');
        }
    };

    return (
        <div className="messaging-permission-main-container">
            <Header />
            <div className="messaging-permission-container">
                <h2 className="messaging-permission-title">Turn on notifications</h2>
                <p className="messaging-permission-form-label">Enable notifications so you don't miss your court time.</p>
                <button type="button" className="messaging-permission-form-button" onClick={requestPermission}>
                    Allow
                </button>
                <button type="submit" className="messaging-permission-form-button hollow-button" onClick={() => navigate('/active-view')}>
                    Skip
                </button>

                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>
        </div>
    );
};

export default MessagingPermission;

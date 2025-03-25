import React from 'react';
import './ValidTimeCheck.css';

interface ValidTimeCheckProps {
  children: React.ReactNode;
}

const ValidTimeCheck: React.FC<ValidTimeCheckProps> = ({ children }) => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { timeZone: "America/New_York", hour12: false, hour: "numeric" };
    const hour = Number(new Intl.DateTimeFormat("en-US", options).format(now));
    const startHour = 8;  // 8 AM EST
    const endHour = 23;   // 11 PM EST

    const isValidTime = hour >= startHour && hour < endHour;

    return isValidTime ? (
        children
    ) : (
        <div className="time-warning-container">
            <div className="time-warning-card">
                <h2>⏰ We're currently closed</h2>
                <p>
                    Court access is available between <strong>8:00 AM</strong> and <strong>11:00 PM (EST)</strong>.
                </p>
                <p>Please refresh the page during operating hours to continue.</p>
            </div>
        </div>
    );
};

export default ValidTimeCheck;
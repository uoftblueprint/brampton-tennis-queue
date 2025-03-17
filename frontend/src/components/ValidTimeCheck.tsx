import React from 'react';
import './ValidTimeCheck.css';

interface ValidTimeCheckProps {
  children: React.ReactNode;
}

const ValidTimeCheck: React.FC<ValidTimeCheckProps> = ({ children }) => {
    // Check if the current time is between the hours of operation
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { timeZone: "America/New_York", hour12: false, hour: "numeric" };
    const hour = Number(new Intl.DateTimeFormat("en-US", options).format(now));
    const startHour = 8; // 8 AM
    const endHour = 23; // 11 PM
    const isValidTime = hour >= startHour && hour < endHour;

    return isValidTime ? (
        children
    ) : (
        <div className="time-warning-container">
            <p className="time-warning">
                Courts are available between 8 AM and 11 PM EST. Refresh this page during the valid time range.
            </p>
        </div>
    );
};

export default ValidTimeCheck;
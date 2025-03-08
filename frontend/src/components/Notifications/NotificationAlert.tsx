import React from 'react';
import './NotificationAlert.css'; // We'll define styles below

interface MyCustomAlertProps {
  show: boolean;
  title: string;
  body: string;
  onClose: () => void;
}

/**
 * MyCustomAlert
 * A simple modal-like component that renders an overlay and a dialog box
 * when 'show' is true. It displays a title, body text, and a "Close" button.
 */
const MyCustomAlert: React.FC<MyCustomAlertProps> = ({ show, title, body, onClose }) => {
  if (!show) return null;

  return (
    <div className="alert-overlay">
      <div className="alert-box">
        <h3 className="alert-title">{title}</h3>
        <p className="alert-body">{body}</p>
        <button className="alert-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default MyCustomAlert;

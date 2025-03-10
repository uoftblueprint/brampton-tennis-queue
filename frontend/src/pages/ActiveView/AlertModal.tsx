import React from 'react';
import './AlertModal.css';

interface AlertModalProps {
  message: string;
  onClose: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({ message, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Alert</h2>
        <p>{message}</p>
        <div className="modal-buttons">
          <button onClick={onClose} className="modal-ok-button">OK</button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;

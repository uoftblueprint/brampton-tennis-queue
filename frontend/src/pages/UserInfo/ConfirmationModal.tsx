import React from 'react';
import './ConfirmationModal.css';

interface ConfirmationModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Confirm Nickname</h2>
        <p>{message}</p>
        <div className="modal-buttons">
          <button onClick={onConfirm} className="modal-confirm-button">Confirm</button>
          <button onClick={onCancel} className="modal-cancel-button">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

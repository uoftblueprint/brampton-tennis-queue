import React, { useState } from 'react';
import './CheckboxModal.css';

interface Option {
  label: string;
  value: number;
  checked: boolean;
}

interface CheckboxModalProps {
  message: string;
  options: Option[];
  onConfirm: (selectedOptions: Option[]) => void;
  onCancel: () => void;
}

const CheckboxModal: React.FC<CheckboxModalProps> = ({ message, options, onConfirm, onCancel }) => {
  const [selections, setSelections] = useState(options);

  const handleCheckboxChange = (index: number) => {
    const updatedSelections = [...selections];
    updatedSelections[index].checked = !updatedSelections[index].checked;
    setSelections(updatedSelections);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Select Options</h2>
        <p>{message}</p>
        <form>
          {selections.map((option, index) => (
            <label key={index} className="checkbox-label">
              <input
                type="checkbox"
                checked={option.checked}
                onChange={() => handleCheckboxChange(index)}
              />
              {option.label}
            </label>
          ))}
        </form>
        <div className="modal-buttons">
          <button onClick={() => onConfirm(selections)} className="modal-confirm-button">
            Confirm
          </button>
          <button onClick={onCancel} className="modal-cancel-button">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default CheckboxModal;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserInfoForm.css';
import ConfirmationModal from './ConfirmationModal';

const UserInfo: React.FC = () => {
  // State for nickname input field
  const [nickname, setNickname] = useState<string>('');

  // State for validation error messages
  const [errors, setErrors] = useState<{ nickname: string }>({ nickname: '' });

  // State to control visibility of the confirmation modal
  const [showModal, setShowModal] = useState<boolean>(false);

  // Hook for navigating to the next page
  const navigate = useNavigate();

  // Updates the nickname state and validates it on each change
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
    validateNickname(e.target.value); // Validate nickname as user types
  };

  // Validation function to check nickname requirements
  const validateNickname = (value: string) => {
    if (!value) {
      // Set error if nickname is empty
      setErrors((prev) => ({ ...prev, nickname: 'Nickname is required' }));
    } else if (value.split(' ').length > 1) {
      // Set error if nickname contains spaces
      setErrors((prev) => ({ ...prev, nickname: 'Nickname should be one word' }));
    } else if (value.length > 20) {
      // Set error if nickname exceeds 20 characters
      setErrors((prev) => ({ ...prev, nickname: 'Nickname must be 20 characters or less' }));
    } else {
      // Clear error if nickname is valid
      setErrors((prev) => ({ ...prev, nickname: '' }));
    }
  };

  // Form submission handler; validates nickname and shows confirmation modal
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevents page reload on form submission

    // Validate nickname before showing confirmation modal
    validateNickname(nickname);

    // Stop submission if there are validation errors
    if (errors.nickname) {
      return;
    }

    // Show confirmation modal if nickname is valid
    setShowModal(true);
  };

  // Handles user confirmation in the modal and navigates to the next page
  const handleConfirm = () => {
    setShowModal(false); // Close the modal
    navigate('/authentication'); // Navigate to the next page
  };

  // Handles cancellation in the modal, keeping the user on the same page
  const handleCancel = () => {
    setShowModal(false); // Just close the modal without navigating
  };

  return (
    <div className="user-info-form">
      <h1 className="user-info-title">Choose Your Nickname</h1>
      <form onSubmit={handleSubmit}>
        
        {/* Nickname input field */}
        <label className="user-info-label">Nickname:</label>
        <input
          type="text"
          value={nickname}
          onChange={handleNicknameChange}
          className="user-info-input"
        />
        {/* Display error message for nickname if validation fails */}
        {errors.nickname && <p className="user-info-error">{errors.nickname}</p>}

        {/* Submit button triggers validation and opens the confirmation modal */}
        <button type="submit" className="user-info-button" disabled={!!errors.nickname}>
          Next
        </button>
      </form>

      {/* Confirmation modal for nickname approval */}
      {showModal && (
        <ConfirmationModal
          message={`Are you sure you want to use the nickname "${nickname}"?`}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default UserInfo;

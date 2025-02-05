import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserInfoForm.css';
import ConfirmationModal from './ConfirmationModal';
import { LocalStorageContext } from '../../context/LocalStorageContext';

const UserInfo: React.FC = () => {
  const context = useContext(LocalStorageContext);

  // State for nickname input field
  const [nickname, setNickname] = useState<string>('');
  const [groupSize, setGroupSize] = useState<string>('');

  // State for validation error messages
  const [errors, setErrors] = useState<{ nickname: string, groupSize: string }>({ nickname: '', groupSize: '' });

  // State to control visibility of the confirmation modal
  const [showModal, setShowModal] = useState<boolean>(false);

  // Hook for navigating to the next page
  const navigate = useNavigate();

  // Updates the nickname state and validates it on each change
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
    validateNickname(e.target.value); // Validate nickname as user types
  };

  // Updates the group size state and validates it on each change
  const handleGroupSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupSize(e.target.value);
    validateGroupSize(e.target.value); // Validate nickname as user types
  };

  // Validation function to check nickname requirements
  const validateNickname = (value: string): boolean => {
    if (!value) {
      // Set error if nickname is empty
      setErrors((prev) => ({ ...prev, nickname: 'Nickname is required' }));
    } else if (value.split(' ').length > 1) {
      // Set error if nickname contains spaces
      setErrors((prev) => ({ ...prev, nickname: 'Nickname should be one word' }));
    } else if (value.length > 10) {
      // Set error if nickname exceeds 10 characters
      setErrors((prev) => ({ ...prev, nickname: 'Nickname must be 10 characters or less' }));
    } else if (value.toLowerCase().startsWith("empty")) {
      setErrors((prev) => ({ ...prev, nickname: 'Nickname must not start with "empty"' }));
    } else if (value.toLowerCase().startsWith("unknown")) {
      setErrors((prev) => ({ ...prev, nickname: 'Nickname must not start with "unknown"' }));
    } else if (!/^[a-zA-Z]+$/.test(value)) {
      setErrors((prev) => ({ ...prev, nickname: 'Nickname must only contain letters' }));
    } else {
      // Clear error if nickname is valid
      setErrors((prev) => ({ ...prev, nickname: '' }));
      return true;
    }
    return false;
  };

  // Validation function to check nickname requirements
  const validateGroupSize = (value: string): boolean => {
    if (!value) {
      // Set error if nickname is empty
      setErrors((prev) => ({ ...prev, groupSize: 'Group size is required' }));
      return false;
    }
    if (!/^(0|[1-9]\d*)$/.test(value)) {
      // Set error if groupSize is not numeric
      setErrors((prev) => ({ ...prev, groupSize: 'Group size must be a number' }));
      return false;
    }
    const groupNum = Number(value);
    console.log(groupNum);
    if (groupNum < 2 || groupNum > 8) {
      // Set errors if groupSize is not in the range [2, 8]
      setErrors((prev) => ({ ...prev, groupSize: 'Group size must be between 2 and 8' }));
      return false;
    }

    // Clear error if nickname is valid
    setErrors((prev) => ({ ...prev, groupSize: '' }));
    return true;
  };

  // Form submission handler; validates nickname and shows confirmation modal
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevents page reload on form submission

    // Validate nickname before showing confirmation modal
    // Stop submission if the validator fails, because the errors state will not update until
    //  after the page resets
    const nicknameValid = !validateNickname(nickname);
    const groupSizeValid = !validateGroupSize(groupSize);
    if (nicknameValid || groupSizeValid) {
      return;
    }

    // Stop submission if there are validation errors
    if (errors.nickname || errors.groupSize) {
      return;
    }

    // Show confirmation modal if nickname is valid
    setShowModal(true);
  };

  // Handles user confirmation in the modal and navigates to the next page
  const handleConfirm = () => {
    setShowModal(false); // Close the modal
    const nicknameWithGroup = `${nickname} +${Number(groupSize) - 1}`;
    context.setNickname(nicknameWithGroup);
    // we are explicitly choosing NOT to save groupSize to local storage
    navigate('/sign-in'); // Navigate to the next page
  };

  // Handles cancellation in the modal, keeping the user on the same page
  const handleCancel = () => {
    setShowModal(false); // Just close the modal without navigating
  };

  return (
    <div className="main-container">
      <div className="header">
        <h1 className="header-title"><span>Brampton</span><br/>Tennis Queue</h1>
      </div>
      <div className="user-info-form">
        <h1 className="user-info-title">Choose Your Nickname<br/>& Group Size</h1>
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

          <datalist id="groupSizes">
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
              <option>6</option>
              <option>7</option>
              <option>8</option>
          </datalist>

          {/* Group Size input field */}
          <label id="group-size-label" className="user-info-label">Group size:</label>
          <input
            value={groupSize}
            list="groupSizes"
            autoComplete="on"
            onChange={handleGroupSizeChange}
            id='group-size-input'
            className="user-info-input"
          />
          {/* Display error message for nickname if validation fails */}
          {errors.groupSize && <p className="user-info-error">{errors.groupSize}</p>}

          {/* Submit button triggers validation and opens the confirmation modal */}
          <button type="submit" className="user-info-button" disabled={!!errors.nickname && !errors.groupSize}>
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
    </div>
  );
};

export default UserInfo;

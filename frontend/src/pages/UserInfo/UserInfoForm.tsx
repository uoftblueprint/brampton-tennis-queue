import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './UserInfoForm.css';

const UserInfo: React.FC = () => {
  // State for nickname input field
  const [nickname, setNickname] = useState<string>('');
  
  // State for phone number input field
  const [phone, setPhone] = useState<string>('');
  
  // State for error messages for validation (one for each field)
  const [errors, setErrors] = useState<{ nickname: string; phone: string }>({ nickname: '', phone: '' });

  // Navigation hook for redirecting to the next page
  const navigate = useNavigate();

// Handler for changes in the nickname input field
const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
    validateNickname(e.target.value); // Revalidate nickname on change
  };
  
  // Handler for changes in the phone input field
const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
    validatePhone(e.target.value); // Revalidate phone on change
  };
  

  // Validation function for nickname input
const validateNickname = (value: string) => {
    if (!value) {
      // Error if nickname is empty
      setErrors((prev) => ({ ...prev, nickname: 'Nickname is required' }));
    } else if (value.split(' ').length > 1) {
      // Error if nickname is more than one word
      setErrors((prev) => ({ ...prev, nickname: 'Nickname should be one word' }));
    } else if (value.length > 20) {
      // Error if nickname exceeds 20 characters
      setErrors((prev) => ({ ...prev, nickname: 'Nickname must be 20 characters or less' }));
    } else {
      // Clear error if all conditions are met
      setErrors((prev) => ({ ...prev, nickname: '' }));
    }
  };

  // Validation function for phone number input
const validatePhone = (value: string) => {
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/; // Pattern for 000-000-0000 format
    if (!phoneRegex.test(value)) {
      // Error if phone number does not match format
      setErrors((prev) => ({ ...prev, phone: 'Phone must be in the format 000-000-0000' }));
    } else {
      // Clear error if format is correct
      setErrors((prev) => ({ ...prev, phone: '' }));
    }
  };

// Form submission handler
const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload on form submit
    
    // Inline validation to ensure fields are not empty or invalid
    const nicknameIsValid = nickname && nickname.split(' ').length === 1 && nickname.length <= 20;
    const phoneIsValid = /^\d{3}-\d{3}-\d{4}$/.test(phone);
    
    // Update errors if validation fails
    if (!nicknameIsValid) {
      setErrors((prev) => ({ ...prev, nickname: 'Nickname is required and should be a single word with up to 20 characters' }));
    }
    if (!phoneIsValid) {
      setErrors((prev) => ({ ...prev, phone: 'Phone must be in the format 000-000-0000' }));
    }
    
    // Prevent submission if either field is invalid
    if (!nicknameIsValid || !phoneIsValid) {
      return;
    }
  
    // If no validation errors, log the submitted data (or handle it as needed)
    console.log("Form submitted:", { nickname, phone });
  
    // Navigate to the next page, e.g., /confirmation
    navigate('/next-page');
  };

  return (
    <div className="user-info-form">
      <h1 className="user-info-title">Enter Your Details</h1>
      <form onSubmit={handleSubmit}>
        
        {/* Nickname input field */}
        <label className="user-info-label">Nickname:</label>
        <input
          type="text"
          value={nickname}
          onChange={handleNicknameChange}
          className="user-info-input"
        />
        {errors.nickname && <p className="user-info-error">{errors.nickname}</p>}

        {/* Phone number input field */}
        <label className="user-info-label">Phone Number:</label>
        <input
          type="text"
          value={phone}
          onChange={handlePhoneChange}
          className="user-info-input"
        />
        {errors.phone && <p className="user-info-error">{errors.phone}</p>}

        {/* Submit button */}
        <button type="submit" className="user-info-button" disabled={!!errors.nickname || !!errors.phone}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default UserInfo;

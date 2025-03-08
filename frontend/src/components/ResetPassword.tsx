import React, { useState, useEffect } from 'react';
import usePasswordReset from '../../hooks/usePasswordReset';

import './ResetPassword.css';

interface ResetPasswordProps {
  initialEmail?: string;
  onClose?: () => void;
}

/**
 * Reset Password Modal Component
 * Provides a user-friendly interface for password reset
 */
const ResetPassword: React.FC<ResetPasswordProps> = ({
  initialEmail = '',
  onClose,
}) => {
  const {
    isResetModalOpen,
    resetEmailSent,
    resetError,
    resetInProgress,
    openResetModal,
    closeResetModal,
    checkUserAndSendReset,
    clearResetStatus
  } = usePasswordReset();

  const [email, setEmail] = useState(initialEmail);

  // Update email when initialEmail prop changes
  useEffect(() => {
    setEmail(initialEmail);
  }, [initialEmail]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkUserAndSendReset(email);
  };

  const handleClose = () => {
    closeResetModal();
    if (onClose) onClose();
  };

  // Reset button component that opens the modal
  const ResetButton: React.FC = () => (
    <div className="reset-password-link">
      <button 
        type="button" 
        className="reset-button" 
        onClick={openResetModal}
      >
        Forgot password?
      </button>
    </div>
  );

  // If modal isn't open, just show the button
  if (!isResetModalOpen) {
    return <ResetButton />;
  }

  return (
    <div className="reset-password-overlay">
      <div className="reset-password-modal">
        <button 
          className="reset-password-close" 
          onClick={handleClose}
        >
          ×
        </button>
        
        <h2>Reset Your Password</h2>
        
        {!resetEmailSent ? (
          <>
            <p className="reset-password-info">
              Enter your email address below. If an account exists, we'll send you a password reset link.
            </p>
            
            <form onSubmit={handleSubmit}>
              <div className="reset-password-input-group">
                <label htmlFor="reset-email">Email Address</label>
                <input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className={resetError ? "reset-email-error" : ""}
                />
              </div>
              
              {resetError && (
                <p className="reset-password-error">{resetError}</p>
              )}
              
              <div className="reset-password-actions">
                <button 
                  type="button" 
                  className="reset-password-cancel" 
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="reset-password-submit"
                  disabled={resetInProgress}
                >
                  {resetInProgress ? "Sending..." : "Send Reset Link"}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="reset-password-success">
            <p>✓ Password reset email sent!</p>
            <p>Check your inbox for further instructions.</p>
            <button 
              className="reset-password-close-btn" 
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
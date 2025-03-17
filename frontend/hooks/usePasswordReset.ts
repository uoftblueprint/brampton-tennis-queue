import { useState } from 'react';
import { auth } from '../src/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

// Interface for return values from the hook
interface UsePasswordResetReturn {
  isResetModalOpen: boolean;
  resetEmailSent: boolean;
  resetError: string;
  resetInProgress: boolean;
  openResetModal: () => void;
  closeResetModal: () => void;
  checkUserAndSendReset: (email: string) => Promise<void>;
  clearResetStatus: () => void;
}

// Email validation function
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Enhanced password reset hook that sends reset emails with error handling
 */
const usePasswordReset = (): UsePasswordResetReturn => {
  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false);
  const [resetEmailSent, setResetEmailSent] = useState<boolean>(false);
  const [resetError, setResetError] = useState<string>('');
  const [resetInProgress, setResetInProgress] = useState<boolean>(false);

  const openResetModal = (): void => {
    setIsResetModalOpen(true);
    setResetError('');
    setResetEmailSent(false);
  };

  const closeResetModal = (): void => {
    setIsResetModalOpen(false);
    setResetError('');
  };

  /**
   * Send password reset email and handle errors appropriately
   * @param email - The email address to send reset to
   */
  const checkUserAndSendReset = async (email: string): Promise<void> => {
    // Clear previous status
    setResetError('');
    setResetEmailSent(false);
    
    // Validate email
    if (!email) {
      setResetError('Please enter your email address to reset password.');
      return;
    }
    
    if (!isValidEmail(email)) {
      setResetError('Invalid email format. Please enter a valid email address.');
      return;
    }

    // Set in progress state
    setResetInProgress(true);
    
    try {
      // Send the reset email directly
      // Firebase will not indicate whether the user exists or not for security reasons
      // It will return success even if the email doesn't exist
      await sendPasswordResetEmail(auth, email);
      
      // Password reset email sent successfully
      setResetEmailSent(true);
    } catch (error: any) {
      // Handle errors
      console.log("Password reset error:", error.code, error.message);
      
      let errorMsg = 'Failed to send password reset email.';
      
      switch (error.code) {
        case 'auth/user-not-found':
          // For security reasons, don't expose that the user doesn't exist
          errorMsg = 'If an account with this email exists, a password reset link has been sent.';
          setResetEmailSent(true); // Show success even for non-existent users
          break;
        case 'auth/invalid-email':
          errorMsg = 'Invalid email address. Please try again.';
          break;
        case 'auth/too-many-requests':
          errorMsg = 'Too many requests. Please try again later.';
          break;
        case 'auth/network-request-failed':
          errorMsg = 'Network error. Please check your connection and try again.';
          break;
        default:
          errorMsg = 'Error sending reset email. Please try again later.';
          console.error('Unhandled password reset error:', error);
          break;
      }
      
      if (!setResetEmailSent) {
        setResetError(errorMsg);
      }
    } finally {
      setResetInProgress(false);
    }
  };

  /**
   * Reset all password reset states
   */
  const clearResetStatus = (): void => {
    setResetEmailSent(false);
    setResetError('');
    setResetInProgress(false);
    setIsResetModalOpen(false);
  };

  return {
    isResetModalOpen,
    resetEmailSent,
    resetError,
    resetInProgress,
    openResetModal,
    closeResetModal,
    checkUserAndSendReset,
    clearResetStatus
  };
};

export default usePasswordReset;
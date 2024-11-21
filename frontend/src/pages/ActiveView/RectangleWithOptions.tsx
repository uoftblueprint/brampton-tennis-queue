import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";  // For navigation
import { leaveQueue, endSession } from "../../utils/api";  // Import utility functions
import ConfirmationModal from "./ConfirmationModal";  // Import modal
import "./RectangleWithOptions.css";

interface RectangleWithOptionsProps {
  nickname: string;
  firebaseUID: string;
  userFirebaseUID: string;
  userInQueue: boolean;
  inQueue: boolean;
  location: string;
}

// Button text constants
const BUTTON_TEXT = {
  OWN_SESSION: "End your session?",
  IN_QUEUE: "Leave the queue?",
  LEFT_EARLY: "No-show? / Player left early?"
};

const RectangleWithOptions: React.FC<RectangleWithOptionsProps> = ({
  nickname,
  firebaseUID,
  userFirebaseUID,
  userInQueue,
  inQueue,
  location,
}) => {
  const [showButton, setShowButton] = useState(false);
  const [showModal, setShowModal] = useState(false);  // Track modal visibility
  const [actionToConfirm, setActionToConfirm] = useState("");  // Track the action to confirm
  const buttonRef = useRef(null);
  const rectangleRef = useRef(null);
  const navigate = useNavigate();  // Hook to navigate to other routes

  // Determines if the button text should change based on user comparison
  const determineButtonText = () => {
    if (userFirebaseUID === firebaseUID) {
      return inQueue ? BUTTON_TEXT.IN_QUEUE : BUTTON_TEXT.OWN_SESSION;
    } else {
      return BUTTON_TEXT.LEFT_EARLY;
    }
  };

  // Handles clicks outside of the rectangle and button to close the button if clicked outside
  const handleClickOutside = (event: MouseEvent) => {
    if (
      rectangleRef.current &&
      !rectangleRef.current.contains(event.target) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target)
    ) {
      setShowButton(false);
    }
  };

  // Determines if the button should be ignored based on the UID and queue status
  const shouldIgnoreButton = () => {
    return (
      firebaseUID.startsWith("Empty") ||  // Ignore empty courts
      (inQueue && firebaseUID !== userFirebaseUID) ||  // Ignore queue for other players
      (!userInQueue && firebaseUID !== userFirebaseUID)  // If user is active, ignore everything except their own court
    );
  };

  // Handle button click event for leaving the queue or ending session
  const handleButtonClick = () => {
    if (userFirebaseUID === firebaseUID) {
      if (inQueue) {
        setActionToConfirm("leaveQueue");
      } else {
        setActionToConfirm("endSession");
      }
      setShowModal(true);
    } else {
      setActionToConfirm("endOtherSession");
      setShowModal(true);
    }
  };

  // Handle modal confirmation (Leave Queue or End Session)
  const handleConfirm = async () => {
    try {
      if (actionToConfirm === "leaveQueue") {
        await leaveQueue(location, firebaseUID);  // User is leaving the queue
        alert("You have left the queue.");
      } else if (actionToConfirm === "endSession") {
        await endSession(location, firebaseUID);  // User is ending their own session
        alert("Session ended.");
      } else if (actionToConfirm === "endOtherSession") {
        await endSession(location, firebaseUID);  // Force others to end their session
        alert("Player session ended.");
      }

      // Close the modal first
      setShowModal(false);  

      // Navigate only if the action was related to the user's own session or leaving the queue
      if (actionToConfirm === "leaveQueue" || actionToConfirm === "endSession") {
        setTimeout(() => {
          localStorage.clear();  // Clear local storage
          navigate("/");  // After closing the modal, navigate to the home page
        }, 300); // Optional: small delay to ensure smooth transition
      }
    } catch (error) {
      console.log("Error: " + error.message);
    }
  };

  // Handle modal cancelation
  const handleCancel = () => {
    setShowModal(false);  // Close the modal without taking any action
  };

  // Set up event listener to handle outside clicks
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div ref={rectangleRef} className="rectangle-container">
      <span>{nickname}</span>

      {/* Display dots for toggling the button */}
      {!shouldIgnoreButton() && (
        <>
          <div
            className="dots-container"
            onClick={() => setShowButton((prev) => !prev)}
          >
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>

          {/* Conditionally render the button */}
          {showButton && (
            <button
              ref={buttonRef}
              className="action-button"
              onClick={handleButtonClick}
            >
              {determineButtonText()}
            </button>
          )}
        </>
      )}

      {/* Confirmation Modal */}
      {showModal && (
        <ConfirmationModal
          message="Are you sure?"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default RectangleWithOptions;
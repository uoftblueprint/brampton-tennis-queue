import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";  // For navigation
import { leaveQueue, endSession, sendWebNotification } from "../../utils/api";  // Import utility functions
import ConfirmationModal from "./ConfirmationModal";  // Import modal
import "./RectangleWithOptions.css";
import { LocalStorageContext } from "../../context/LocalStorageContext";

interface RectangleWithOptionsProps {
  nickname: string;
  firebaseUID: string;
  inQueue: boolean;
}

// Button text constants
const BUTTON_TEXT = {
  OWN_SESSION: "End your session?",
  IN_QUEUE: "Leave the queue?",
  LEFT_EARLY: "Report Empty",
  NOTIFY_PLAYER: "Send Reminder",
  OUT_OF_TIME: "Time's Up!",
};

// Actions constants
const ACTIONS = {
  LEAVE_QUEUE: "leaveQueue",
  END_SESSION: "endSession",
  END_OTHER_SESSION: "endOtherSession",
  SEND_WEB_REMINDER: "sendWebReminder",
}

const RectangleWithOptions: React.FC<RectangleWithOptionsProps> = ({
  nickname,
  firebaseUID,
  inQueue,
}) => {
  const context = useContext(LocalStorageContext)!;

  const userFirebaseUID = context.firebaseUID;
  const userInQueue = context.inQueue;
  const location = context.selectedLocation;

  const [showButton, setShowButton] = useState(false);
  const [showModal, setShowModal] = useState(false);  // Track modal visibility
  const [actionToConfirm, setActionToConfirm] = useState("");  // Track the action to confirm
  const [userOutOftime, setUserOutOfTime] = useState(false);

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const rectangleRef = useRef<HTMLDivElement | null>(null);  
  const navigate = useNavigate();  // Hook to navigate to other routes

  // Determines if the button text should change based on user comparison
  const determineButtonText = (buttonNum: number = 0) => {
    if (userFirebaseUID === firebaseUID) {
      return inQueue ? BUTTON_TEXT.IN_QUEUE : BUTTON_TEXT.OWN_SESSION;
    } else {
      switch (buttonNum) {
        case 1:
          return BUTTON_TEXT.LEFT_EARLY;
        case 2:
          return BUTTON_TEXT.NOTIFY_PLAYER;
        case 3:
          return BUTTON_TEXT.OUT_OF_TIME;
        default:
          return BUTTON_TEXT.LEFT_EARLY
      }
    }
  };

  // Handles clicks outside of the rectangle and button to close the button if clicked outside
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Node; // Safely cast event.target to Node
    if (
      rectangleRef.current &&
      !rectangleRef.current.contains(target) &&
      buttonRef.current &&
      !buttonRef.current.contains(target)
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
  const handleButtonClick = (buttonNumber: number = 0) => {
    if (userFirebaseUID === firebaseUID) {
      if (inQueue) {
        setActionToConfirm(ACTIONS.LEAVE_QUEUE);
      } else {
        setActionToConfirm(ACTIONS.END_SESSION);
      }
      setShowModal(true);
    } else {
      switch (buttonNumber) {
        case 1: {
          setActionToConfirm(ACTIONS.END_OTHER_SESSION);
          break;
        }
        case 2: {
          setActionToConfirm(ACTIONS.SEND_WEB_REMINDER);
          break;
        }
        case 3: {
          setActionToConfirm(ACTIONS.END_SESSION);
          break;
        }
        default: {
          setActionToConfirm(ACTIONS.END_OTHER_SESSION);
          break;
        }
      }
      setShowModal(true);
    }
  };

  // Handle modal confirmation (Leave Queue or End Session)
  const handleConfirm = async () => {
    try {
      if (actionToConfirm === ACTIONS.LEAVE_QUEUE) {
        await leaveQueue(location, firebaseUID);  // User is leaving the queue
        alert("You have left the queue.");
      } else if (actionToConfirm === ACTIONS.END_SESSION) {
        await endSession(location, firebaseUID);  // User is ending their own session
        alert("Session ended.");
      } else if (actionToConfirm === ACTIONS.END_OTHER_SESSION) {
        await endSession(location, firebaseUID);  // Force others to end their session
        alert("Player session ended.");
      } else if (actionToConfirm === ACTIONS.SEND_WEB_REMINDER) {
        // ✅ Corrected API Call to Send Reminder
        await sendWebNotification(location, firebaseUID, {
            title: "Reminder: Time’s Up!",
            body: "Your court time has ended. Please make way for the next player."
        });

        alert("Reminder sent to player.");
    }

      // Close the modal first
      setShowModal(false);  

      // Navigate only if the action was related to the user's own session or leaving the queue
      if (actionToConfirm === "leaveQueue" || actionToConfirm === "endSession") {
        setTimeout(() => {
          context.clear();  // Clear local storage
          navigate("/");  // After closing the modal, navigate to the home page
        }, 300); // Optional: small delay to ensure smooth transition
      }
    } catch (error : any) {
      console.log("Error: " + error.message);
    }
  };

  // Handle modal cancelation
  const handleCancel = () => {
    setShowModal(false);  // Close the modal without taking any action
  };

  // Update if the user's nickname shows they are out of time
  useEffect(() => {
    if (nickname.includes("[") || nickname.includes("]")) {
      setUserOutOfTime(true);
    } else {
      setUserOutOfTime(false);
    }
  }, [nickname]);

  // Set up event listener to handle outside clicks
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div ref={rectangleRef} className="rectangle-container">
      <p>{nickname}</p>

      {/* Display dots for toggling the button */}
      {!shouldIgnoreButton() && (
        <div className="right-container">
          <div
            className="dots-container"
            onClick={() => setShowButton((prev) => !prev)}
          >
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>



          {showButton && (
            <>
              {/* Conditionally render the button(s) */}
              <div 
                className="action-button-container"
                style={{
                  position: "absolute",
                  top: rectangleRef.current ? rectangleRef.current.getBoundingClientRect().bottom + window.scrollY - 16 : 0,
                  left: rectangleRef.current?.getBoundingClientRect().left || 0,
                }}
              >
                {userOutOftime && (
                  [1, 2, 3].map((buttonNumber: number) => {
                    return (
                      <button
                        ref={buttonRef}
                        className="action-button"
                        onClick={() => handleButtonClick(buttonNumber)}
                      >
                        {determineButtonText(buttonNumber)}
                      </button>
                    )})
                )}

                {!userOutOftime && (
                    <button
                      ref={buttonRef}
                      className="action-button"
                      onClick={() => handleButtonClick()}
                    >
                      {determineButtonText()}
                    </button>
                )}
              </div>
            </>
          )}
        </div>
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
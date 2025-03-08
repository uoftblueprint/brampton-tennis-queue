import React, { useEffect, useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ActiveView.css';
import CurrentState from './CurrentState';
import { joinGame } from '../../utils/api';
import { getTaken } from '../../utils/api';
import { addUnknowns } from '../../utils/api';
import { LocalStorageContext } from '../../context/LocalStorageContext';
import { AuthContext } from '../../context/AuthContext';
import ConfirmationModal from './ConfirmationModal';

const ActiveView: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [updateRequired, setUpdateRequired] = useState<boolean>(false);
  const [courtNumbers, setCourtNumbers] = useState<number[]>([]);
  const [numberOfCourts, setNumberOfCourts] = useState<number>(0);
  const [selectedCourts, setSelectedCourts] = useState<number[]>([]);
  const [showSelection, setShowSelection] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [showEmailAlert, setShowEmailAlert] = useState<boolean>(false);

  const navigate = useNavigate();
  const hasInitializedRef = useRef<boolean>(false);
  
  const authContext = useContext(AuthContext);
  const localContext = useContext(LocalStorageContext);
  
  if (!localContext || !authContext) {
    return <div>Loading...</div>;
  }

  const { currentUser } = authContext;

  const { 
    selectedLocation: location,
    nickname,
    token,
    firebaseUID,
    addedToGame,
    setAddedToGame,
    setInQueue 
  } = localContext;

  useEffect(() => {
    // Check if the email is verified
    if (currentUser && !currentUser.emailVerified) {
      setLoading(false);
      setShowEmailAlert(true);
      return;
    }
    // Check if we have the required data
    if (!firebaseUID || !location || !nickname) {
      navigate('/');
      return;
    }
    // Only initialize if we haven't been added to a game yet
    if (!hasInitializedRef.current && !addedToGame) {
      handleGetTaken();
      hasInitializedRef.current = true;
    } else {
      // If we're already added to game, just set loading to false
      setLoading(false);
    }
  }, [firebaseUID, location, nickname, navigate, addedToGame]);

  const handleGetTaken = async () => {
    try {
      const { updateRequired, takenCourts, numberOfCourts } = await getTaken(location);
      setUpdateRequired(updateRequired);
      setCourtNumbers(takenCourts);
      setNumberOfCourts(numberOfCourts);
      setSelectedCourts(takenCourts);

      if (updateRequired) {
        setLoading(false);
        setShowSelection(true);
      } else {
        initializeGame();
      }
    } catch (error) {
      console.error('Error fetching taken courts:', error);
      alert('Could not fetch court data. Proceeding with trying to join the game.')
      initializeGame();
    }
  };

  const handleConfirmEmailAlert = () => {
    setShowEmailAlert(false);
    setLoading(true);
    navigate('/sign-in');
  };

  const handleCheckboxChange = (courtNumber: number) => {
    setSelectedCourts((prevSelected) =>
      prevSelected.includes(courtNumber)
        ? prevSelected.filter((num) => num !== courtNumber)
        : [...prevSelected, courtNumber]
    );
  };

  const handleConfirmSelection = () => {
    setShowConfirmation(true); // Open confirmation modal
  };

  const handleConfirm = async () => {
    setShowConfirmation(false); // Close modal
    setShowSelection(false); // Hide checkboxes

    try {
      setLoading(true);
      await addUnknowns(location, selectedCourts);
    } catch (error) {
      console.error('Error updating unknown courts:', error);
    }
    
    initializeGame();
  };

  const initializeGame = async () => {
    if (!addedToGame) {
      setLoading(true);
      try {
        console.log("Attempting to join game with:", {
          location,
          nickname,
          firebaseUID
        });

        const response = await joinGame(location, nickname, firebaseUID, token);
        console.log("Join game response:", response);
        
        if (response) {
          await new Promise((resolve) => setTimeout(resolve, 2000));  // Sleep to ensure database propogates first
          localContext?.setAddedToGame(true);
          localContext?.setInQueue(true);
          localContext?.setAddedToGame(true);
          localContext?.setInQueue(true);
        } else {
          throw new Error('Failed to join game');
        }
      } catch (error) {
        console.error('Error joining queue:', error);
        alert('Failed to join the queue. Please try again.');
        // Add this redirect
        navigate('/');
      }
    }
    setLoading(false);
};

return (
  <div className="active-view">
    {/* Show Email Verification Alert */}
    {showEmailAlert && (
        <ConfirmationModal
          message="You must verify your email before joining the game."
          onConfirm={handleConfirmEmailAlert}
          onCancel={handleConfirmEmailAlert}
        />
      )}

    {/* Show Loading Spinner */}
    {loading && <p>Loading...</p>}

    {/* Show Confirmation Modal (if applicable) */}
    {!loading && showConfirmation && (
      <ConfirmationModal
        message="Are you sure you want to update occupied courts?"
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirmation(false)}
      />
    )}

    {/* Show Court Selection (if applicable) */}
    {!loading && !showConfirmation && showSelection && (
      <div className="court-selection-overlay">
        <div className="court-selection">
        <h2>Confirm Action</h2>
          <p>Which courts are currently occupied?</p>
          {[...Array(numberOfCourts)].map((_, index) => (
            <label key={index}>
              <input
                type="checkbox"
                checked={selectedCourts.includes(index + 1)}
                onChange={() => handleCheckboxChange(index + 1)}
              />
              Court {index + 1}
            </label>
          ))}
          <div className="court-selection-buttons">
            <button onClick={handleConfirmSelection} className="court-confirm-button">Confirm Selection</button>
          </div>
        </div>
      </div>
    )}

    {/* Show Current State if no other prompts */}
    {!loading && !showConfirmation && !showSelection && !showEmailAlert && <CurrentState />}
  </div>
);
};
export default ActiveView;
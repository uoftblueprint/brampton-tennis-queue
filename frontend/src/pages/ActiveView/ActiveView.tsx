import React, { useEffect, useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ActiveView.css';
import CurrentState from './CurrentState';
import { joinGame } from '../../utils/api';
import { getTaken } from '../../utils/api';
import { addUnknowns } from '../../utils/api';
import { LocalStorageContext } from '../../context/LocalStorageContext';
import ConfirmationModal from './ConfirmationModal';

const ActiveView: React.FC = () => {
  const context = useContext(LocalStorageContext);

  const location = context.selectedLocation;
  const firebaseUID = context.firebaseUID;
  const nickname = context.nickname;

  const [loading, setLoading] = useState<boolean>(true);  // Initially set loading to true
  const [updateRequired, setUpdateRequired] = useState<boolean>(false);
  const [courtNumbers, setCourtNumbers] = useState<number[]>([]);
  const [numberOfCourts, setNumberOfCourts] = useState<number>(0);
  const [selectedCourts, setSelectedCourts] = useState<number[]>([]);
  const [showSelection, setShowSelection] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  const navigate = useNavigate();

  const hasInitializedRef = useRef<boolean>(false);

  useEffect(() => {
    console.log("Active view useEffect");
    if (!firebaseUID) {
      setTimeout(() => {}, 1000);  // 1-second timeout for UID to load
    }
    if (!firebaseUID) {
      navigate('/'); // If firebaseUID is not available, redirect to home
      return;
    }
    // Prevents initalizeGame from being called again by strict mode
    if (!hasInitializedRef.current) {
      handleGetTaken();
      hasInitializedRef.current = true;
    }
  }, []);

  const handleGetTaken = async () => {
    try {
      const { updateRequired, takenCourts, totalCourts } = await getTaken(location);
      setUpdateRequired(updateRequired);
      setCourtNumbers(takenCourts);
      setNumberOfCourts(totalCourts);
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
    const addedToGame = context.addedToGame;
    if (!addedToGame) {
      setLoading(true);
      try {
        const { status } = await joinGame(location, nickname, firebaseUID); // Call to backend
        context.setAddedToGame(true);
        context.setInQueue(status === 'queue' ? true : false);
      } catch (error) {
        console.error('Error joining queue:', error);
        alert('Failed to join the queue. Please try again.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="active-view">
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
        <div className="court-selection">
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
          <div className="button-container">
            <button onClick={handleConfirmSelection}>Confirm Selection</button>
          </div>
        </div>
      )}
  
      {/* Show Current State if no other prompts */}
      {!loading && !showConfirmation && !showSelection && <CurrentState />}
    </div>
  );  
};

export default ActiveView;
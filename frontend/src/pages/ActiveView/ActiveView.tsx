import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ActiveView.css';
import CurrentState from './CurrentState';
import CheckboxModal from './CheckboxModal';
import ConfirmationModal from './ConfirmationModal';
import { joinGame, getTaken, addUnknowns } from '../../utils/api';

interface CheckboxOption {
  label: string;
  value: number;
  checked: boolean;
}

const ActiveView: React.FC = () => {
  const location = localStorage.getItem('selectedLocation');
  const firebaseUID =  localStorage.getItem('firebaseUID');
  const nickname = localStorage.getItem('nickname');

  console.log(firebaseUID)
  console.log(nickname)

  const [loading, setLoading] = useState<boolean>(true);  // Initially set loading to true
  const [showCheckboxModal, setShowCheckboxModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [checkboxOptions, setCheckboxOptions] = useState<CheckboxOption[]>([]);
  const [onConfirmCallback, setOnConfirmCallback] = useState<(() => void) | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!firebaseUID) {
      setTimeout(() => {}, 1000);  // 1-second timeout for UID to load
    }
    if (!firebaseUID) {
      navigate('/'); // If firebaseUID is not available, redirect to home
      return;
    }
    initializeGame();
  }, []);

  const initializeGame = async () => {
    console.log('initializeGame')

    const addedToGame = localStorage.getItem('addedToGame') === 'true';

    console.log(addedToGame)

    if (!addedToGame) {
      setLoading(true);
      try {
        await handlePreJoinGame();
      } catch (error) {
        console.error('Error during initialization:', error);
        alert('Initialization failed. Please try again.');
      }
    }
    setLoading(false);
  };

  // Pre-join game flow to check and update courts before joining
  const handlePreJoinGame = async () => {
    try {
      // Step 1: Call /getTaken to check if update is required
      const { updateRequired, takenCourts, numberOfCourts } = await getTaken(location);

      console.log(updateRequired)
      console.log(takenCourts)
      console.log(numberOfCourts)

      if (!updateRequired) {
        // If no update is required, directly proceed to join game
        await handleJoinGame();
        return;
      }

      // Step 2: Prepare checkbox options
      const options = Array.from({ length: numberOfCourts }, (_, i) => ({
        label: `Court ${i + 1}`,
        value: i + 1,
        checked: takenCourts.includes(i + 1),
      }));
      setCheckboxOptions(options);

      // Step 3: Show checkbox modal to the user
      setShowCheckboxModal(true);
    } catch (error) {
      console.error('Error in handlePreJoinGame:', error);
      throw error;
    }
  };

  // Handle checkbox confirmation to update courts
  const handleConfirmCheckbox = async (selectedOptions: CheckboxOption[]) => {
    try {
      setShowCheckboxModal(false);

      const occupiedCourts = selectedOptions.filter((opt) => opt.checked).map((opt) => opt.value);

      // Step 4: Show confirmation modal before calling /addUnknowns
      setOnConfirmCallback(async () => {
        await addUnknowns(location, occupiedCourts);
        console.log('Courts updated.');
        await handleJoinGame(); // Proceed to join game
      });
      setShowConfirmation(true);
    } catch (error) {
      console.error('Error in handleConfirmCheckbox:', error);
      throw error;
    }
  };

  // Cancel the checkbox modal without making changes
  const handleCancelCheckbox = () => setShowCheckboxModal(false);

  // Join game after pre-conditions are met
  const handleJoinGame = async () => {
    try {
      const { status } = await joinGame(location, nickname, firebaseUID);
      localStorage.setItem('addedToGame', 'true');
      localStorage.setItem('inQueue', status === 'queue' ? 'true' : 'false');
      console.log('Joined queue successfully!');
    } catch (error) {
      console.error('Error in joinGame:', error);
      alert('Failed to join the queue. Please try again.');
    }
  };

  // Execute the confirmation callback and close the modal
  const handleConfirmAction = () => {
    if (onConfirmCallback) {
      onConfirmCallback();
    }
    setShowConfirmation(false);
  };

  // Cancel the confirmation modal
  const handleCancelAction = () => setShowConfirmation(false);

  return (
    <div className="active-view">
      {loading ? <p>Loading...</p> : <CurrentState />}

      {showCheckboxModal && (
        <CheckboxModal
          message="Which courts are currently occupied?"
          options={checkboxOptions}
          onConfirm={handleConfirmCheckbox}
          onCancel={handleCancelCheckbox}
        />
      )}

      {showConfirmation && (
        <ConfirmationModal
          message="Are you sure you want to update the occupied courts?"
          onConfirm={handleConfirmAction}
          onCancel={handleCancelAction}
        />
      )}
    </div>
  );
};

export default ActiveView;
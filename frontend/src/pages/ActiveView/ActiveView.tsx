import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './ActiveView.css';
import CurrentState from './CurrentState';
import { joinGame } from '../../utils/api';
import { LocalStorageContext } from '../../context/LocalStorageContext';

const ActiveView: React.FC = () => {
  const context = useContext(LocalStorageContext);

  const location = context.selectedLocation;
  const firebaseUID = context.firebaseUID;
  const nickname = context.nickname;

  const [loading, setLoading] = useState<boolean>(true);  // Initially set loading to true

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
      {loading ? <p>Loading...</p> : <CurrentState />}
    </div>
  );
};

export default ActiveView;
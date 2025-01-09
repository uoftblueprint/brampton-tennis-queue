import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ActiveView.css';
import CurrentState from './CurrentState';
import { joinGame } from '../../utils/api';

const ActiveView: React.FC = () => {
  const location = localStorage.getItem('selectedLocation');
  const firebaseUID = localStorage.getItem('firebaseUID');
  const nickname = localStorage.getItem('nickname');

  const [loading, setLoading] = useState<boolean>(true);  // Initially set loading to true

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
      initializeGame();
      hasInitializedRef.current = true;
    }
  }, []);

  const initializeGame = async () => {
    const addedToGame = localStorage.getItem('addedToGame') === 'true';
    if (!addedToGame) {
      setLoading(true);
      try {
        const { status } = await joinGame(location, nickname, firebaseUID); // Call to backend
        localStorage.setItem('addedToGame', 'true');
        localStorage.setItem('inQueue', status === 'queue' ? 'true' : 'false');
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
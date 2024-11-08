import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const BACKEND_API = 'http://localhost:5001';


// ** UTILITY FUNCTIONS TO CALL BACKEND ENDPOINTS **

// Fetch data from /currentState endpoint
export const fetchCurrentState = async (locationName, timestamp = null, retries = 3, delay = 500) => {
  try {
    const response = await fetch(`${BACKEND_API}/api/currentState`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        location: locationName,
        userLastCheckTime: timestamp,
      }),
    });
    if (!response.ok) throw new Error('Failed to retrieve current state.');
    const data = await response.json();
    return data;
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying fetchCurrentState (${retries} retries left)...`);
      await new Promise(res => setTimeout(res, delay));  // Exponential backoff
      return await fetchCurrentState(locationName, timestamp, retries - 1, delay * 2);  // Up to 3 retries
    }
    console.error("Error fetching current state:", error);
    return null;
  }
};

// Remove player from queue with /leaveQueue endpoint
export const leaveQueue = async (locationName, userID, retries = 3, delay = 500) => {
  try {
    const response = await fetch(`${BACKEND_API}/api/leaveQueue`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        location: locationName,
        firebaseUID: userID,
      }),
    });
    if (!response.ok) throw new Error('Failed to leave queue.');
    const data = await response.json();
    return data;
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying leaveQueue (${retries} retries left)...`);
      await new Promise(res => setTimeout(res, delay));  // Exponential backoff
      return await leaveQueue(locationName, userID, retries - 1, delay * 2);  // Up to 3 retries
    }
    console.error("Error leaving queue:", error);
    return null;
  }
};


// ** UTILITY FUNCTIONS TO CREATE FIRESTORE LISTENER **

// Subscribe to Firestore snapshot for given location document
export const subscribeToLocation = (location, callCurrentState) => {
  // Create reference to location document and store last update timestamp
  const locationRef = doc(db, 'locations', location);
  let lastProcessedUpdateTime = null;

  // Listener function
  const locationListener = onSnapshot(
    locationRef,
    (docSnapshot) => {
      if (!docSnapshot.exists()) {
        console.error("Location document does not exist");
        return;
      }

      // Get new update time and return if snapshot update time hasn't changed
      const newUpdateTime = docSnapshot.data().lastUpdateTime.toMillis();
      if (lastProcessedUpdateTime && newUpdateTime <= lastProcessedUpdateTime) {
        return;
      }

      // Update last processed update time and call endpoint
      lastProcessedUpdateTime = newUpdateTime;
      callCurrentState();
    },
    (error) => {
      console.error("Error in location listener: ", error);
    }
  );

  // Return unsubscribe function for listener
  return () => {
    locationListener();
  };
};
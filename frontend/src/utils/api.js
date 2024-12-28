import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const BACKEND_API = 'http://localhost:5001';


// ** UTILITY FUNCTIONS TO CALL BACKEND ENDPOINTS **

// Fetch data from /currentState endpoint
export const fetchCurrentState = async (locationName, retries = 3, delay = 500) => {
  try {
    const response = await fetch(`${BACKEND_API}/api/currentState`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        location: locationName,
      }),
    });
    if (!response.ok) throw new Error('Failed to retrieve current state.');
    const data = await response.json();
    return data;
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying fetchCurrentState (${retries} retries left)...`);
      await new Promise(res => setTimeout(res, delay));  // Exponential backoff
      return await fetchCurrentState(locationName, retries - 1, delay * 2);  // Up to 3 retries
    }
    console.error("Error fetching current state:", error);
    return null;
  }
};

// End a player's session using the /endSession endpoint
export const endSession = async (locationName, firebaseUID, retries = 3, delay = 500) => {
  try {
    const response = await fetch(`${BACKEND_API}/api/endSession`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        location: locationName,
        firebaseUID: firebaseUID,
      }),
    });
    if (!response.ok) throw new Error('Failed to end session.');
    const data = await response.json();
    return data;
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying endSession (${retries} retries left)...`);
      await new Promise(res => setTimeout(res, delay));  // Exponential backoff
      return await endSession(locationName, firebaseUID, retries - 1, delay * 2);  // Up to 3 retries
    }
    console.error("Error ending session:", error);
    return null;
  }
};

// Add player to game with /joinGame endpoint
export const joinGame = async (locationName, nickname, firebaseUID, retries = 3, delay = 500) => {
  try {
    const response = await fetch(`${BACKEND_API}/api/joinGame`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        location: locationName,
        nickname: nickname,
        firebaseUID: firebaseUID,
      }),
    });
    if (!response.ok) throw new Error('Failed to join game.');
    const data = await response.json();
    return data;
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying join game (${retries} retries left)...`);
      await new Promise(res => setTimeout(res, delay));  // Exponential backoff
      return await joinGame(locationName, nickname, firebaseUID, retries - 1, delay * 2);  // Up to 3 retries
    }
    console.error("Error joining game:", error);
    return null;
  }
};

// Remove player from queue with /leaveQueue endpoint
export const leaveQueue = async (locationName, firebaseUID, retries = 3, delay = 500) => {
  try {
    const response = await fetch(`${BACKEND_API}/api/leaveQueue`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        location: locationName,
        firebaseUID: firebaseUID,
      }),
    });
    if (!response.ok) throw new Error('Failed to leave queue.');
    const data = await response.json();
    return data;
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying leaveQueue (${retries} retries left)...`);
      await new Promise(res => setTimeout(res, delay));  // Exponential backoff
      return await leaveQueue(locationName, firebaseUID, retries - 1, delay * 2);  // Up to 3 retries
    }
    console.error("Error leaving queue:", error);
    return null;
  }
};


// Send a reminder to an active player with the /sendWebNotification  endpoint
export const sendWebNotification = async (locationName, firebaseUID, message, retries = 3, delay = 500) => {
  try {
    const response = await fetch(`${BACKEND_API}/api/sendWebNotification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        location: locationName,
        firebaseUID: firebaseUID,
        message: message,
      }),
    });
    if (!response.ok) throw new Error('Failed to send web notification.');
    const data = await response.json();
    return data;
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying sendWebNotification (${retries} retries left)...`);
      await new Promise(res => setTimeout(res, delay));  // Exponential backoff
      return await leaveQueue(locationName, firebaseUID, retries - 1, delay * 2);  // Up to 3 retries
    }
    console.error("Error leaving queue:", error);
    return null;
  }
};


// ** UTILITY FUNCTION TO CREATE FIRESTORE LISTENER **

// Subscribe to Firestore snapshot for a specific location document
export const subscribeToLocation = (location, updateState) => {
  // Create reference to location document
  const locationRef = doc(db, 'locations', location);

  // Listener function
  const unsubscribe = onSnapshot(
    locationRef,
    (docSnapshot) => {
      if (!docSnapshot.exists()) {
        console.error(`Location document "${location}" does not exist`);
        return;
      }

      // Get document data and update the state
      const locationData = docSnapshot.data();
      updateState(locationData);
    },
    (error) => {
      console.error("Error in location listener:", error);
    }
  );

  // Return the unsubscribe function
  return unsubscribe;
};
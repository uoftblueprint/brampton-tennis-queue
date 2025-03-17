import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const BACKEND_API = 'https://us-central1-brampton-tennis-queue.cloudfunctions.net'; // <-- Update if needed

// ** UTILITY FUNCTIONS TO CALL BACKEND ENDPOINTS **

// Fetch data from /currentState endpoint
export const fetchCurrentState = async (locationName, retries = 3, delay = 500) => {
  try {
    const response = await fetch(`${BACKEND_API}/currentState`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ location: locationName }),
    });
    if (!response.ok) throw new Error('Failed to retrieve current state.');
    const data = await response.json();
    return data;
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying fetchCurrentState (${retries} retries left)...`);
      await new Promise(res => setTimeout(res, delay));
      return await fetchCurrentState(locationName, retries - 1, delay * 2);
    }
    console.error('Error fetching current state:', error);
    return null;
  }
};

// End a player's session using the /endSession endpoint
export const endSession = async (locationName, firebaseUID, retries = 3, delay = 500) => {
  try {
    const response = await fetch(`${BACKEND_API}/endSession`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ location: locationName, firebaseUID: firebaseUID }),
    });
    if (!response.ok) throw new Error('Failed to end session.');
    const data = await response.json();
    return data;
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying endSession (${retries} retries left)...`);
      await new Promise(res => setTimeout(res, delay));
      return await endSession(locationName, firebaseUID, retries - 1, delay * 2);
    }
    console.error('Error ending session:', error);
    return null;
  }
};

// Add player to game with /joinGame endpoint
export const joinGame = async (locationName, nickname, firebaseUID, token, retries = 3, delay = 500) => {
  try {
    const response = await fetch(`${BACKEND_API}/joinGame`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        location: locationName,
        nickname: nickname,
        firebaseUID: firebaseUID,
        fcmToken: token,
      }),
    });
    if (!response.ok) throw new Error('Failed to join game.');
    const data = await response.json();
    return data;
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying joinGame (${retries} retries left)...`);
      await new Promise(res => setTimeout(res, delay));
      return await joinGame(locationName, nickname, firebaseUID, retries - 1, delay * 2);
    }
    console.error('Error joining game:', error);
    return null;
  }
};

// Remove player from queue with /leaveQueue endpoint
export const leaveQueue = async (locationName, firebaseUID, retries = 3, delay = 500) => {
  try {
    const response = await fetch(`${BACKEND_API}/leaveQueue`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ location: locationName, firebaseUID: firebaseUID }),
    });
    if (!response.ok) throw new Error('Failed to leave queue.');
    const data = await response.json();
    return data;
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying leaveQueue (${retries} retries left)...`);
      await new Promise(res => setTimeout(res, delay));
      return await leaveQueue(locationName, firebaseUID, retries - 1, delay * 2);
    }
    console.error('Error leaving queue:', error);
    return null;
  }
};

// ** New: Send a reminder/notification to a user with /sendWebNotification endpoint **
export const sendWebNotification = async (locationName, uid, message, retries = 3, delay = 500) => {
  console.log("locationName", locationName);
  console.log("uid", uid);
  console.log("message", message);
  try {
    const response = await fetch(`${BACKEND_API}/sendWebNotification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        location: locationName,
        uid,
        message, // message should be an object: { title: '...', body: '...' }
      }),
    });

    if (!response.ok) throw new Error('Failed to send web notification.');
    const data = await response.json();
    return data;
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying sendWebNotification (${retries} retries left)...`);
      await new Promise(res => setTimeout(res, delay));
      return await sendWebNotification(locationName, uid, message, retries - 1, delay * 2);
    }
    console.error('Error sending web notification:', error);
    return null;
  }
};

// Retrieve taken courts info with /getTaken endpoint
export const getTaken = async (locationName, retries = 3, delay = 500) => {
  try {
    const response = await fetch(`${BACKEND_API}/getTaken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ location: locationName }),
    });
    if (!response.ok) throw new Error('Failed to retrieve taken courts.');
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying getTaken (${retries} retries left)...`);
      await new Promise(res => setTimeout(res, delay));
      return await getTaken(locationName, retries - 1, delay * 2);
    }
    console.error('Error fetching taken courts:', error);
    return null;
  }
};

// Add unknown players to the location with /addUnknowns endpoint
export const addUnknowns = async (locationName, courts, retries = 3, delay = 500) => {
  try {
    const response = await fetch(`${BACKEND_API}/addUnknowns`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        location: locationName,
        occupiedCourts: courts,
      }),
    });
    if (!response.ok) throw new Error('Failed to add unknowns.');
    const data = await response.json();
    return data;
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying addUnknowns (${retries} retries left)...`);
      await new Promise(res => setTimeout(res, delay));
      return await addUnknowns(locationName, courts, retries - 1, delay * 2);
    }
    console.error('Error adding unknowns:', error);
    return null;
  }
};

// Get the expected wait time for a location
export const expectedWaitTime = async (locationName, retries = 3, delay = 500) => {
  try {
    const response = await fetch(`${BACKEND_API}/expectedWaitTime`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ location: locationName }),
    });
    if (!response.ok) throw new Error('Failed to fetch expected wait time.');
    const data = await response.json();
    return data;
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying expectedWaitTime (${retries} retries left)...`);
      await new Promise(res => setTimeout(res, delay));
      return await expectedWaitTime(locationName, retries - 1, delay * 2);
    }
    console.error(`Error getting expected wait time for location ${locationName}: ${error}`);
    return null;
  }
};

// ** UTILITY FUNCTION TO CREATE FIRESTORE LISTENER **
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

      // Check if the data is from the cache as this snapshot will be out of
      // date and will trigger a premature shutdown of the listener causing
      // the bug on load after joining the game
      if (docSnapshot.metadata.fromCache) {
        // Skip the update since the data is from the cache
        console.log('Data is from cache, waiting for real-time data');
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

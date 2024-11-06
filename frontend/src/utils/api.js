import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

const BACKEND_API = 'http://localhost:5001';

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
        lastCheckTime: timestamp,
      }),
    });
    if (!response.ok) throw new Error('Failed to retrieve current state.');
    const data = await response.json();
    return data;
  } catch (error) {
    if (retries > 0) {
      console.warn(`Retrying fetchCurrentState (${retries} retries left)...`);
      await new Promise(res => setTimeout(res, delay));  // Exponential backoff
      return await fetchCurrentState(locationName, timestamp, retries - 1, delay * 2);  // Up to 3 retries
    }
    console.error("Error fetching current state:", error);
    return null;
  }
};

// Subscribe to Firestore snapshots for active and queue players
export const subscribeToCurrentState = (location, onUpdate) => {
  const activePlayersRef = collection(db, 'locations', location, 'activePlayers');
  const queuePlayersRef = collection(db, 'locations', location, 'queuePlayers');

  const activeQuery = query(activePlayersRef, orderBy('courtNumber'));
  const queueQuery = query(queuePlayersRef, orderBy('timeJoinedQueue'));

  // Listener for active players
  const activeListener = onSnapshot(
    activeQuery,
    (snapshot) => {
      const activePlayersList = snapshot.docs.map((doc) => doc.data().nickname);

      // Nested listener for queue players
      const queueListener = onSnapshot(
        queueQuery,
        (snapshot) => {
          const queuePlayersList = snapshot.docs.map((doc) => doc.data().nickname);
          
          // Call onUpdate with both lists together
          onUpdate({ activePlayersList, queuePlayersList });
        },
        (error) => {
          console.error("Error in queue players listener:", error);
        }
      );
    },
    (error) => {
      console.error("Error in active players listener:", error);
    }
  );

  // Return combined unsubscribe function for both listeners
  return () => {
    activeListener();
  };
};
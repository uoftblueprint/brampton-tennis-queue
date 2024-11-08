const BACKEND_API = 'http://localhost:5001';


// ** UTILITY FUNCTIONS TO CALL BACKEND ENDPOINTS **

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
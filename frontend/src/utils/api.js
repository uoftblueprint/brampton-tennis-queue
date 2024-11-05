const BACKEND_API = 'http://localhost:5001';

// Fetch data from /currentState endpoint
export const fetchCurrentState = async (locationName, timestamp = null) => {
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
    console.error(error);
    return null;
  }
};
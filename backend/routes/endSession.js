const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
// const advanceQueue = require('./advanceQueue');  // Import advanceQueue function

// End Session Endpoint
router.post('/endSession', async (req, res) => {
    try {
        // Extract location and firebaseUID from the request body
        const { location, firebaseUID } = req.body;
        if (!location || !firebaseUID || firebaseUID.toLowerCase().startsWith("empty")) {
            return res.status(400).json({ message: 'Location and Firebase UID are required.' });
        }

        // Get the location document snapshot
        const locationRef = admin.firestore().collection('locations').doc(location);
        const locationSnapshot = await locationRef.get();
        if (!locationSnapshot.exists) {
            return res.status(404).json({ message: 'Location not found.' });
        }

        // Access relevant arrays
        const locationData = locationSnapshot.data();
        const { activeFirebaseUIDs, activeNicknames, activeWaitingPlayers } = locationData;

        // Check whether player exists
        const playerIndex = activeFirebaseUIDs.indexOf(firebaseUID);
        if (playerIndex === -1) {
            return res.status(404).json({ message: 'FirebaseUID not found.' });
        }

        // Update the relevant fields
        const newName = `Empty${playerIndex + 1}`;
        activeFirebaseUIDs[playerIndex] = newName;
        activeNicknames[playerIndex] = newName;
        activeWaitingPlayers[playerIndex] = false;

        // Write new data to Firestore
        await locationRef.update({
            activeFirebaseUIDs: activeFirebaseUIDs,
            activeNicknames: activeNicknames,
            activeWaitingPlayers: activeWaitingPlayers,
        });
  
        // Call the advanceQueue endpoint to move the queue forward
        // await advanceQueue(location);
  
        res.status(200).json({ message: 'Session ended successfully and queue advanced.' });
    } catch (error) {
        console.error('Error ending session:', error);
        res.status(500).json({ error: 'Failed to end session.' });
    }
});
  
module.exports = router;
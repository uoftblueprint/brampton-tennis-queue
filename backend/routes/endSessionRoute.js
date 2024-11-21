const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const endSession = require('../utils/endSession');  // Import the end session utility
const advanceQueue = require('../utils/advanceQueue');  // Import the advance queue utility

// End Session Endpoint
router.post('/endSession', async (req, res) => {
    try {
        // Extract location and firebaseUID from the request body
        const { location, firebaseUID } = req.body;
        if (!location || !firebaseUID || firebaseUID.toLowerCase().startsWith("empty")) {
            return res.status(400).json({ message: 'Location and Firebase UID are required.' });
        }

        // Get the location document reference and set return message
        const locationRef = admin.firestore().collection('locations').doc(location);
        let responseMessage = "Session ended successfully and queue advanced.";
        
        // Start a transaction
        await admin.firestore().runTransaction(async (transaction) => {
            // Read the document once inside the transaction
            const locationSnapshot = await transaction.get(locationRef);
            if (!locationSnapshot.exists) {
                throw new Error('Location not found.');
            }

            // Use the end session function to process the data
            const locationData = locationSnapshot.data();
            const result = await endSession(locationData, firebaseUID);
            if (result === 204) {
                responseMessage = "FirebaseUID was not found. Aborting /endSession.";
                return;
            }

            // Call advanceQueue to move the queue forward
            await advanceQueue(locationData);

            // Write the updated data back to Firestore in the transaction
            transaction.update(locationRef, {
                activeFirebaseUIDs: locationData.activeFirebaseUIDs,
                activeNicknames: locationData.activeNicknames,
                activeStartTimes: locationData.activeStartTimes,
                activeWaitingPlayers: locationData.activeWaitingPlayers,
                queueFirebaseUIDs: locationData.queueFirebaseUIDs,
                queueNicknames: locationData.queueNicknames
            });
        });
  
        res.status(200).json({ message: responseMessage });
    } catch (error) {
        console.error('Error ending session:', error);
        res.status(500).json({ error: error.message || 'Failed to end session.' });
    }
});

module.exports = router;
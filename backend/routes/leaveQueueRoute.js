const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const leaveQueue = require('../utils/leaveQueue');  // Import the leave queue utility

// Leave Queue Endpoint
router.post('/leaveQueue', async (req, res) => {
    try {
        // Extract location and firebaseUID from the request body
        const { location, firebaseUID } = req.body;
        if (!location || !firebaseUID) {
            return res.status(400).json({ message: 'Location and Firebase UID are required.' });
        }

        // Get the location document reference and set return message
        const locationRef = admin.firestore().collection('locations').doc(location);
        let responseMessage = "Successfully removed from queue.";

        // Start a transaction
        await admin.firestore().runTransaction(async (transaction) => {
            // Read the document once inside the transaction
            const locationSnapshot = await transaction.get(locationRef);
            if (!locationSnapshot.exists) {
                throw new Error('Location not found.');
            }

            // Use the leaveQueue function to update the data
            const locationData = locationSnapshot.data();
            const result = await leaveQueue(locationData, firebaseUID);
            if (result === 204) {
                responseMessage = "FirebaseUID was not found. Aborting /leaveQueue.";
                return;
            }

            // Write the updated data back to Firestore in the transaction
            transaction.update(locationRef, {
                queueFirebaseUIDs: locationData.queueFirebaseUIDs,
                queueNicknames: locationData.queueNicknames,
                queueJoinTimes: locationData.queueJoinTimes,
                queueTokens: locationData.queueTokens,
                activeNicknames: locationData.activeNicknames,
                activeWaitingPlayers: locationData.activeWaitingPlayers
            });
        });

        res.status(200).json({ message: responseMessage });
    } catch (error) {
        console.error('Error removing player from queue:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
});

module.exports = router;
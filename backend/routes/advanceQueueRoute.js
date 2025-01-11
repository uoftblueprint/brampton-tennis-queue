const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const advanceQueue = require('../utils/advanceQueue');  // Import the advance queue utility

router.post('/advanceQueue', async (req, res) => {
    try {
        // Get location from request body and validate
        const location = req.body.location;
        if (!location) {
            return res.status(400).json({ message: "Location is required." });
        }
        
        // Get reference to location document and set return message
        const db = admin.firestore();
        const locationRef = db.collection('locations').doc(location);
        let responseMessage = "Queue advanced successfully.";

        // Start transaction to update location data
        await db.runTransaction(async (transaction) => {
            // Read document once
            const locationSnapshot = await transaction.get(locationRef);
            if (!locationSnapshot.exists) {
                throw new Error('Location not found.');
            }

            // Call advanceQueue function to move queue forward
            const locationData = locationSnapshot.data();
            const result = await advanceQueue(locationData);
            if (result === 204) {
                responseMessage = "Courts occupied or queue is empty. Aborting /advanceQueue.";
                return;
            }

            // Update location data to Firestore in transaction
            transaction.update(locationRef, {
                activeFirebaseUIDs: locationData.activeFirebaseUIDs,
                activeNicknames: locationData.activeNicknames,
                activeStartTimes: locationData.activeStartTimes,
                activeWaitingPlayers: locationData.activeWaitingPlayers,
                queueFirebaseUIDs: locationData.queueFirebaseUIDs,
                queueNicknames: locationData.queueNicknames,
                queueJoinTimes: locationData.queueJoinTimes
            });
        });

        res.status(200).json({ message: responseMessage });
    } catch (error) {
        // If an error occurs, send an error message.
        console.error("Failed to advance queue: ", error);
        res.status(500).json({ error: error.message || "Failed to advance queue." });
    }
});

module.exports = router;
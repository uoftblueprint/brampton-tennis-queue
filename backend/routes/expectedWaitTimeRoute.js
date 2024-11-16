const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

// Expected wait time endpoint
router.post('/expectedWaitTime', async (req, res) => {
    try {
        // Get the location from the request body and validate
        const location = req.body.location;
        if (!location) {
            return res.status(400).json({ message: "Location is required" });
        }

        // Get the location document snapshot
        const locationRef = admin.firestore().collection('locations').doc(location);
        const locationSnapshot = await locationRef.get();
        if (!locationSnapshot.exists) {
            return res.status(404).json({ message: 'Location not found.' });
        }

        // Access document data and compute wait time by estimating 0.5 hour per player
        const locationData = locationSnapshot.data();
        const queuePlayersCount = locationData.queueFirebaseUIDs.length;
        const expectedWaitTime = queuePlayersCount * 0.5;

        // Send response back with the expected wait time.
        res.status(200).json({ expectedWaitTime: expectedWaitTime });
        
    } catch (error) {
        // If an error occurs, send an error message.
        console.error("Failed to get expected wait time: ", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
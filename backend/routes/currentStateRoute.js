const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

// Current State Endpoint
router.post('/currentState', async (req, res) => {
    try {
        // Extract location from the request body
        const { location } = req.body;
        if (!location) {
          return res.status(400).json({ message: 'Location is required.' });
        }

        // Get the location document snapshot
        const locationRef = admin.firestore().collection('locations').doc(location);
        const locationSnapshot = await locationRef.get();
        if (!locationSnapshot.exists) {
            return res.status(404).json({ message: 'Location not found.' });
        }

        // Access relevant arrays
        const locationData = locationSnapshot.data();
        const { queueFirebaseUIDs, queueNicknames, activeFirebaseUIDs, activeNicknames } = locationData;

        // Send response back to client with updated player arrays
        res.status(200).json({
          activeNicknames: activeNicknames,
          queueNicknames: queueNicknames,
          activeFirebaseUIDs: activeFirebaseUIDs,
          queueFirebaseUIDs: queueFirebaseUIDs
        });


    } catch (error) {
        console.error('Error in currentState endpoint: ', error);
        res.status(500).send({ error: 'Failed to retrieve current state.' });
    }
});

module.exports = router;
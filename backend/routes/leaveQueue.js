const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

// Leave Queue Endpoint
router.post('/leaveQueue', async (req, res) => {
    try {
        // Extract location and firebaseUID from the request body
        const { location, firebaseUID } = req.body;
        if (!location || !firebaseUID) {
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
        const { queueFirebaseUIDs, queueNicknames } = locationData;

        // Check whether player exists
        const playerIndex = queueFirebaseUIDs.indexOf(firebaseUID);
        if (playerIndex === -1) {
            return res.status(404).json({ message: 'FirebaseUID not found.' });
        }

        // Update the relevant fields
        queueFirebaseUIDs.splice(playerIndex, 1);
        queueNicknames.splice(playerIndex, 1);

        // Write new data to Firestore
        await locationRef.update({
            queueFirebaseUIDs: queueFirebaseUIDs,
            queueNicknames: queueNicknames,
        });

        res.status(200).json({ message: 'Successfully removed from queue.' });
    } catch (error) {
        console.error('Error removing player from queue:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
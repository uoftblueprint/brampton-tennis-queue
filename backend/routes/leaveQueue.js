const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

// Leave Queue Endpoint
router.post('/leaveQueue', async (req, res) => {
    try {
        const { location, firebaseUID } = req.body;

        // Validate input
        if (!location || !firebaseUID) {
            return res.status(400).json({ message: 'Location and Firebase UID are required.' });
        }

        // Reference to the player's document in the queue collection
        const queueRef = admin.firestore()
            .collection('locations')
            .doc(location)
            .collection('queuePlayers')
            .where('firebaseUID', '==', firebaseUID);

        // Fetch and delete the player from the queue
        const snapshot = await queueRef.get();
        if (snapshot.empty) {
            return res.status(404).json({ message: 'Player not found in the queue.' });
        }

        // Delete each matching document (should be one)
        snapshot.forEach(async doc => {
            await doc.ref.delete();
        });

        res.status(200).json({ message: 'Successfully removed from queue.' });
    } catch (error) {
        console.error('Error removing player from queue:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

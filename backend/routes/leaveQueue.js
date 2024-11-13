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

        // Find queue player with given firebaseUID
        const queuePlayerSnapshot = await admin.firestore()
            .collection('locations')
            .doc(location)
            .collection('queuePlayers')
            .where('firebaseUID', '==', firebaseUID)
            .limit(1)
            .get();

        // Check for empty snapshot
        if (queuePlayerSnapshot.empty) {
            return res.status(404).json({ message: 'Player or location not found.' });
        }

        // Delete the queue player document
        const queuePlayerDoc = queuePlayerSnapshot.docs[0];
        await queuePlayerDoc.ref.delete();

        res.status(200).json({ message: 'Successfully removed from queue.' });
    } catch (error) {
        console.error('Error removing player from queue:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
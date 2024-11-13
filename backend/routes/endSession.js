const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
// const advanceQueue = require('./advanceQueue'); // Import advanceQueue function

// End Session Endpoint
router.post('/endSession', async (req, res) => {
    try {
        // Extract location and firebaseUID from the request body
        const { location, firebaseUID } = req.body;
        if (!location || !firebaseUID || firebaseUID.toLowerCase().startsWith("empty")) {
            return res.status(400).json({ message: 'Location and Firebase UID are required.' });
        }

        // Find active player with given firebaseUID
        const activePlayerSnapshot = await admin.firestore()
            .collection('locations')
            .doc(location)
            .collection('activePlayers')
            .where('firebaseUID', '==', firebaseUID)
            .limit(1)
            .get();

        // Check for empty snapshot
        if (activePlayerSnapshot.empty) {
            return res.status(404).json({ message: 'Player or location not found.' });
        }
    
        // Reset the properties of the active player document
        const activePlayerDoc = activePlayerSnapshot.docs[0];
        const courtNumber = parseInt(activePlayerDoc.id.replace("Court", ""));
        const newName = "Empty" + courtNumber.toString();
        await activePlayerDoc.ref.set(
            {
                playerWaiting: false,
                firebaseUID: newName,
                nickname: newName,
            },
            { merge: true }
        );
  
        // Call the advanceQueue endpoint to move the queue forward
        // await advanceQueue(location);
  
        res.status(200).json({ message: 'Session ended successfully and queue advanced.' });
    } catch (error) {
        console.error('Error ending session:', error);
        res.status(500).json({ error: 'Failed to end session.' });
    }
});
  
module.exports = router;
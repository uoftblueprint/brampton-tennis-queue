const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
// const advanceQueue = require('./advanceQueue'); // Import advanceQueue function

// End Session Endpoint
router.post('/endSession', async (req, res) => {
    try {
        // Extract location and user UID from the request body
        const { location, uid } = req.body
        if (!location || !uid) {
            return res.status(400).json({ message: 'Location and UID are required.' });
        }

        // Check if the location document exists
        const locationDoc = await admin.firestore()
        .collection('locations')
        .doc(location)
        .get();

        if (!locationDoc.exists) {
        return res.status(404).json({ message: 'Location not found.' });
        }
    
        // Locate and delete the user from the active players collection
        const activePlayersRef = admin.firestore()
            .collection('locations')
            .doc(location)
            .collection('activePlayers');
    
        const activePlayerSnapshot = await activePlayersRef
            .where('firebaseUID', '==', uid)
            .limit(1)
            .get();
    
        if (activePlayerSnapshot.empty) {
            return res.status(404).json({ message: 'Player not found in active players.' });
        }
    
        // Delete the player from active players
        const activePlayerDoc = activePlayerSnapshot.docs[0];
        await activePlayersRef.doc(activePlayerDoc.id).delete();
  
        // Call the advanceQueue endpoint to move the queue forward
        // await advanceQueue(location);
  
        res.status(200).json({ message: 'Session ended successfully and queue advanced.' });
    } catch (error) {
        console.error('Error ending session:', error);
        res.status(500).json({ error: 'Failed to end session.' });
    }
});
  
module.exports = router;
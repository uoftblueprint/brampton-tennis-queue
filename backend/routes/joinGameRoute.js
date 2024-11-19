const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

// DUMMY - Join Game Endpoint
/* ONLY FOR TESTING PURPOSES DO NOT USE! 
Wrong becase:
- Only adds to queue
- Does NOT use modular style
- Does NOT use transaction
- Does NOT add to active and set start time and player waiting false for active
- Does NOT check MAX BOUND of 5 queue size
*/
router.post('/joinGame', async (req, res) => {
    try {
        // Extract location, nickname and firebaseUID from the request body
        const { location, nickname, firebaseUID } = req.body;
        if (!location || !firebaseUID || firebaseUID.toLowerCase().startsWith("empty")) {
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

        // Add player to end of queue
        queueFirebaseUIDs.push(firebaseUID);
        queueNicknames.push(nickname);

        // Write new data to Firestore
        await locationRef.update({
            queueFirebaseUIDs: queueFirebaseUIDs,
            queueNicknames: queueNicknames,
        });
  
        res.status(200).json({ status: 'queue' });
    } catch (error) {
        console.error('Error joining game:', error);
        res.status(500).json({ error: 'Failed to join game.' });
    }
});
  
module.exports = router;
const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

// Join Queue Endpoint
router.post('/joinQueue', async (req, res) => {
    try {
        const { location, firebaseUID, nickname } = req.body;

        // Validate input
        if (!location || !firebaseUID || !nickname) {
            return res.status(400).json({ message: 'Location, UID, and nickname are required.' });
        }

        const db = admin.firestore();
        const activePlayersRef = db.collection('locations').doc(location).collection('activePlayers');
        const queuePlayersRef = db.collection('locations').doc(location).collection('queuePlayers');

        // Check for an empty court
        const activePlayersSnapshot = await activePlayersRef.get();
        let emptyCourtFound = false;

        for (let doc of activePlayersSnapshot.docs) {
            const player = doc.data();
            if (player.nickname.startsWith("Empty")) {
                // Assign this empty court to the new player
                await doc.ref.update({
                    firebaseUID,
                    nickname,
                    timeStartedPlay: admin.firestore.FieldValue.serverTimestamp(),
                    playerWaiting: false // Set to false as this player is now active
                });
                emptyCourtFound = true;
                break;
            }
        }

        if (!emptyCourtFound) {
            // All courts are occupied, add player to queue
            await queuePlayersRef.add({
                firebaseUID,
                nickname,
                locationName: location,
                timeJoinedQueue: admin.firestore.FieldValue.serverTimestamp()
            });
        }

        // await dynamicBuffer(location); // Replace with actual call when dynamicBuffer API is implemented

        res.status(201).json({ message: emptyCourtFound ? 'Player added to active list.' : 'Player added to queue.' });
    } catch (error) {
        console.error('Error in joinQueue endpoint:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

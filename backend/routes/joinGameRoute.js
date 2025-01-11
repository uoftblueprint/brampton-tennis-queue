const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const joinGame = require('../utils/joinGame'); // Import the joinGame utility
const dynamicBuffer = require('../utils/dynamicBuffer'); // Import dynamicBuffer utility

router.post('/joinGame', async (req, res) => {
    try {
        const { location, firebaseUID, nickname } = req.body;

        if (!location || !firebaseUID || !nickname || firebaseUID.toLowerCase().startsWith('empty')) {
            return res.status(400).json({ message: 'Location, UID, and nickname are required.' });
        }

        // Access relevant arrays
        const locationData = locationSnapshot.data();
        const { queueFirebaseUIDs, queueNicknames, queueJoinTimes} = locationData;

        // Add player to end of queue
        queueFirebaseUIDs.push(firebaseUID);
        queueNicknames.push(nickname);
        // Add timestamp for join time to queueJoinTimes array of thi format 2024-11-19T12:30:00Z
        queueJoinTimes.push(new Date());

        // Write new data to Firestore
        await locationRef.update({
            queueFirebaseUIDs: queueFirebaseUIDs,
            queueNicknames: queueNicknames,
            queueJoinTimes: queueJoinTimes,
        });

        if (success) {
            await dynamicBuffer(location); // Call dynamicBuffer after transaction
        }

        res.status(200).json({ success, message: responseMessage });
    } catch (error) {
        console.error('Error joining game:', error);
        res.status(500).json({ success: false, message: 'Failed to join game.', error: error.message });
    }
});

module.exports = router;
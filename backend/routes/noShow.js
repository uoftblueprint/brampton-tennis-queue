const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const axios = require('axios'); // To call the endSession endpoint

// No-Show Endpoint
router.post('/noShow', async (req, res) => {
    try {
        const { location } = req.body;

        if (!location) {
            return res.status(400).json({ message: 'Location is required.' });
        }

        // Find the active player with the most recent start time
        const activePlayersRef = admin.firestore()
            .collection('locations')
            .doc(location)
            .collection('activePlayers');

        // Order by 'startTime' descending to get the most recent player at the top
        const activePlayerSnapshot = await activePlayersRef
            .orderBy('startTime', 'desc')
            .limit(1)
            .get();

        if (activePlayerSnapshot.empty) {
            return res.status(404).json({ message: 'No active players found.' });
        }

        // Get the UID of the most recent active player
        const mostRecentPlayer = activePlayerSnapshot.docs[0].data();
        const uid = mostRecentPlayer.firebaseUID;

        // Call the /endSession endpoint for the most recent player
        await axios.post('http://localhost:5001/api/endSession', { location, uid });

        res.status(200).json({ message: 'No-show handled and moved to the next in line.' });
    } catch (error) {
        console.error('Error handling no-show:', error);
        res.status(500).json({ message: 'An error occurred while handling no-show.' });
    }
});

module.exports = router;

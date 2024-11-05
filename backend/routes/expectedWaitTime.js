const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

// Expected wait time endpoint
router.post('/expectedWaitTime', async (req, res) => {
    try {
        // Get the location from the request body.
        const location = req.body.location

        // Use Firestore's count aggregation to get the number of players in the queue
        const queuePlayersCount = await admin.firestore()
            .collection('locations')
            .doc(location)
            .collection('queuePlayers')
            .count()
            .get()
            .then(snapshot => snapshot.data().count);

        // Calculate the expected wait time by estimating 30 minutes per player.
        const expectedWaitTime = queuePlayersCount * 30;

        // Send response back with the expected wait time.
        res.status(200).send({ expectedWaitTime: expectedWaitTime });

    } catch (error) {
        // If an error occurs, send an error message.
        console.error("Failed to get expected wait time: ", error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

// Get Taken Courts Endpoint
router.post('/getTaken', async (req, res) => {
  try {
    // Extract location from the request body
    // if location is not provided, return 400 status code with message
    const { location } = req.body;
    if (!location) {
      return res.status(400).json({ message: 'Location is required.' });
    }

    // Retrieve active player information for the given location and store it in activePlayersSnapshot
    const activePlayersSnapshot = await admin.firestore()
      .collection('locations')
      .doc(location)
      .collection('activePlayers')
      .get();

    // Check for empty active player snapshot
    if (activePlayersSnapshot.empty) {
      return res.status(404).json({ message: 'Invalid location.' });
    }

    // Check for a queue in the location and store it in queueSnapshot
    const queueSnapshot = await admin.firestore()
      .collection('locations')
      .doc(location)
      .collection('queuePlayers')
      .get();

    // If there are entries in the queue, no update is required, return 200 status code with updateRequired as false
    if (!queueSnapshot.empty) {
      return res.status(200).json({
        updateRequired: false
      });
    }

    // Otherwise, return court information where firebaseUID doesn't start with 'Empty'
    const takenCourts = [];
    let numberOfCourts = 0;

    activePlayersSnapshot.forEach(doc => {
      const firebaseUID = doc.data().firebaseUID;
      const courtNumber = doc.data().courtNumber;

      if (!firebaseUID.startsWith('Empty')) {
        takenCourts.push(courtNumber);
        numberOfCourts++;
      }
    });

    return res.status(200).json({
      takenCourts: takenCourts,
      numberOfCourts: numberOfCourts,
      updateRequired: true
    });

  } catch (error) {
    console.error('Error in getTaken endpoint: ', error);
    res.status(500).send({ error: 'Failed to get taken courts.' });
  }
});

module.exports = router;

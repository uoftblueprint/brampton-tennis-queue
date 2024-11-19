const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

// Get Taken Courts Endpoint
router.post('/getTaken', async (req, res) => {
  try {
    // Get the location from the request body and validate
    const location = req.body.location;
    if (!location) {
        return res.status(400).json({ message: "Location is required" });
    }

    // Get the location document snapshot
    const locationRef = admin.firestore().collection('locations').doc(location);
    const locationSnapshot = await locationRef.get();

    // Check if location document exists
    if (!locationSnapshot.exists) {
        return res.status(404).json({ message: 'Location not found.' });
    }

    // Access document data and get active and queue players
    const locationData = locationSnapshot.data();

    // Get active players from the location data
    const activePlayers = locationData.activeFirebaseUIDs;
    console.log(activePlayers);

    // Get queue players from the location data
    const queuePlayers = locationData.queueFirebaseUIDs;
    console.log(queuePlayers);
    console.log(queuePlayers.length);

    // If there are entries in the queue, no update is required, return 200 status code with updateRequired as false
    if (queuePlayers.length > 0) {
      return res.status(200).json({
        updateRequired: false
      });
    }

    // Otherwise, return court information where firebaseUID doesn't start with 'Empty'
    const takenCourts = [];
    let numberOfCourts = 0;

    // Iterate through active players to find the taken courts, and increment the number of courts
    activePlayers.forEach((player) => {
      if (!player.startsWith('Empty')) {
        takenCourts.push(activePlayers.indexOf(player) + 1);
        numberOfCourts++;
      }
    });

    // Return the taken courts and the number of courts, along with updateRequired as true
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
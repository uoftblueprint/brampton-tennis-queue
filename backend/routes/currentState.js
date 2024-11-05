const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

// Current State Endpoint
router.post('/currentState', async (req, res) => {
  try {
    // Extract location and last check time from the request body
    const { location, lastCheckTime } = req.body;
    if (!location) {
      return res.status(400).json({ message: 'Location is required.' });
    }

    // Check whether the user provided a last check timestamp
    if (lastCheckTime) {
      // Retrieve the last update time for the given location
      const locationSnapshot = await admin.firestore()
        .collection('locations')
        .doc(location)
        .get();

      // Check if location data exists
      if (!locationSnapshot.exists) {
        return res.status(404).json({ message: 'Invalid location.' });
      }
      const lastUpdateTime = locationSnapshot.data().lastUpdateTime.toMillis();

      // Compare user's last check time against the location's last update time
      if (lastUpdateTime && lastUpdateTime <= lastCheckTime) {
        return res.status(200).json({
          updateRequired: false
        });
      }
    }

    // Retrieve active player information for the given location
    const activePlayersSnapshot = await admin.firestore()
      .collection('locations')
      .doc(location)
      .collection('activePlayers')
      .orderBy('courtNumber')
      .select('nickname')
      .get();

    // Retrieve queue player information for the given location
    const queuePlayersSnapshot = await admin.firestore()
      .collection('locations')
      .doc(location)
      .collection('queuePlayers')
      .orderBy('timeJoinedQueue')
      .select('nickname')
      .get();

    // Check for empty active player snapshot (as always filled with Empty/Unknown/Player objects)
    if (activePlayersSnapshot.empty) {
      return res.status(404).json({ message: 'Invalid location.' });
    }

    // Convert snapshots to arrays
    const activePlayers = activePlayersSnapshot.docs.map(doc => doc.data().nickname);
    const queuePlayers = queuePlayersSnapshot.docs.map(doc => doc.data().nickname);

    // Send response back to client with updated player arrays
    res.status(200).json({
      updateRequired: true,
      activePlayers: activePlayers,
      queuePlayers: queuePlayers
    });

  } catch (error) {
    console.error('Error in currentState endpoint: ', error);
    res.status(500).send({ error: 'Failed to retrieve current state.' });
  }
});

module.exports = router;
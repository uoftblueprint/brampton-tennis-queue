const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

// Current State Endpoint
router.post('/currentState', async (req, res) => {
  try {
    // Extract location from the request body
    const location = req.body.location;
    if (!location) {
      return res.status(400).json({ message: 'Location is required.' });
    }

    // Retrieve active player information for given location
    const activePlayersSnapshot = await admin.firestore()
      .collection('locations')
      .doc(location)
      .collection('activePlayers')
      .orderBy('courtNumber')
      .select('nickname')
      .get();

    // Retrieve queue player information for given location
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
    activePlayers = activePlayersSnapshot.docs.map(doc => doc.data().nickname);
    queuePlayers = queuePlayersSnapshot.docs.map(doc => doc.data().nickname);

    // Send response back to client with both arrays
    res.status(200).json({
      activePlayers: activePlayers,
      queuePlayers: queuePlayers
    });

  } catch (error) {
    res.status(500).send({ error: 'Failed to retrieve current state.' });
  }
});

module.exports = router;
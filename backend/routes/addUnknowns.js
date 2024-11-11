const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

// Add Unknowns Endpoint
router.post('/addUnknowns', async (req, res) => {
  try {
    // Extract location and occupied courts from the request body
    const { location, occupiedCourts } = req.body;
    if (!location || !Array.isArray(occupiedCourts)) {
      return res.status(400).json({ message: 'Location and occupied court information is required.' });
    }

    // Retrieve active court information for the given location
    const activePlayersSnapshot = await admin.firestore()
      .collection('locations')
      .doc(location)
      .collection('activePlayers')
      .orderBy('courtNumber')
      .get();

    // Check for empty active player snapshot (as always filled with Empty/Unknown/Player objects)
    if (activePlayersSnapshot.empty) {
      return res.status(404).json({ message: 'Invalid location.' });
    }

    // Creating shuffled timestamp adjustments
    const now = new Date();
    const adjustments = [-40, -30, -20, -10, 0];
    const timestamps = adjustments.map(seconds => {
      const adjustedTime = new Date(now);
      adjustedTime.setSeconds(now.getSeconds() + seconds);
      return adjustedTime;
    });
    shuffleArray(timestamps);
    let lastTimestampIdx = 0;

    // Update each document based on user information
    const batch = admin.firestore().batch();
    activePlayersSnapshot.docs.forEach(doc => {
      const courtNumber = doc.data().courtNumber;
      const isOccupied = occupiedCourts.includes(courtNumber);
      const isEmptyCourt = doc.data().firebaseUID.startsWith('Empty');

      // If court is occupied, check if it's shown as empty
      if (isOccupied) {
        if (isEmptyCourt) {
          const newName = `Unknown${courtNumber}`;
          const timestamp = timestamps[lastTimestampIdx];
          lastTimestampIdx += 1;

          const updateObj = {
            playerWaiting: false,
            firebaseUID: newName,
            nickname: newName,
            timeStartedPlay: timestamp,
          };

          batch.set(doc.ref, updateObj, { merge: true });
        }

      // If court is empty, check if it's shown as occupied
      } else {
        if (!isEmptyCourt) {
          const newName = `Empty${courtNumber}`;

          const updateObj = {
            playerWaiting: false,
            firebaseUID: newName,
            nickname: newName,
          };

          batch.set(doc.ref, updateObj, { merge: true });
        }
      }
    });

    // Commit batch and send success response to client
    await batch.commit();
    res.status(200).send({ success: 'Updated court information.' });

  } catch (error) {
    console.error('Error in addUnknowns endpoint: ', error);
    res.status(500).send({ error: 'Failed to add unknowns.' });
  }
});

// Creating shuffle function
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));  // Random index
    [array[i], array[j]] = [array[j], array[i]];  // Swap elements
  }
};

module.exports = router;
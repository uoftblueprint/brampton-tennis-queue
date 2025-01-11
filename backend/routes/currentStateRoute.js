const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

// Current State Endpoint
router.post('/currentState', async (req, res) => {
    try {
        // Extract location from the request body
        const { location } = req.body;
        if (!location) {
          return res.status(400).json({ message: 'Location is required.' });
        }

        // Get the location document snapshot
        const locationRef = admin.firestore().collection('locations').doc(location);
        const locationSnapshot = await locationRef.get();
        if (!locationSnapshot.exists) {
            return res.status(404).json({ message: 'Location not found.' });
        }

        // Access relevant arrays
        const locationData = locationSnapshot.data();
        const { queueFirebaseUIDs, queueNicknames, activeFirebaseUIDs, activeNicknames, queueJoinTimes} = locationData;

        // Format join times to a readable format
        const formattedQueueJoinTimes = queueJoinTimes.map(time => {
          if (time instanceof admin.firestore.Timestamp) {
              return time.toDate().toLocaleString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric', 
                  hour: '2-digit', 
                  minute: '2-digit', 
                  hour12: true 
              });
          }
          return time; // Fallback for non-Timestamp values
        });

        // Send response back to client with updated player arrays
        res.status(200).json({
          activeNicknames: activeNicknames,
          queueNicknames: queueNicknames,
          activeFirebaseUIDs: activeFirebaseUIDs,
          queueFirebaseUIDs: queueFirebaseUIDs,
          queueJoinTimes: formattedQueueJoinTimes
        });


    } catch (error) {
        console.error('Error in currentState endpoint: ', error);
        res.status(500).send({ error: 'Failed to retrieve current state.' });
    }
});

module.exports = router;
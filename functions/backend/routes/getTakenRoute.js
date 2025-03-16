const { onRequest } = require("firebase-functions/v2/https");
const admin = require('firebase-admin');

// Get Taken Courts Endpoint
const getTakenRoute = onRequest(async (req, res) => {
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

    // Access document data, get active / queue players and number of courts
    const locationData = locationSnapshot.data();
    const activePlayers = locationData.activeFirebaseUIDs;
    const queuePlayers = locationData.queueFirebaseUIDs;
    const numberOfCourts = locationData.numberOfCourts;

    // If there are entries in the queue, no update is required, return 200 status code with updateRequired as false
    if (queuePlayers.length > 0) {
      return res.status(200).json({
        updateRequired: false
      });
    }

    // Else, iterate through active firebaseUIDs to store occupied court numbers where the id does not start with 'Empty'
    const takenCourts = [];
    activePlayers.forEach((player) => {
      if (!player.startsWith('Empty')) {
        takenCourts.push(activePlayers.indexOf(player) + 1);
      }
    });

    // Return the taken courts and the total number of courts, along with updateRequired as true
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

module.exports = getTakenRoute;
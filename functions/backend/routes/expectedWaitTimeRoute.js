const { onRequest } = require("firebase-functions/v2/https");
const admin = require('firebase-admin');
const cors = require("cors")({ origin: ['https://brampton-tennis-queue.web.app'] });

// Expected wait time endpoint
const expectedWaitTimeRoute = onRequest(async (req, res) => {
    cors(req, res, async () => {
        try {
            // Get the location from the request body and validate
            const location = req.body.location;
            if (!location) {
                return res.status(400).json({ message: "Location is required" });
            }

            // Get the location document snapshot
            const locationRef = admin.firestore().collection('locations').doc(location);
            const locationSnapshot = await locationRef.get();
            if (!locationSnapshot.exists) {
                return res.status(404).json({ message: 'Location not found.' });
            }

            // Access document data and compute wait time by estimating 0.5 hour per player
            const locationData = locationSnapshot.data();
            const queueNicknames = locationData.queueNicknames;
            const queuePlayersCount = locationData.queueFirebaseUIDs.length;
            const allCourtsFull = locationData.activeFirebaseUIDs.every(uid => !uid.startsWith('Empty'));
            const expectedWaitTime = queuePlayersCount * 0.5;

            // Send response back with the expected wait time.
            res.status(200).json({ 
                expectedWaitTime: expectedWaitTime, 
                queueNicknames: queueNicknames, 
                allCourtsFull: allCourtsFull 
            });
            
        } catch (error) {
            // If an error occurs, send an error message.
            console.error("Failed to get expected wait time: ", error);
            res.status(500).json({ message: "Server error" });
        }
    });
});

module.exports = expectedWaitTimeRoute;
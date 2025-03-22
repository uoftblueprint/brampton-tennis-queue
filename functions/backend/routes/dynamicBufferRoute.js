const { onRequest } = require("firebase-functions/v2/https");
const admin = require('firebase-admin');
const dynamicBuffer = require('../utils/dynamicBuffer');  // Import the dynamic buffer utility
const cors = require("cors")({ origin: ['https://brampton-tennis-queue.web.app'] });

// Dynamic Buffer Endpoint
const dynamicBufferRoute = onRequest(async (req, res) => {
    cors(req, res, async () => {
        try {
            // Extract location from the request body
            const { location } = req.body;
            if (!location) {
                return res.status(400).json({ message: 'Location is required.' });
            }

            // Get the location document reference
            const locationRef = admin.firestore().collection('locations').doc(location);

            // Start a transaction
            await admin.firestore().runTransaction(async (transaction) => {
                // Read the document once inside the transaction
                const locationSnapshot = await transaction.get(locationRef);
                if (!locationSnapshot.exists) {
                    throw new Error('Location not found.');
                }

                // Use the dynamicBuffer function to calculate remaining time played
                const locationData = locationSnapshot.data();
                await dynamicBuffer(locationData);

                // Update location data to Firestore in transaction
                transaction.update(locationRef, {
                    activeFirebaseUIDs: locationData.activeFirebaseUIDs,
                    activeNicknames: locationData.activeNicknames,
                    activeStartTimes: locationData.activeStartTimes,
                    activeWaitingPlayers: locationData.activeWaitingPlayers,
                    queueFirebaseUIDs: locationData.queueFirebaseUIDs,
                    queueNicknames: locationData.queueNicknames,
                    queueJoinTimes: locationData.queueJoinTimes
                });
            });

            res.status(200).json({ message: 'Successfully calculated remaining time played.' });
        } catch (error) {
            console.error('Error calculating time:', error);
            res.status(500).json({ message: error.message || 'Server error' });
        }
    });
});

module.exports = dynamicBufferRoute;
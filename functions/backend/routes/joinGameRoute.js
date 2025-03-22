const { onRequest } = require("firebase-functions/v2/https");
const admin = require('firebase-admin');
const joinGame = require('../utils/joinGame');  // Import the joinGame utility
const dynamicBuffer = require('../utils/dynamicBuffer');  // Import dynamicBuffer utility
const cors = require("cors")({ origin: ['https://brampton-tennis-queue.web.app'] });

const joinGameRoute = onRequest(async (req, res) => {
    cors(req, res, async () => {
        try {
            const { location, firebaseUID, nickname, fcmToken } = req.body;

            if (!location || !firebaseUID || !nickname || firebaseUID.toLowerCase().startsWith('empty')) {
                return res.status(400).json({ message: 'Location, UID, and nickname are required.' });
            }

            const db = admin.firestore();
            const locationRef = db.collection('locations').doc(location);

            let responseMessage;
            let success = true;

            await db.runTransaction(async (transaction) => {
                const locationSnapshot = await transaction.get(locationRef);
                if (!locationSnapshot.exists) {
                    throw new Error('Location not found.');
                }

                const locationData = locationSnapshot.data();

                // Call the joinGame utility to process locationData
                const result = await joinGame(locationData, firebaseUID, nickname, fcmToken);
                success = result.success;
                responseMessage = result.message;

                if (!success) return; // Abort transaction if queue is full

                // Write the updated locationData back to Firestore
                transaction.update(locationRef, {
                    activeFirebaseUIDs: locationData.activeFirebaseUIDs,
                    activeNicknames: locationData.activeNicknames,
                    activeStartTimes: locationData.activeStartTimes,
                    activeWaitingPlayers: locationData.activeWaitingPlayers,
                    activeTokens: locationData.activeTokens,
                    queueFirebaseUIDs: locationData.queueFirebaseUIDs,
                    queueJoinTimes: locationData.queueJoinTimes,
                    queueNicknames: locationData.queueNicknames,
                    queueTokens: locationData.queueTokens,
                });
                
                if (success) {
                    await dynamicBuffer(locationData); // Call dynamicBuffer after transaction
                }
            });

            res.status(200).json({ success, message: responseMessage });
        } catch (error) {
            console.error('Error joining game:', error);
            res.status(500).json({ success: false, message: 'Failed to join game.', error: error.message });
        }
    });
});

module.exports = joinGameRoute;
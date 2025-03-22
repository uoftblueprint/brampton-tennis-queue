const { onRequest } = require("firebase-functions/v2/https");
const admin = require('firebase-admin');
const addUnknowns = require('../utils/addUnknowns');  // Import the add unknowns utility
const cors = require("cors")({ origin: ['https://brampton-tennis-queue.web.app'] });

// Add Unknowns Endpoint
const addUnknownsRoute = onRequest(async (req, res) => {
    cors(req, res, async () => {
        try {
            // Extract location and occupied courts from the request body
            const { location, occupiedCourts } = req.body;
            if (!location || !Array.isArray(occupiedCourts) || !occupiedCourts.every(court => typeof court === 'number')) {
                return res.status(400).json({ message: 'Location and array of court numbers are required.' });
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

                // Use the add unknowns function to update the data
                const locationData = locationSnapshot.data();
                await addUnknowns(locationData, occupiedCourts);

                // Write the updated data back to Firestore in the transaction
                transaction.update(locationRef, {
                    activeFirebaseUIDs: locationData.activeFirebaseUIDs,
                    activeNicknames: locationData.activeNicknames,
                    activeWaitingPlayers: locationData.activeWaitingPlayers,
                    activeStartTimes: locationData.activeStartTimes,
                    activeTokens: locationData.activeTokens,
                });
            });
    
            res.status(200).json({ success: 'Updated court information.' });
        } catch (error) {
            console.error('Error in addUnknowns endpoint: ', error);
            res.status(500).send({ error: error.message || 'Failed to add unknowns.' });
        }
    });
});

module.exports = addUnknownsRoute;
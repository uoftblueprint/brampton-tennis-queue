const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const leaveQueue = require('../utils/leaveQueue');  // Import the leave queue utility

// Leave Queue Endpoint
router.post('/leaveQueue', async (req, res) => {
    try {
        // Extract location and firebaseUID from the request body
        const { location, firebaseUID } = req.body;
        if (!location || !firebaseUID) {
            return res.status(400).json({ message: 'Location and Firebase UID are required.' });
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

            // Use the leaveQueue function to update the data
            const locationData = locationSnapshot.data();
            await leaveQueue(locationData, firebaseUID);

            // Write the updated data back to Firestore in the transaction
            transaction.update(locationRef, {
                queueFirebaseUIDs: locationData.queueFirebaseUIDs,
                queueNicknames: locationData.queueNicknames,
            });
        });

        res.status(200).json({ message: 'Successfully removed from queue.' });
    } catch (error) {
        console.error('Error removing player from queue:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
});

module.exports = router;
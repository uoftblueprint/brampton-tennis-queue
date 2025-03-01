const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

// Send Web Notification endpoint
router.post('/sendWebNotification', async (req, res) => {
    try {
        // Validate required fields
        const { location, uid, message } = req.body;
        if (!location || !uid || !message || !message.title || !message.body) {
            return res.status(400).json({ message: "Location, UID, and message (with title and body) are required" });
        }

        // Get location document from Firestore
        const locationRef = admin.firestore().collection('locations').doc(location);
        const locationSnapshot = await locationRef.get();
        if (!locationSnapshot.exists) {
            return res.status(404).json({ message: 'Location not found.' });
        }
        const locationData = locationSnapshot.data();

        // Get the FCM token for the given UID
        let index = locationData.queueFirebaseUIDs.indexOf(uid);
        if (index === -1) {
            return res.status(404).json({ message: `User UID not found in location queue: ${uid}` });
        }
        let fcmToken = locationData.queueTokens[index];

        if (!fcmToken) {
            return res.status(404).json({ message: `FCM token not found for user: ${uid}` });
        }

        console.log(`Sending notification to token: ${fcmToken}`);

        // Build the notification payload with both notification & data
        const payload = {
            notification: {
            title: message.title,
            body: message.body,
            },
            data: {
            location,
            uid,
            },
            token: fcmToken,
        };

        // Send the notification
        const response = await admin.messaging().send(payload);
        console.log("Notification Response:", response);

        res.status(200).json({ message: "Notification sent successfully", response });

    } catch (error) {
        console.error("Failed to send notification: ", error);
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;

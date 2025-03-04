const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

/**
 * POST /sendWebNotification
 *
 * Sends a web push notification to a user (identified by `uid`) who might be
 * in a queue or an activePlayers list at a given location. The message includes
 * both `notification` and `data` fields for Firebase Cloud Messaging.
 */
router.post('/sendWebNotification', async (req, res) => {
  try {
    // 1) Extract relevant fields from request body
    const { location, uid, message } = req.body;

    // 2) Validate that required fields are present
    if (!location || !uid || !message || !message.title || !message.body) {
      return res.status(400).json({
        message: "Location, UID, and message (with title and body) are required",
      });
    }

    // 3) Retrieve the 'location' document from Firestore
    const locationRef = admin.firestore().collection('locations').doc(location);
    const locationSnapshot = await locationRef.get();

    // 4) Check if the location exists
    if (!locationSnapshot.exists) {
      return res.status(404).json({ message: 'Location not found.' });
    }

    // 5) Extract data from the location document
    const locationData = locationSnapshot.data();

    // 6) Try finding the UID in the 'queue' arrays first
    let index = locationData.queueFirebaseUIDs.indexOf(uid);
    let fcmToken = null;
    let userSource = 'queue'; // just for logging or reference

    if (index === -1) {
      // 6a) If not found in queue, try finding the UID in the 'active' arrays
      index = locationData.activeFirebaseUIDs.indexOf(uid);
      userSource = 'active';

      // 7a) If still not found, return an error
      if (index === -1) {
        return res.status(404).json({
          message: `User UID not found in queue or active players: ${uid}`
        });
      }

      // 8a) Retrieve the FCM token for active players
      fcmToken = locationData.activeTokens[index];
    } else {
      // 8) Retrieve the FCM token for queue players
      fcmToken = locationData.queueTokens[index];
    }

    // 9) If an FCM token is not found for this user, return an error
    if (!fcmToken) {
      return res.status(404).json({
        message: `FCM token not found for user: ${uid} in ${userSource}`
      });
    }

    // 10) Log the token for debugging/tracking
    console.log(`Sending notification to token [${userSource}]: ${fcmToken}`);

    // 11) Build the notification payload
    const payload = {
      notification: {
        title: message.title,
        body: message.body,
      },
      data: {
        location,
        uid,
        userSource, // optional: so the client knows if it's from queue or active
      },
      token: fcmToken,
    };

    // 12) Send the notification using the Firebase Admin SDK
    const response = await admin.messaging().send(payload);

    // 13) Log the response (includes message ID from FCM)
    console.log("Notification Response:", response);

    // 14) Respond to the client that everything worked
    res.status(200).json({
      message: "Notification sent successfully",
      response,
    });

  } catch (error) {
    // 15) Catch any errors and respond with 500 status
    console.error("Failed to send notification:", error);
    res.status(500).json({
      message: "Server error",
      error,
    });
  }
});

module.exports = router;

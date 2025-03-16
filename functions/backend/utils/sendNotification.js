const admin = require('firebase-admin');

/**
 * Sends a web push notification to a user based on their UID.
 * @param {string} location - The location ID in Firestore.
 * @param {string} uid - The user's Firebase UID.
 * @param {object} message - The message object containing title and body.
 * @returns {Promise<object>} - A response object with the notification result.
 */
async function sendWebNotification(location, uid, message) {
  try {
    // Validate input parameters
    if (!location || !uid || !message || !message.title || !message.body) {
      throw new Error("Location, UID, and message (with title and body) are required");
    }

    // Retrieve the 'location' document from Firestore
    const locationRef = admin.firestore().collection('locations').doc(location);
    const locationSnapshot = await locationRef.get();

    // Check if the location exists
    if (!locationSnapshot.exists) {
      throw new Error("Location not found.");
    }

    const locationData = locationSnapshot.data();

    // Find the user in the queue or active players list
    let index = locationData.queueFirebaseUIDs.indexOf(uid);
    let fcmToken = null;
    let userSource = 'queue';

    if (index === -1) {
      index = locationData.activeFirebaseUIDs.indexOf(uid);
      userSource = 'active';

      if (index === -1) {
        throw new Error(`User UID not found in queue or active players: ${uid}`);
      }

      fcmToken = locationData.activeTokens[index];
    } else {
      fcmToken = locationData.queueTokens[index];
    }

    // If FCM token is not found
    if (!fcmToken) {
      throw new Error(`FCM token not found for user: ${uid} in ${userSource}`);
    }

    console.log(`Sending notification to token [${userSource}]: ${fcmToken}`);

    // Build the notification payload
    const payload = {
      notification: {
        title: message.title,
        body: message.body,
      },
      data: {
        location,
        uid,
        userSource,
      },
      token: fcmToken,
    };

    // Send the notification
    const response = await admin.messaging().send(payload);
    console.log("Notification Response:", response);

    return {
      success: true,
      message: "Notification sent successfully",
      response,
    };
  } catch (error) {
    console.error("Failed to send notification:", error);
    return {
      success: false,
      message: error.message || "Server error",
      error,
    };
  }
}

module.exports = sendWebNotification;

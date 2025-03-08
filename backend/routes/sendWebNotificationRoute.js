const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const sendWebNotification = require('../utils/sendNotification');  

/**
 * POST /sendWebNotification
 *
 * Sends a web push notification to a user (identified by `uid`) who might be
 * in a queue or an activePlayers list at a given location.
 * The message includes both `notification` and `data` fields for Firebase.
 */
router.post('/sendWebNotification', async (req, res) => {
  try {
    // Extract relevant fields from request body
    const { location, uid, message } = req.body;

    // Validate required fields
    if (!location || !uid || !message || !message.title || !message.body) {
      return res.status(400).json({
        message: "Location, UID, and message (with title and body) are required",
      });
    }

    // Call the utility to send notification
    const result = await sendWebNotification(location, uid, message);

    // Handle success or error from the utility
    if (!result.success) {
      return res.status(400).json(result);
    }
    return res.status(200).json(result);

  } catch (error) {
    // Catch any errors and respond with 500 status
    console.error("Failed to send notification:", error);
    return res.status(500).json({
      message: "Server error",
      error,
    });
  }
});

module.exports = router;

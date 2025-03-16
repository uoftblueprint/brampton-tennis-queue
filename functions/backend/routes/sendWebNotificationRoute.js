const { onRequest } = require("firebase-functions/v2/https");
const sendWebNotification = require('../utils/sendNotification');  

const sendWebNotificationRoute = onRequest(async (req, res) => {
  try {
    // Simply extract fields, no need to re-check them here
    const { location, uid, message } = req.body;

    // Call the utility (it will validate & return success/error objects)
    const result = await sendWebNotification(location, uid, message);

    // If the utility indicates failure, respond with an error
    if (!result.success) {
      return res.status(400).json(result);
    }

    // Otherwise, respond with success
    return res.status(200).json(result);

  } catch (error) {
    console.error("Failed to send notification:", error);
    return res.status(500).json({
      message: "Server error",
      error,
    });
  }
});

module.exports = sendWebNotificationRoute;

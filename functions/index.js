// Import necessary Firebase Functions and Firebase Admin SDK
const { onRequest } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const admin = require("firebase-admin");
const serviceAccount = require("./backend/firebase-admin.json");

// Initialize Firebase Admin SDK
initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://brampton-tennis-queue.firebaseio.com",
});

// Import route logic (note that the routes now return Firebase Functions)
const resetCourtsRoute = require("./backend/routes/resetCourtsRoute");
const expectedWaitTimeRoute = require("./backend/routes/expectedWaitTimeRoute");
const addUnknownsRoute = require("./backend/routes/addUnknownsRoute");
const leaveQueueRoute = require("./backend/routes/leaveQueueRoute");
const endSessionRoute = require("./backend/routes/endSessionRoute");
const dynamicBufferRoute = require("./backend/routes/dynamicBufferRoute");
const getTakenRoute = require("./backend/routes/getTakenRoute");
const currentStateRoute = require("./backend/routes/currentStateRoute");
const joinGameRoute = require("./backend/routes/joinGameRoute");
const advanceQueueRoute = require("./backend/routes/advanceQueueRoute");
const trackMetricsRoute = require("./backend/routes/trackMetricsRoute");
const sendWebNotificationRoute = require("./backend/routes/sendWebNotificationRoute");

// Define individual Firebase functions using onRequest for each route
exports.resetCourts = resetCourtsRoute;
exports.expectedWaitTime = expectedWaitTimeRoute;
exports.addUnknowns = addUnknownsRoute;
exports.leaveQueue = leaveQueueRoute;
exports.endSession = endSessionRoute;
exports.dynamicBuffer = dynamicBufferRoute;
exports.getTaken = getTakenRoute;
exports.currentState = currentStateRoute;
exports.joinGame = joinGameRoute;
exports.advanceQueue = advanceQueueRoute;
exports.trackMetrics = trackMetricsRoute;
exports.sendWebNotification = sendWebNotificationRoute;

// Default root handler for Firebase Functions
exports.default = onRequest((req, res) => {
    res.send("Brampton Tennis Queue API running on Firebase!");
});

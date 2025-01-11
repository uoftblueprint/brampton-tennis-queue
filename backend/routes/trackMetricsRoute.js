const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

// Track Metrics endpoint
router.post('/trackMetrics', async (req, res) => {
    try {
        // Get the location from the request body and validate
        const location = req.body.location;
        if (!location) {
            return res.status(400).json({ message: "Location is required" });
        }

        // Get the location document snapshot from Firestore
        const locationRef = admin.firestore().collection('locations').doc(location);
        const locationSnapshot = await locationRef.get();
        if (!locationSnapshot.exists) {
            return res.status(404).json({ message: 'Location not found.' });
        }

        // Access document data
        const locationData = locationSnapshot.data();
        const queueFirebaseUIDs = locationData.queueFirebaseUIDs || [];
        const numberOfCourts = locationData.numberOfCourts || 1;
        const activeStartTimes = locationData.activeStartTimes || [];
        const queueJoinTimes = locationData.queueJoinTimes || [];
        
        // Keep track of courts currently taken
        const takenCourts = [];
        const activePlayers = locationData.activeFirebaseUIDs;
        activePlayers.forEach((player) => {
            if (!player.startsWith('Empty')) {
                takenCourts.push(activePlayers.indexOf(player) + 1);
            }
        });

        // Calculate the metrics
        const queueSize = queueFirebaseUIDs.length;
        const fillRatio = (takenCourts.length / numberOfCourts) * 100;

        // Get the current date and time for metrics
        const now = new Date();
        const dateKey = now.toLocaleDateString("en-CA", { year: "numeric", month: "2-digit", day: "2-digit" }); // 'YYYY-MM-DD'
        const timeKey = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }); // 'HH:mm'

        // Prepare the metrics data to write
        const metricsRef = admin.firestore()
            .collection('metrics')
            .doc(location) // Use the location name as document ID
            .collection('locationMetrics') // Subcollection for daily metrics
            .doc(dateKey); // Use current date as document ID

        const metricsData = {
            [timeKey]: { 
                fillRatio, 
                queueSize,
            }
        };

        // Add activeJoinTimes only if activeStartTimes has elements
        if (activeStartTimes.length > 0) {
            metricsData.activeJoinTimes = admin.firestore.FieldValue.arrayUnion(...activeStartTimes);
        }

        // Add queueJoinTimes only if queueJoinTimes has elements
        if (queueJoinTimes.length > 0) {
            metricsData.queueJoinTimes = admin.firestore.FieldValue.arrayUnion(...queueJoinTimes);
        }

        // Use .set with merge: true to avoid overwriting existing data
        await metricsRef.set(metricsData, { merge: true });

        // Send a success response back to the client
        res.status(200).json({ message: "Metrics tracked successfully." });

    } catch (error) {
        console.error("Error tracking metrics:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;

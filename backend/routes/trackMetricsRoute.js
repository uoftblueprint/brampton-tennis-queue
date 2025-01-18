const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const trackSingleCourt = require('../utils/trackSingleCourt');  // Import the court tracking utility

// Track Metrics endpoint
router.post('/trackMetrics', async (req, res) => {
    try {
        // Start a Firestore transaction
        const db = admin.firestore();
        const locationsRef = db.collection("locations");

        await db.runTransaction(async (transaction) => {
            // Extract list of location documents
            const locationDocs = await locationsRef.listDocuments();

            // Iterate over all locations and track the metrics
            for (const locationRef of locationDocs) {
                const locationSnapshot = await transaction.get(locationRef);
                const locationData = locationSnapshot.data();
                
                // Track metrics for specific location in transaction
                await trackSingleCourt(locationRef, locationData, transaction);
            }
        });

        // Send a success response back to the client
        res.status(200).json({ message: "Metrics tracked for all locations successfully!" });

    } catch (error) {
        console.error("Error tracking metrics:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
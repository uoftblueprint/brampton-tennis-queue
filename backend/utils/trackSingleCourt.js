const admin = require('firebase-admin');

async function trackSingleCourt(locationRef, locationData, transaction) {
    try {
        const { queueFirebaseUIDs = [], numberOfCourts = 1, activeFirebaseUIDs = [] } = locationData;

        // Calculate the metrics
        const queueSize = queueFirebaseUIDs.length;
        const takenCourts = activeFirebaseUIDs.filter(id => !id.startsWith('Empty')).length;
        const fillRatio = (takenCourts / numberOfCourts) * 100;

        // Get the current date and time for metrics
        const now = new Date();
        const dateKey = now.toLocaleDateString("en-CA", { year: "numeric", month: "2-digit", day: "2-digit" }); // 'YYYY-MM-DD'
        const timeKey = now.toLocaleTimeString("en-CA", { hour: "2-digit", minute: "2-digit", hour12: false }); // 'HH:mm'

        // Prepare the metrics data to write
        const metricsRef = admin.firestore()
            .collection('metrics')
            .doc(locationRef.id)
            .collection('locationMetrics')
            .doc(dateKey);

        const metricsData = {
            [timeKey]: {
                fillRatio,
                queueSize,
            },
        };

        // Use .set with merge: true to avoid overwriting existing data
        await transaction.set(metricsRef, metricsData, { merge: true });
    } catch (error) {
        console.error(`Error tracking metrics for location ${locationRef.id}:`, error);
        throw error;  // Rethrow to propagate the error to the caller
    }
}

module.exports = trackSingleCourt;
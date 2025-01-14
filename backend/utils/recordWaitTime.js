const admin = require('firebase-admin');

async function recordWaitTime(location, date, joinQueue, joinActive) {
    try {
        // Get reference to location document and set return message
        const db = admin.firestore();

        // Prepare the metrics data to write
        const metricsRef = admin.firestore()
            .collection('metrics')
            .doc(location) // Use the location name as document ID
            .collection('locationMetrics') // Subcollection for daily metrics
            .doc(date); // Use current date as document ID

        // Start transaction to update metrics
        await db.runTransaction(async (transaction) => {
            transaction.set(
                metricsRef, 
                {
                    queueJoinTimes: admin.firestore.FieldValue.arrayUnion(joinQueue),
                    activeJoinTimes: admin.firestore.FieldValue.arrayUnion(joinActive),
                },
                { merge: true }  // Merge data instead of overwriting the document
            );
        });
    } catch (error) {
        // If an error occurs, send an error message.
        console.error("Failed to record wait time: ", error);
    }
}

module.exports = recordWaitTime;
const admin = require('firebase-admin');

async function joinGame(locationData, firebaseUID, nickname) {
    const {
        activeFirebaseUIDs,
        activeNicknames,
        activeStartTimes,
        activeWaitingPlayers,
        queueFirebaseUIDs,
        queueJoinTimes,
        queueNicknames,
        numberOfCourts,
    } = locationData;

    // Ensure all arrays match the number of courts
    if (
        activeFirebaseUIDs.length !== numberOfCourts ||
        activeNicknames.length !== numberOfCourts ||
        activeStartTimes.length !== numberOfCourts ||
        activeWaitingPlayers.length !== numberOfCourts
    ) {
        throw new Error('Inconsistent Firestore data: Array sizes do not match number of courts.');
    }

    // Check for an empty court
    const emptyCourtIndex = activeFirebaseUIDs.findIndex((uid) => uid.toLowerCase().startsWith('empty'));

    if (emptyCourtIndex !== -1) {
        // Assign the player to the empty court
        activeFirebaseUIDs[emptyCourtIndex] = firebaseUID;
        activeNicknames[emptyCourtIndex] = nickname;

        // Use valid Firestore timestamp
        activeStartTimes[emptyCourtIndex] = admin.firestore.Timestamp.now();
        activeWaitingPlayers[emptyCourtIndex] = false;

        return {
            success: true,
            message: 'Added to active list.',
            updatedData: locationData, // Return updated locationData
        };
    } else {
        // Check if the queue is full
        if (queueFirebaseUIDs.length >= 5) {
            return {
                success: false,
                message: 'Queue is full. Cannot join.',
            };
        }

        // Add the player to the queue
        queueFirebaseUIDs.push(firebaseUID);
        queueJoinTimes.push(admin.firestore.Timestamp.now());
        queueNicknames.push(nickname);

        return {
            success: true,
            message: 'Added to queue.',
            updatedData: locationData, // Return updated locationData
        };
    }
}

module.exports = joinGame;

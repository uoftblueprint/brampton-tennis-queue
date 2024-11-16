async function leaveQueue(locationData, firebaseUID) {
    const { queueFirebaseUIDs, queueNicknames } = locationData;

    // Check whether the player exists
    const playerIndex = queueFirebaseUIDs.indexOf(firebaseUID);
    if (playerIndex === -1) {
        throw new Error('FirebaseUID not found in queue.');
    }

    // Update the relevant fields
    queueFirebaseUIDs.splice(playerIndex, 1);
    queueNicknames.splice(playerIndex, 1);
}

module.exports = leaveQueue;
async function leaveQueue(locationData, firebaseUID) {
    const { queueFirebaseUIDs, queueNicknames } = locationData;

    // Check whether the player exists
    const playerIndex = queueFirebaseUIDs.indexOf(firebaseUID);
    if (playerIndex === -1) {
        return 204;  // No need for update as UID does not exist
    }

    // Update the relevant fields
    queueFirebaseUIDs.splice(playerIndex, 1);
    queueNicknames.splice(playerIndex, 1);
    return 200;
}

module.exports = leaveQueue;
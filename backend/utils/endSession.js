async function endSession(locationData, firebaseUID) {
    const { activeFirebaseUIDs, activeNicknames, activeWaitingPlayers } = locationData;

    // Check whether the player exists
    const playerIndex = activeFirebaseUIDs.indexOf(firebaseUID);
    if (playerIndex === -1) {
        throw new Error('FirebaseUID not found.');
    }

    // Update the relevant fields
    const newName = `Empty${playerIndex + 1}`;
    activeFirebaseUIDs[playerIndex] = newName;
    activeNicknames[playerIndex] = newName;
    activeWaitingPlayers[playerIndex] = false;
}

module.exports = endSession;
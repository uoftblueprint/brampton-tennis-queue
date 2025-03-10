async function endSession(locationData, firebaseUID) {
    const { activeFirebaseUIDs, activeNicknames, activeWaitingPlayers, activeTokens} = locationData;

    // Check whether the player exists
    const playerIndex = activeFirebaseUIDs.indexOf(firebaseUID);
    if (playerIndex === -1) {
        return 204;  // No need for update as UID does not exist
    }

    // Update the relevant fields
    const newName = `Empty${playerIndex + 1}`;
    activeFirebaseUIDs[playerIndex] = newName;
    activeNicknames[playerIndex] = newName;
    activeWaitingPlayers[playerIndex] = false;
    activeTokens[playerIndex] = 'NULL';
    return 200;
}

module.exports = endSession;
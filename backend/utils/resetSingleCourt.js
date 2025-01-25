async function resetSingleCourt(locationRef, locationData, transaction) {
    const { numberOfCourts, activeFirebaseUIDs, activeNicknames, activeWaitingPlayers, activeTokens } = locationData;

    for (let i = 0; i < numberOfCourts; i++) {
        const courtNumber = i + 1;
        const newName = `Empty${courtNumber}`;

        activeFirebaseUIDs[i] = newName;
        activeNicknames[i] = newName;
        activeWaitingPlayers[i] = false;
        activeTokens[i] = "NULL";
    }

    // Update the location data within the transaction
    transaction.update(locationRef, {
        activeFirebaseUIDs: activeFirebaseUIDs,
        activeNicknames: activeNicknames,
        activeWaitingPlayers: activeWaitingPlayers,
        activeTokens: activeTokens,
        queueFirebaseUIDs: [],
        queueNicknames: [],
        queueJoinTimes: [],
        queueTokens: [],
        lastUpdateTime: admin.firestore.FieldValue.serverTimestamp(),
    });
}

module.exports = resetSingleCourt;
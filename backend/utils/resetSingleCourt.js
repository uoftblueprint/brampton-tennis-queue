async function resetSingleCourt(locationRef, locationData, transaction) {
    const { numberOfCourts, activeFirebaseUIDs, activeNicknames, activeWaitingPlayers } = locationData;

    for (let i = 0; i < numberOfCourts; i++) {
        const courtNumber = i + 1;
        const newName = `Empty${courtNumber}`;

        activeFirebaseUIDs[i] = newName;
        activeNicknames[i] = newName;
        activeWaitingPlayers[i] = false;
    }

    // Update the location data within the transaction
    transaction.update(locationRef, {
        activeFirebaseUIDs: activeFirebaseUIDs,
        activeNicknames: activeNicknames,
        activeWaitingPlayers: activeWaitingPlayers,
        queueFirebaseUIDs: [],
        queueNicknames: [],
        queueJoinTimes: []
    });
}

module.exports = resetSingleCourt;
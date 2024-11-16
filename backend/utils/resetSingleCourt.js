async function resetSingleCourt(locationRef, locationData, batch) {
    const { numberOfCourts, activeFirebaseUIDs, activeNicknames, activeWaitingPlayers } = locationData;

    for (let i = 0; i < numberOfCourts; i++) {
        const courtNumber = i + 1;
        const newName = `Empty${courtNumber}`;

        activeFirebaseUIDs[i] = newName;
        activeNicknames[i] = newName;
        activeWaitingPlayers[i] = false;
    }

    batch.update(locationRef, {
        activeFirebaseUIDs: activeFirebaseUIDs,
        activeNicknames: activeNicknames,
        activeWaitingPlayers: activeWaitingPlayers,
        queueFirebaseUIDs: [],
        queueNicknames: [],
    });
}

module.exports = resetSingleCourt;
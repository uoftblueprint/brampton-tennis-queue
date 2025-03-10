const createTimestamps = require('./createTimestamps');

async function addUnknowns(locationData, occupiedCourts) {
    const { numberOfCourts, activeFirebaseUIDs, activeNicknames, activeWaitingPlayers, activeStartTimes, activeTokens } = locationData;

    // Create an array of adjusted timestamps
    const timestamps = await createTimestamps(occupiedCourts.length);
    let lastTimestampIdx = 0;

    // Process each court based on occupancy status
    for (let i = 0; i < numberOfCourts; i++) {
        const courtNumber = i + 1;
        const isPhysicallyOccupied = occupiedCourts.includes(courtNumber);
        const isVirtuallyEmpty = activeFirebaseUIDs[i].startsWith('Empty');

        // If court is physically occupied but virtually empty
        if (isPhysicallyOccupied && isVirtuallyEmpty) {
            const newName = `Unknown${courtNumber}`;
            const timestamp = timestamps[lastTimestampIdx];
            lastTimestampIdx += 1;

            activeWaitingPlayers[i] = false;
            activeFirebaseUIDs[i] = newName;
            activeNicknames[i] = newName;
            activeStartTimes[i] = timestamp;
            activeTokens[i] = 'NULL';

        // If court is physically empty but virtually occupied
        } else if (!isPhysicallyOccupied && !isVirtuallyEmpty) {
            const newName = `Empty${courtNumber}`;

            activeWaitingPlayers[i] = false;
            activeFirebaseUIDs[i] = newName;
            activeNicknames[i] = newName;
            activeTokens[i] = 'NULL';
        }
    }
}

module.exports = addUnknowns;
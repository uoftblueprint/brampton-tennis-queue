async function addUnknowns(locationData, occupiedCourts) {
    const { numberOfCourts, activeFirebaseUIDs, activeNicknames, activeWaitingPlayers, activeStartTimes } = locationData;

    const now = new Date();
    const adjustments = occupiedCourts.map((_, index) => -10 * (index + 1));
    const timestamps = adjustments.map(seconds => {
        const adjustedTime = new Date(now);
        adjustedTime.setSeconds(now.getSeconds() + seconds);
        return adjustedTime;
    });
    shuffleArray(timestamps);
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

        // If court is physically empty but virtually occupied
        } else if (!isPhysicallyOccupied && !isVirtuallyEmpty) {
            const newName = `Empty${courtNumber}`;

            activeWaitingPlayers[i] = false;
            activeFirebaseUIDs[i] = newName;
            activeNicknames[i] = newName;
        }
    }
}

// Shuffle function
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));  // Random index
        [array[i], array[j]] = [array[j], array[i]];  // Swap elements
    }
};

module.exports = addUnknowns;
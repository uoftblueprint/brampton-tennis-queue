async function leaveQueue(locationData, firebaseUID) {
    const { 
        queueFirebaseUIDs, 
        queueNicknames, 
        queueJoinTimes, 
        queueTokens,
        activeStartTimes,
        activeWaitingPlayers,
        activeNicknames} = locationData;
    
    // Check whether the player exists
    const playerIndex = queueFirebaseUIDs.indexOf(firebaseUID);
    if (playerIndex === -1) {
        return 204;  // No need for update as UID does not exist
    }

    // Update the relevant fields
    queueFirebaseUIDs.splice(playerIndex, 1);
    queueNicknames.splice(playerIndex, 1);
    queueJoinTimes.splice(playerIndex, 1);
    queueTokens.splice(playerIndex, 1);

    // Merge activeStartTimes and activeNicknames as a tuple array
    let dynamicPlayers = activeStartTimes.map((time, index) => [time, index, activeNicknames[index]]);

    // Sort the active players by timestamps and filter out names without expiry bracket '[]'
    dynamicPlayers = dynamicPlayers.filter(([time, index, name]) => name.includes('['));
    dynamicPlayers.sort((a, b) => a[0] - b[0]);

    // Assert to ensure the length of dynamicPlayers matches the count of true values in activeWaitingPlayers
    console.assert(dynamicPlayers.length === activeWaitingPlayers.filter(Boolean).length, "Mismatch between dynamicPlayers length and true count in activeWaitingPlayers");

    let remainingQueueLength = queueFirebaseUIDs.length;

    if (remainingQueueLength == dynamicPlayers.length) {
        return 200;
    } else {
        const [time, index, name] = dynamicPlayers[dynamicPlayers.length - 1];
        activeWaitingPlayers[index] = false;
        if (activeNicknames[index]) {
            let bracketIndex = activeNicknames[index].indexOf('[');
            if (bracketIndex != -1) {
                activeNicknames[index] = activeNicknames[index].substring(0, bracketIndex);
            }
        }
    }
    
    return 200;
}

module.exports = leaveQueue;
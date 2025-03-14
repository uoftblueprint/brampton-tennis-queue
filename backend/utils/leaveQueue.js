import dynamicBuffer from "./dynamicBuffer";

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

    // Merge activeStartTimes and activeWaitingPlayers as a tuple array
    const activePlayers = activeStartTimes.map((time, index) => [time, index]);

    // Remove all elements where the nickname contains a bracket
    activePlayers.sort((a, b) => a[0] - b[0]);
    for (let i = 0; i < activePlayers.length; i++) {
        const [time, index] = activePlayers[i];
        if (activeNicknames[index].search('[') != -1) {
            activeNicknames.splice(i, 1);
        }
    }

    // Assert to ensure the length of activePlayers matches the count of true values in activeWaitingPlayers
    console.assert(activePlayers.length === activeWaitingPlayers.filter(Boolean).length, "Mismatch between activePlayers length and true count in activeWaitingPlayers");

    let remainingQueueLength = queueNicknames.length;

    if (remainingQueueLength == activePlayers.length) {
        return 200;
    } else {
        const [time, index] = activePlayers[activePlayers.length - 1];
        activeWaitingPlayers[index] = false;
        let bracketIndex = activeNicknames[index].indexOf('[');
        if (bracketIndex != -1) {
            activeNicknames[index] = activeNicknames[index].substring(0, bracketIndex);
        }
    }
    
    return 200;
}

module.exports = leaveQueue;
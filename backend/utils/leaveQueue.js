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
    const dynamicPlayers = activeStartTimes.map((time, index) => [time, index, activeNicknames[index]]);

    // Remove all elements where the nickname contains a bracket
    dynamicPlayers.sort((a, b) => a[0] - b[0]);
    for (let i = 0; i < dynamicPlayers.length; i++) {
        const [time, index, name] = dynamicPlayers[i];

        if (!name.includes('[')) {
console.log(name)
console.log(name)
            console.log(name)
            dynamicPlayers.splice(i, 1);
            i--;
        }
    }

    // Assert to ensure the length of dynamicPlayers matches the count of true values in activeWaitingPlayers
    // console.assert(dynamicPlayers.length === activeWaitingPlayers.filter(Boolean).length, "Mismatch between dynamicPlayers length and true count in activeWaitingPlayers");

    let remainingQueueLength = queueFirebaseUIDs.length;

    console.log(remainingQueueLength == dynamicPlayers.length);
    if (remainingQueueLength == dynamicPlayers.length) {
        return 200;
    } else {
        console.log(["here", dynamicPlayers])
        const [time, index, name] = dynamicPlayers[dynamicPlayers.length - 1];
        activeWaitingPlayers[index] = false;
        console.log(activeNicknames[index]);
        if (activeNicknames[index]) {
            let bracketIndex = activeNicknames[index].indexOf('[');
            console.log(bracketIndex);
            if (bracketIndex != -1) {
                activeNicknames[index] = activeNicknames[index].substring(0, bracketIndex);
            }
        }
    }
    console.log(activeNicknames)
    
    return 200;
}

module.exports = leaveQueue;
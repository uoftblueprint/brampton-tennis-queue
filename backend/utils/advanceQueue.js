// const dynamicBuffer = require('./dynamicBuffer'); // Import dynamicBuffer 
// const sendWebNotification = require('./sendWebNotification'); // Import sendWebNotification 

async function advanceQueue(locationData) {
    const { activeFirebaseUIDs, activeNicknames, activeStartTimes, queueFirebaseUIDs, queueNicknames, activeWaitingPlayers } = locationData;

    // Move first player in the queue to active
    const firstPlayerUID = queueFirebaseUIDs.shift();
    const firstPlayerNickname = queueNicknames.shift();
    const emptyCourtIdx = activeFirebaseUIDs.findIndex((firebaseUID) => firebaseUID.startsWith('Empty'));
    activeFirebaseUIDs[emptyCourtIdx] = firstPlayerUID; 
    activeNicknames[emptyCourtIdx] = firstPlayerNickname;
    activeStartTimes[emptyCourtIdx] = new Date();
    activeWaitingPlayers[emptyCourtIdx] = false;    

    // Call dynamicBuffer 
    // await dynamicBuffer(locationData);

    // Notify second player that they are next
    // await sendWebNotification(locationData, secondPlayer);
}

module.exports = advanceQueue;

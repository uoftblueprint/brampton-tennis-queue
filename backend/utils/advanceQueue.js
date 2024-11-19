// const dynamicBuffer = require('./dynamicBuffer'); // Import dynamicBuffer 
// const sendWebNotification = require('./sendWebNotification'); // Import sendWebNotification 

async function advanceQueue(locationData) {
    const { activeFirebaseUIDs, activeNicknames, activeStartTimes, activeWaitingPlayers, queueFirebaseUIDs, queueNicknames } = locationData;

    // If there are no players in the queue, return early (don't advance the queue)
    if (queueFirebaseUIDs.length === 0) {
        return;
    }

    // Get empty court index, and validate
    const emptyCourtIdx = activeFirebaseUIDs.findIndex((firebaseUID) => firebaseUID.startsWith('Empty'));
    // if there are no empty courts, emptyCourtIdx will be -1 (don't advance the queue)
    if (emptyCourtIdx === -1) { 
        return;
    }

    // Move first player in the queue to active
    const firstPlayerUID = queueFirebaseUIDs.shift();
    const firstPlayerNickname = queueNicknames.shift();
    activeFirebaseUIDs[emptyCourtIdx] = firstPlayerUID; 
    activeNicknames[emptyCourtIdx] = firstPlayerNickname;
    activeStartTimes[emptyCourtIdx] = new Date();
    activeWaitingPlayers[emptyCourtIdx] = false;    

    // Call dynamicBuffer 
    // await dynamicBuffer(locationData);

    // If queue is not empty, notify next player that they are now first in line
    // if (queueFirebaseUIDs.length > 0) {
    //     const nextPlayerUID = queueFirebaseUIDs[0];
    //     await sendWebNotification(nextPlayerUID, 'You are now first in line!');
    // }
}

module.exports = advanceQueue;

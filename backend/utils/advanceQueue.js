// const dynamicBuffer = require('./dynamicBuffer'); // Import dynamicBuffer 
// const sendWebNotification = require('./sendWebNotification'); // Import sendWebNotification 

async function advanceQueue(locationData) {
    const { activeFirebaseUIDs, activeNicknames, activeStartTimes, activeWaitingPlayers, queueFirebaseUIDs, queueNicknames } = locationData;

    // If there are no players in the queue, return early (don't advance the queue)
    if (queueFirebaseUIDs.length === 0) {
        return;
    }

    // Keep track of current unique adjustment and the current time
    currAdjustment = 0;
    const now = new Date();

    queueAdvanced = false;
    for (let i = 0; i < activeFirebaseUIDs.length; i++) {
        
        // If there are no more players in the queue, return early (don't advance the queue further)
        if (queueFirebaseUIDs.length === 0) {
            break;
        }

        // If current court is empty, move first player in the current queue to active
        if (activeFirebaseUIDs[i].startsWith('Empty')) {
            // Create adjusted timestamp for the new player
            const adjustedTime = new Date(now);
            adjustedTime.setSeconds(now.getSeconds() + currAdjustment);
            currAdjustment -= 10;
            
            // Get UID and nickname of first player in the current queue
            const firstQueuePlayerUID = queueFirebaseUIDs.shift();
            const firstQueuePlayerNickname = queueNicknames.shift();
            
            // Update active data to reflect the new player
            activeFirebaseUIDs[i] = firstQueuePlayerUID; 
            activeNicknames[i] = firstQueuePlayerNickname;
            activeStartTimes[i] = adjustedTime;
            activeWaitingPlayers[i] = false;  

            queueAdvanced = true;

            // Notify the player that it's now their turn
            // await sendWebNotification(firstQueuePlayerUID, `It\'s now your turn at court ${i + 1}!`);
        }
    }

    // If queue was not advanced, return early (no need to call dynamicBuffer and sendWebNotification)
    if (!queueAdvanced) {
        return;
    }

    // Call dynamicBuffer
    // await dynamicBuffer(locationData);

    // If queue is not empty, notify next player that they are now first in line
    // if (queueFirebaseUIDs.length > 0) {
    //     const nextPlayerUID = queueFirebaseUIDs[0];
    //     await sendWebNotification(nextPlayerUID, 'You are now first in line!');
    // }
}

module.exports = advanceQueue;

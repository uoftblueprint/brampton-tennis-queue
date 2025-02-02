const dynamicBuffer = require('./dynamicBuffer'); // Import dynamicBuffer
// const sendWebNotification = require('./sendWebNotification'); // Import sendWebNotification
const createTimestamps = require('./createTimestamps');
const recordWaitTime = require('./recordWaitTime');

async function advanceQueue(locationData, location) {
    const { activeFirebaseUIDs, activeNicknames, activeStartTimes, activeWaitingPlayers, activeTokens, queueFirebaseUIDs, queueNicknames, queueJoinTimes, queueTokens } = locationData;

    // Create an array of adjusted timestamps
    const timestamps = await createTimestamps(activeFirebaseUIDs.length);
    let lastTimestampIdx = 0;

    queueAdvanced = false;
    for (let i = 0; i < activeFirebaseUIDs.length; i++) {
        
        // If there are no more players in the queue, return early (don't advance the queue further)
        if (queueFirebaseUIDs.length === 0) {
            break;
        }

        // If current court is empty, move first player in the current queue to active
        if (activeFirebaseUIDs[i].startsWith('Empty')) {
            // Get UID and nickname of first player in the current queue
            const firstQueuePlayerUID = queueFirebaseUIDs.shift();
            const firstQueuePlayerNickname = queueNicknames.shift();
            const firstQueueJoinTime = queueJoinTimes.shift();
            const firstQueueToken = queueTokens.shift();
            
            // Update active data to reflect the new player
            activeFirebaseUIDs[i] = firstQueuePlayerUID; 
            activeNicknames[i] = firstQueuePlayerNickname;
            activeStartTimes[i] = timestamps[lastTimestampIdx];
            activeWaitingPlayers[i] = false;
            activeTokens[i] = firstQueueToken;

            // Record metrics once new player has joined court
            const now = new Date();
            const date = now.toLocaleDateString("en-CA", { year: "numeric", month: "2-digit", day: "2-digit" });
            recordWaitTime(location, date, firstQueueJoinTime, timestamps[lastTimestampIdx]);

            lastTimestampIdx += 1;
            queueAdvanced = true;

            // Notify the player that it's now their turn
            // await sendWebNotification(firstQueuePlayerUID, `It\'s now your turn at court ${i + 1}!`);
        }
    }

    // If queue was not advanced, return early (no need to call dynamicBuffer and sendWebNotification)
    if (!queueAdvanced) {
        return 204;  // No need for update as courts occupied or queue empty
    }

    // Call dynamicBuffer
    await dynamicBuffer(locationData);

    // If queue is not empty, notify next player that they are now first in line
    // if (queueFirebaseUIDs.length > 0) {
    //     const nextPlayerUID = queueFirebaseUIDs[0];
    //     await sendWebNotification(nextPlayerUID, 'You are now first in line!');
    // }
    return 200;
}

module.exports = advanceQueue;
// const sendWebNotification = require('./sendWebNotification'); // Import sendWebNotification 
// const scheduleEndSession = require('./scheduleEndSession'); // Import scheduleEndSession 

async function dynamicBuffer(locationData) {
    const {
        activeFirebaseUIDs = [],
        activeNicknames = [],
        activeStartTimes = [],
        activeWaitingPlayers = [],
        queueFirebaseUIDs = [],
        queueNicknames = []
    } = locationData;

    // Count how many active players have someone waiting
    const numberWaitingPlayers = activeWaitingPlayers.filter(value => value === true).length;

    // Get the total queue players minus the number of active players who have someone waiting
    const queueWaiting = queueFirebaseUIDs.length - numberWaitingPlayers;

    // Find all active players who do NOT have someone waiting, sorted by start time
    const activePlayers = activeFirebaseUIDs.map((firebaseUID, index) => ({
        index: index,
        nickname: activeNicknames[index],
        firebaseUID: firebaseUID,
        waiting: activeWaitingPlayers[index],
        startTime: activeStartTimes[index]
    }));

    const sortedActivePlayers = activePlayers
        .filter(item => !item.waiting)
        .sort((a, b) => (a.startTime._seconds || 0) - (b.startTime._seconds || 0));

    const currentTime = Date.now() / 1000;

    for (let i = 0; i < queueWaiting && i < sortedActivePlayers.length; i++) {
        const player = sortedActivePlayers[i];

        // Calculate the time the player has played
        const timePlayed = Math.floor((currentTime - (player.startTime._seconds || 0)) / 60);

        const bufferTime = Math.max(
            timePlayed + 5,
            timePlayed < 30 ? Math.min(timePlayed + 30, 45) :
            timePlayed < 60 ? Math.min(timePlayed + 15, 65) :
            timePlayed + 5
        );

        activeWaitingPlayers[player.index] = true;

        const endTime = new Date(((player.startTime._seconds || 0) / 60 + bufferTime) * 60 * 1000);
        const formattedTime = `${
            endTime.getHours() % 12 || 12}:${String(endTime.getMinutes()).padStart(2, '0')} ${
            endTime.getHours() < 12 ? 'AM' : 'PM'}`;

        const nickname = activeNicknames[player.index];
        const spaceIndex = nickname.indexOf(' ');
        if (spaceIndex !== -1) {
            activeNicknames[player.index] = nickname.substring(0, spaceIndex);
        }
        activeNicknames[player.index] += ` [${formattedTime}]`;

        // Uncomment these once implemented
        // sendWebNotification(player.firebaseUID, bufferTime);
        // scheduleEndSession(endTime);
    }
}


module.exports = dynamicBuffer;

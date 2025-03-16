async function createTimestamps(numOfStamps) {
    const now = new Date();
    const adjustedTimestamps = [];
    
    for (let i = 0; i < numOfStamps; i++) {
        const adjustment = -10 * (i + 1)
        const adjustedTime = new Date(now);
        adjustedTime.setSeconds(now.getSeconds() + adjustment)
        adjustedTimestamps.push(adjustedTime); 
    }

    shuffleArray(adjustedTimestamps);
    return adjustedTimestamps;
}

// Shuffle function
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));  // Random index
        [array[i], array[j]] = [array[j], array[i]];  // Swap elements
    }
};

module.exports = createTimestamps;

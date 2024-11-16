const bcrypt = require('bcrypt');

async function bcryptCompare(plaintext, hashed) {
    try {
        return await bcrypt.compare(plaintext, hashed);
    } catch (err) {
        throw new Error("Bcrypt compare error: " + err.message);
    }
}

module.exports = bcryptCompare;
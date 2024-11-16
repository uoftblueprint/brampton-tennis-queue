const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const bcrypt = require("bcrypt");

async function bcryptCompare(plaintext, hashed) {
    try {
        return await bcrypt.compare(plaintext, hashed);
    } catch (err) {
        throw new Error("Bcrypt compare error: " + err.message);
    }
}

async function resetSingleCourt(locationRef, locationData, batch) {
    const { numberOfCourts, activeFirebaseUIDs, activeNicknames, activeWaitingPlayers } = locationData;

    for (let i = 0; i < numberOfCourts; i++) {
        const courtNumber = i + 1;
        const newName = `Empty${courtNumber}`;

        activeFirebaseUIDs[i] = newName;
        activeNicknames[i] = newName;
        activeWaitingPlayers[i] = false;
    }

    batch.update(locationRef, {
        activeFirebaseUIDs: activeFirebaseUIDs,
        activeNicknames: activeNicknames,
        activeWaitingPlayers: activeWaitingPlayers,
        queueFirebaseUIDs: [],
        queueNicknames: [],
    });
}

// Reset Courts Endpoint
router.post("/resetCourts", async (req, res) => {
    try {
        // Extract password from request body
        const requestPassword = req.body.password;
        if (!requestPassword) {
            return res.status(400).json({ message: "Password is required." });
        }

        // Compare password against enviroment hash before resetting courts
        // const hashedPassword = process.env.ADMIN_PASSWORD;
        // const passwordIsValid = await bcryptCompare(requestPassword, hashedPassword);
        // if (!passwordIsValid) {
        //     return res.status(401).json({ message: "Password is incorrect." });
        // }

        // Extract list of location documents and create batch
        const locations = await admin.firestore().collection("locations");
        const locationDocs = await locations.listDocuments();
        const batch = admin.firestore().batch();

        for (const locationRef of locationDocs) {
            const locationSnapshot = await locationRef.get();
            const locationData = locationSnapshot.data();
            await resetSingleCourt(locationRef, locationData, batch);
        }

        // Commit batch and send success response
        await batch.commit();
        res.status(200).json({
            message: "Reset all courts successfully",
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({ error: "Failed to reset courts." });
    }
});

module.exports = router;
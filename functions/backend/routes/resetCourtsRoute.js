const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
//const bcryptCompare = require('../utils/passwordValidation');  // Import the password compare utility
const resetSingleCourt = require('../utils/resetSingleCourt');  // Import the court reset utility

// Reset Courts Endpoint
const resetCourtsRoute = onRequest(async (req, res) => {
    try {
        // Extract password from request body
        const requestPassword = req.body.password;
        if (!requestPassword) {
            return res.status(400).json({ message: "Password is required." });
        }

        // Compare password against environment hash before resetting courts
        // const hashedPassword = process.env.ADMIN_PASSWORD;
        // const passwordIsValid = await bcryptCompare(requestPassword, hashedPassword);
        // if (!passwordIsValid) {
        //     return res.status(401).json({ message: "Password is incorrect." });
        // }

        // Start a Firestore transaction
        const db = admin.firestore();
        const locationsRef = db.collection("locations");

        await db.runTransaction(async (transaction) => {
            // Extract list of location documents
            const locationDocs = await locationsRef.listDocuments();

            // Iterate over all locations and reset the courts
            for (const locationRef of locationDocs) {
                const locationSnapshot = await transaction.get(locationRef);
                const locationData = locationSnapshot.data();
                
                // Perform court reset logic in transaction
                await resetSingleCourt(locationRef, locationData, transaction);
            }
        });

        // Send success response after the transaction
        res.status(200).json({
            message: "Reset all courts successfully",
        });
    } catch (error) {
        console.error("Error during reset:", error);
        res.status(500).send({ error: "Failed to reset courts." });
    }
});

module.exports = resetCourtsRoute;
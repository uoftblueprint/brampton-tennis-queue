const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const bcrypt = require("bcrypt");

function bcryptCompare(plaintext, hashed) {
  return new Promise(function (resolve, reject) {
    bcrypt.compare(plaintext, hashed, function (err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

async function resetActivePlayers(location, batch) {
  const active_players = await location
    .collection("activePlayers")
    .listDocuments();

  active_players.forEach((playerRef) => {
    const court_number = parseInt(playerRef.id.replace("Court", ""));
    const new_name = "Empty" + court_number.toString();
    const updateObj = {
      playerWaiting: false,
      firebaseUID: new_name,
      nickname: new_name,
    };
    batch.set(playerRef, updateObj, { merge: true });
  });
}

async function deleteQueuePlayers(location, batch) {
  const queue_players = await location
    .collection("queuePlayers")
    .listDocuments();

  queue_players.forEach((playerRef) => {
    batch.delete(playerRef);
  });
}

// Reset Courts Endpoint
router.post("/resetCourts", async (req, res) => {
  try {
    // // assume that this is already set
    const hashed_password = process.env.ADMIN_PASSWORD;
    const request_password = req.body.password;
    if (!request_password) {
      return res.status(400).json({ message: "Password is required." });
    }

    // try {
    //   await bcryptCompare(request_password, hashed_password);
    // } catch (_) {
    //   return res.status(401).json({ message: "Password is incorrect." });
    // }

    const locations = await admin.firestore().collection("locations");

    const location_docs = await locations.listDocuments();

    const batch = admin.firestore().batch();

    for (var i = 0; i < location_docs.length; i++) {
      await resetActivePlayers(location_docs[i], batch);
      await deleteQueuePlayers(location_docs[i], batch);
    }

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
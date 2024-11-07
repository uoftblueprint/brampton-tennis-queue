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

  for (var j = 0; j < active_players.length; j++) {
    const player_ref = await location
      .collection("activePlayers")
      .doc(active_players[j].id);
    const player = await (await player_ref.get()).data();

    const court_number = player.courtNumber;
    const new_name = "Empty" + court_number.toString();
    player.playerWaiting = false;
    player.firebaseUID = new_name;
    player.nickname = new_name;
    const updateObj = {
      playerWaiting: player.playerWaiting,
      firebaseUID: player.firebaseUID,
      nickname: player.nickname,
    };
    batch.update(player_ref, updateObj);
  }
}

async function deleteQueuePlayers(location, batch) {
  const queue_players = await location
    .collection("queuePlayers")
    .listDocuments();

  for (var j = 0; j < queue_players.length; j++) {
    const player_ref = await location
      .collection("queuePlayers")
      .doc(queue_players[j].id);
    batch.delete(player_ref);
  }
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
      const location = await locations.doc(location_docs[i].id);

      await resetActivePlayers(location, batch);
      await deleteQueuePlayers(location, batch);
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

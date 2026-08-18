const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

function getColor(num) {
  if (num === 0 || num === 5) return "violet";
  return num % 2 === 0 ? "red" : "green";
}

function getSize(num) {
  return num >= 5 ? "big" : "small";
}

exports.startGameEngine = functions.pubsub
  .schedule("every 30 seconds")
  .onRun(async () => {
    const currentGameRef = db.collection("games").doc("current");
    const currentGameSnap = await currentGameRef.get();

    const game = currentGameSnap.data();

    const resultNumber = Math.floor(Math.random() * 10);
    const resultColor = getColor(resultNumber);
    const resultSize = getSize(resultNumber);

    await currentGameRef.update({
      resultNumber,
      resultColor,
      resultSize,
      status: "completed",
    });

    const bets = await db
      .collection("bets")
      .where("gameId", "==", game.gameId)
      .get();

    for (const betDoc of bets.docs) {
      const bet = betDoc.data();

      let won = false;

      if (bet.type === "number" && bet.value === resultNumber)
        won = true;

      if (bet.type === "color" && bet.value === resultColor)
        won = true;

      if (bet.type === "size" && bet.value === resultSize)
        won = true;

      if (won) {
        const reward = bet.amount * 2;

        await db.collection("balance").doc(bet.uid).update({
          amount: admin.firestore.FieldValue.increment(reward),
        });

        await db.collection("transactions").add({
          uid: bet.uid,
          type: "win",
          amount: reward,
          gameId: game.gameId,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        await betDoc.ref.update({
          status: "won",
          reward,
        });
      } else {
        await betDoc.ref.update({
          status: "lost",
        });
      }
    }

    const newGameId = Date.now().toString();

    await currentGameRef.set({
      gameId: newGameId,
      duration: 30,
      startTime: Date.now(),
      status: "running",
    });
  });
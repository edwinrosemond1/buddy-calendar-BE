const functions = require("firebase-functions");
const { admin } = require("../config");

exports.handler = functions.https.onRequest(async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).send({ error: "Method Not Allowed" });
  }

  try {
    const usersCollection = admin.firestore().collection("users");
    const snapshot = await usersCollection.get();

    if (snapshot.empty) {
      return res.status(200).send([]);
    }

    let users = [];
    snapshot.forEach((doc) => {
      let eventItem = doc.data();
      eventItem.id = doc.id; // adding document ID to the event object
      users.push(eventItem);
    });

    return res.status(200).send(users);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
});

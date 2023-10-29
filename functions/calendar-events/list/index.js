const { admin, corsHandler } = require("../../config"); // Adjust the path based on your directory structure.
const functions = require("firebase-functions");

// Assuming you have initialized admin somewhere
// if not, add: admin.initializeApp();

exports.handler = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== "GET") {
      return res.status(405).send({ error: "Method Not Allowed" });
    }

    try {
      const eventsCollection = admin.firestore().collection("events");
      const snapshot = await eventsCollection.get();

      if (snapshot.empty) {
        return res.status(200).send([]);
      }

      let events = [];
      snapshot.forEach((doc) => {
        let eventItem = doc.data();
        eventItem.id = doc.id; // adding document ID to the event object
        events.push(eventItem);
      });

      return res.status(200).send(events);
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: "Internal Server Error" });
    }
  });
});

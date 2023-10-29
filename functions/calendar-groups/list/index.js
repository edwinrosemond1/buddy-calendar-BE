const { admin, corsHandler } = require("../../config");
const functions = require("firebase-functions");

exports.handler = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    console.log("list events endpoint");
    if (req.method !== "GET") {
      return res.status(405).send({ error: "Method Not Allowed" });
    }

    try {
      const groupsCollection = admin.firestore().collection("groups");
      const snapshot = await groupsCollection.get();

      if (snapshot.empty) {
        return res.status(200).send([]);
      }

      let calendarGroups = [];
      snapshot.forEach((doc) => {
        let eventItem = doc.data();
        calendarGroups.push(eventItem);
      });

      return res.status(200).send(calendarGroups);
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: "Internal Server Error" });
    }
  });
});

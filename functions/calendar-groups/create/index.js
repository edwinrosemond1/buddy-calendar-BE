const functions = require("firebase-functions");
const { v4: uuidv4 } = require("uuid");
const { admin, corsHandler } = require("../../config"); // Adjust the path based on your directory structure.
// Remove the line admin.initializeApp();

exports.handler = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send({ error: "Method Not Allowed" });
    }

    const groupData = req.body;

    try {
      // Validating the event data
      if (!groupData.name || !groupData.author) {
        return res.status(400).send({ error: "Invalid group data" });
      }

      const existingGroupQuery = await admin
        .firestore()
        .collection("groups")
        .where("name", "==", groupData.name)
        .where("author", "==", groupData.author)
        .get();

      if (!existingGroupQuery.empty) {
        // A group with the same name and author already exists
        return res.status(409).send({ error: "Group already exists" });
      }

      groupData.id = uuidv4();
      console.log("event is valid continuing", groupData);
      // Save to Firestore
      const eventRef = admin.firestore().collection("groups").doc();
      await eventRef.set(groupData);
      return res
        .status(200)
        .send({ success: true, id: eventRef.id, groupId: groupData.id });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: "Internal Server Error" });
    }
  });
});

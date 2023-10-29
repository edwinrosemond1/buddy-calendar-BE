/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

const functions = require("firebase-functions");
const { admin, corsHandler } = require("../config"); // Adjust the path based on your directory structure.
// Remove the line admin.initializeApp();

exports.handler = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send({ error: "Method Not Allowed" });
    }

    const eventData = req.body;

    try {
      // Validating the event data
      if (!eventData.title || !eventData.start || !eventData.end) {
        return res.status(400).send({ error: "Invalid event data" });
      }
      console.log("event is valid continuing", eventData);
      // Save to Firestore
      const eventRef = admin.firestore().collection("events").doc();
      await eventRef.set(eventData);
      return res.status(200).send({ success: true, id: eventRef.id });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: "Internal Server Error" });
    }
  });
});

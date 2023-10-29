const functions = require("firebase-functions");
const { corsHandler, admin } = require("../../config"); // Adjust the path based on your directory structure.

exports.handler = functions.https.onRequest((request, response) => {
  corsHandler(request, response, async () => {
    if (request.method === "OPTIONS") {
      // Pre-flight request. Reply successfully:
      response.status(204).send("");
    } else {
      // Your function's actual logic here
      console.log("request", request.headers.authorization);
      const token = request.headers.authorization.split("Bearer ")[1];
      admin
        .auth()
        .verifyIdToken(token)
        .then((decodedToken) => {
          const uid = decodedToken.uid;
          console.log("valid", uid);
          // Continue with your function logic
        })
        .catch((err) => {
          console.error("error verifying token", err);
          response.status(401).send("Hello from Firebase!");
          // Handle error (send a 401 Unauthorized response, etc.)
        });
      const email = request.body.email;
      if (!email) {
        response.status(400).send({ error: "The email is required" });
        return;
      }
      try {
        const userRecord = await admin.auth().getUserByEmail(email);
        console.log("user record", userRecord.customClaims);

        if (userRecord) {
          // Set custom claim - for this example, let's say it's "isSpecialUser"
          await admin
            .auth()
            .setCustomUserClaims(userRecord.uid, { admin: true });
          const metadataRef = admin
            .database()
            .ref("metadata/" + userRecord.uid);

          // Set the refresh time to the current UTC timestamp.
          // This will be captured on the client to force a token refresh.
          await metadataRef.set({ refreshTime: new Date().getTime() });
          response.send({ success: true });
        } else {
          response.status(404).send({ error: "User not found" });
        }
      } catch (error) {
        response.status(500).send({ error: error.message });
      }
      response.send("Hello from Firebase!");
    }
  });
});

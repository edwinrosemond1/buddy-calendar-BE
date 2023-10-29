const functions = require("firebase-functions");
const { db } = require("../config");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const corsHandler = cors({ origin: true });

exports.handler = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    console.log("running sign up");
    // Your function logic here
    if (req.method !== "POST") {
      return res.status(405).send({ error: "Method Not Allowed" });
    }

    const { username, password } = req.body;

    // Basic input validation
    if (!username || !password) {
      return res.status(400).send({ error: "Username or password missing" });
    }

    try {
      // Check if a user with the same username already exists
      const userSnapshot = await db
        .collection("users")
        .where("username", "==", username)
        .get();

      if (!userSnapshot.empty) {
        return res.status(400).send({ error: "Username already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds, you can adjust this value

      // Save the user in Firestore
      const userRef = db.collection("users").doc();
      await userRef.set({
        username: username,
        password: hashedPassword,
      });

      return res.status(201).send({ success: true, uid: userRef.id });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: "Internal Server Error" });
    }
  });
});

const functions = require("firebase-functions");
const { db } = require("../config");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "your_secret_key"; // TODO: Store this securely, not hard-coded.

exports.handler = functions.https.onRequest(async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send({ error: "Method Not Allowed" });
  }

  // Retrieve username and password from request body
  const { username, password } = req.body;

  // Check if the provided credentials are valid
  try {
    const userSnapshot = await db
      .collection("users")
      .where("username", "==", username)
      .get();

    if (userSnapshot.empty) {
      return res.status(400).send({ error: "Invalid username or password" });
    }

    const user = userSnapshot.docs[0].data();

    if (user.password !== password) {
      // Remember to hash passwords in a real-world application!
      return res.status(400).send({ error: "Invalid username or password" });
    }

    // Generate a JWT for the user
    const token = jwt.sign({ uid: userSnapshot.docs[0].id }, JWT_SECRET, {
      expiresIn: "24h", // token will expire in 24 hours
    });

    return res.status(200).send({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
});

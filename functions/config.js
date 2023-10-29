const admin = require("firebase-admin");
const cors = require("cors");
const corsHandler = cors({ origin: true });

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

module.exports = { admin, db, corsHandler };

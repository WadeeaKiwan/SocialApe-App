const admin = require("firebase-admin");
// Fetch the service account key JSON file contents
const serviceAccount = require("../config/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://socialape-ad195.firebaseio.com"
});
const db = admin.firestore();

module.exports = { admin, db };

const admin = require("firebase-admin");
// Fetch the service account key JSON file contents
const serviceAccount = require("../config/serviceAccountKey.json");
// Fetch the firebase configuration from the file
const firebaseConfig = require("../config/firebaseConfig");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: firebaseConfig.databaseURL,
  storageBucket: firebaseConfig.storageBucket
});
const db = admin.firestore();

module.exports = { admin, db };

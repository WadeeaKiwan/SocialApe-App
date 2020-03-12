import * as functions from "firebase-functions";
const admin = require("firebase-admin");
const firebase = require("firebase");
import firebaseConfig from "../config/firebaseConfig";

const app = require("express")();

admin.initializeApp();
const db = admin.firestore();

firebase.initializeApp(firebaseConfig);

// Get All Screams
app.get("/screams", async (req: any, res: any) => {
  try {
    let screams: any[] = [];
    const data = await db
      .collection("screams")
      .orderBy("createdAt", "desc")
      .get();

    data.forEach((doc: any) => {
      screams.push({
        screamId: doc.id,
        /**
         * body: doc.data().body,
         * userHandle: doc.data().userHandle,
         * createdAt: doc.data().createdAt
         * OR:
         */
        ...doc.data()
      });
    });
    return res.status(200).json(screams);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

// Create a new scream
app.post("/scream", async (req: any, res: any) => {
  try {
    const newScream = {
      body: req.body.body,
      userHandle: req.body.userHandle,
      createdAt: new Date().toISOString()
    };

    const doc = await db.collection("screams").add(newScream);
    return res.json({ message: `document ${doc.id} created successfully` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

// Signup route
app.post("/signup", async (req: any, res: any) => {
  let token: string, userId: string;

  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle
  };

  try {
    // TODO: validate data
    const doc = await db.doc(`/users/${newUser.handle}`).get();

    if (doc.exists) {
      return res.status(400).json({ handle: "This handle is already taken" });
    }
    const data = await firebase
      .auth()
      .createUserWithEmailAndPassword(newUser.email, newUser.password);
    userId = data.user.uid;

    const idToken = await data.user.getIdToken();
    token = idToken;

    const userCredentials = {
      handle: newUser.handle,
      email: newUser.email,
      createdAt: new Date().toISOString(),
      userId
    };

    await db.doc(`/users/${newUser.handle}`).set(userCredentials);

    return res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    if (err.code === "auth/email-already-in-use") {
      return res.status(400).json({ email: "Email is already in use" });
    }
    return res.status(500).json({ error: err.code });
  }
});

// Serve all routes with '/api' 'https://baseUrl.com/api'
exports.api = functions.region("europe-west1").https.onRequest(app);

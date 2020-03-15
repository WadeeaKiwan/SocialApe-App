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
    const screams: any[] = [];
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

const isEmpty = (string: string): boolean => {
  if (string.trim() === "") return true;
  else return false;
};

const isEmail = (email: string): boolean => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)) return true;
  else return false;
};

// Signup route
app.post("/signup", async (req: any, res: any) => {
  let token: string, userId: string;

  const newUser: {
    email: string;
    password: string;
    confirmPassword: string;
    handle: string;
  } = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle
  };

  // Validate data
  const errors: any = {};

  if (isEmpty(newUser.email)) {
    errors.email = "Must not be empty!";
  } else if (!isEmail(newUser.email)) {
    errors.email = "Must be a valid email address!";
  }

  if (isEmpty(newUser.password)) errors.password = "Must not be empty!";
  if (newUser.password !== newUser.confirmPassword)
    errors.confirmPassword = "Passwords must match!";
  if (isEmpty(newUser.handle)) errors.handle = "Must not be empty!";

  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors);
  }

  try {
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

// Login route
app.post("/login", async (req: any, res: any) => {
  let token: string;

  const user: {
    email: string;
    password: string;
  } = {
    email: req.body.email,
    password: req.body.password
  };

  const errors: any = {};

  if (isEmpty(user.email)) errors.email = "Must not be empty";
  if (isEmpty(user.password)) errors.password = "Must not be empty";

  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors);
  }

  try {
    const data = await firebase.auth().signInWithEmailAndPassword(user.email, user.password);
    const idToken = await data.user.getIdToken();
    token = idToken;

    return res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    if (err.code === "auth/wrong-password") {
      return res.status(403).json({ general: "Wrong credentials, please try again" });
    }
    return res.status(500).json({ error: err.code });
  }
});

// Serve all routes with '/api' 'https://baseUrl.com/api'
exports.api = functions.region("europe-west1").https.onRequest(app);

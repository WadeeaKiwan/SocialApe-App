import * as functions from "firebase-functions";
const admin = require("firebase-admin");
const express = require("express");

admin.initializeApp();
const db = admin.firestore();

const app = express();

// Get All Screams
app.get("/screams", (req: any, res: any) => {
  db.collection("screams")
    .orderBy("createdAt", "desc")
    .get()
    .then((data: any[]) => {
      let screams: any[] = [];
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
      return res.json(screams);
    })
    .catch((err: any) => console.error(err));
});

// Create a new scream
app.post("/scream", (req: any, res: any) => {
  const newScream = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString()
  };

  db.collection("screams")
    .add(newScream)
    .then((doc: any) => {
      return res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch((err: any) => {
      res.status(500).json({ error: "Something went wrong" });
      console.error(err);
    });
});

// Serve all routes with '/api' 'https://baseUrl.com/api'
exports.api = functions.region("europe-west1").https.onRequest(app);

import * as functions from "firebase-functions";
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((req, res) => {
  res.send("Hello from Firebase!");
});

export const getScreams = functions.https.onRequest((req, res) => {
  db.collection("screams")
    .get()
    .then((data: any[]) => {
      let screams: any[] = [];
      data.forEach((doc: { data: () => any }) => {
        screams.push(doc.data());
      });
      return res.json(screams);
    })
    .catch((err: any) => console.error(err));
});

export const createScream = functions.https.onRequest((req, res) => {
  // if (req.method !== "POST") {
  //   return res.status(400).json({ error: `Method ${req.method} not allowed` });
  // }
  const newScream = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: admin.firestore.Timestamp.fromDate(new Date())
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

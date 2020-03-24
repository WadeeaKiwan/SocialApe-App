const functions = require("firebase-functions");
const { db } = require("../util/admin");

exports.createNotificationOnLike = () =>
  functions
    .region("europe-west1")
    .firestore.document("likes/{id}")
    .onCreate(async snapshot => {
      try {
        const scream = await db.doc(`/screams/${snapshot.data().screamId}`).get();

        if (!scream.exists) {
          return res.status(404).json({ error: "Scream not found" });
        }

        await db.doc(`notifications/${snapshot.id}`).set({
          createdAt: new Date().toISOString(),
          recipient: scream.data().userHandle,
          sender: snapshot.data().userHandle,
          type: "like",
          read: false,
          screamId: scream.id
        });

        return res.status(200).json();
      } catch (err) {
        console.error(err);
        return res.status(500).json(err.code);
      }
    });

exports.createNotificationOnUnlike = () =>
  functions
    .region("europe-west1")
    .firestore.document("likes/{id}")
    .onDelete(async snapshot => {
      try {
        const scream = await db.doc(`/screams/${snapshot.data().screamId}`).get();

        if (!scream.exists) {
          return res.status(404).json({ error: "Scream not found" });
        }

        await db.doc(`notifications/${snapshot.id}`).delete();

        return res.status(200).json();
      } catch (err) {
        console.error(err);
        return res.status(500).json(err.code);
      }
    });

exports.createNotificationOnComment = () =>
  functions
    .region("europe-west1")
    .firestore.document("comments/{id}")
    .onCreate(async snapshot => {
      try {
        const scream = await db.doc(`/screams/${snapshot.data().screamId}`).get();

        if (!scream.exists) {
          return res.status(404).json({ error: "Scream not found" });
        }

        await db.doc(`notifications/${snapshot.id}`).set({
          createdAt: new Date().toISOString(),
          recipient: scream.data().userHandle,
          sender: snapshot.data().userHandle,
          type: "comment",
          read: false,
          screamId: scream.id
        });

        return res.status(200).json();
      } catch (err) {
        console.error(err);
        return res.status(500).json(err.code);
      }
    });

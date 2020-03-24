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

        if (scream.data().userHandle === snapshot.data().userHandle) {
          return res.status(404).json({ error: "No notification for own scream's like" });
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

        if (scream.data().userHandle === snapshot.data().userHandle) {
          return res.status(404).json({ error: "No notification for own scream's comment" });
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

exports.onUserImageChange = () =>
  functions
    .region("europe-west1")
    .firestore.document("users/{userId}")
    .onUpdate(async change => {
      try {
        console.log(change.before.data());
        console.log(change.after.data());

        if (change.before.data().imageUrl !== change.after.data().imageUrl) {
          console.log("Image has changed");

          const batch = db.batch();
          const ownScreams = await db
            .collection("screams")
            .where("userHandle", "==", change.before.data().handle)
            .get();

          ownScreams.forEach(ownScream => {
            const scream = db.doc(`/screams/${ownScream.id}`);
            batch.update(scream, { userImage: change.after.data().imageUrl });
          });

          return await batch.commit();
        }
        return true;
      } catch (err) {
        console.error(err);
        return res.status(500).json(err.code);
      }
    });

exports.onScreamDelete = () =>
  functions
    .region("europe-west1")
    .firestore.document("screams/{screamId}")
    .onDelete(async (snapshot, context) => {
      try {
        const screamId = context.params.screamId;
        const batch = db.batch();

        const comments = await db
          .collection("comments")
          .where("screamId", "==", screamId)
          .get();

        comments.forEach(Comment => {
          batch.delete(db.doc(`/comments/${Comment.id}`));
        });

        const likes = await db
          .collection("likes")
          .where("screamId", "==", screamId)
          .get();

        likes.forEach(like => {
          batch.delete(db.doc(`/likes/${like.id}`));
        });

        const notifications = await db
          .collection("notifications")
          .where("screamId", "==", screamId)
          .get();

        notifications.forEach(notification => {
          batch.delete(db.doc(`/notifications/${notification.id}`));
        });

        return await batch.commit();
      } catch (err) {
        console.error(err);
        return res.status(500).json(err.code);
      }
    });

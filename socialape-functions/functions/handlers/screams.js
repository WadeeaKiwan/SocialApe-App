const { db } = require("../util/admin");

// Get All Screams
exports.getAllScreams = async (req, res) => {
  try {
    const screams = [];
    const allScreams = await db.collection("screams").orderBy("createdAt", "desc").get();

    allScreams.forEach((scream) => {
      screams.push({
        screamId: scream.id,
        body: scream.data().body,
        userHandle: scream.data().userHandle,
        createdAt: scream.data().createdAt,
        likeCount: scream.data().likeCount,
        commentCount: scream.data().commentCount,
        userImage: scream.data().userImage
        /* OR:
         */
        // ...doc.data()
      });
    });
    return res.status(200).json(screams);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// Create a new scream
exports.postOneScream = async (req, res) => {
  if (req.body.body.trim() === "") {
    return res.status(400).json({ body: "Body must not be empty" });
  }

  try {
    const newScream = {
      body: req.body.body,
      userHandle: req.user.handle,
      userImage: req.user.imageUrl,
      createdAt: new Date().toISOString(),
      likeCount: 0,
      commentCount: 0
    };

    const scream = await db.collection("screams").add(newScream);
    const resScream = newScream;
    resScream.screamId = scream.id;

    return res.status(200).json(resScream);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// Get a scream
exports.getScream = async (req, res) => {
  let screamData = {};

  try {
    const scream = await db.doc(`/screams/${req.params.screamId}`).get();

    if (!scream.exists) {
      return res.status(404).json({ error: "Scream not found" });
    }

    screamData = scream.data();
    screamData.screamId = scream.id;

    const comments = await db
      .collection("comments")
      .orderBy("createdAt", "desc")
      .where("screamId", "==", req.params.screamId)
      .get();

    screamData.comments = [];
    comments.forEach((comment) => {
      screamData.comments.push(comment.data());
    });

    return res.status(200).json(screamData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.code });
  }
};

// Comment on a scream
exports.commentOnScream = async (req, res) => {
  if (req.body.body.trim() === "") {
    return res.status(400).json({ comment: "Body must not be empty" });
  }

  try {
    const scream = await db.doc(`/screams/${req.params.screamId}`).get();

    if (!scream.exists) {
      return res.status(404).json({ error: "Scream not found" });
    }

    const newComment = {
      body: req.body.body,
      screamId: req.params.screamId,
      userHandle: req.user.handle,
      createdAt: new Date().toISOString(),
      userImage: req.user.imageUrl
    };

    await scream.ref.update({ commentCount: scream.data().commentCount + 1 });

    await db.collection("comments").add(newComment);

    return res.status(200).json(newComment);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// Like a scream
exports.likeScream = async (req, res) => {
  try {
    const scream = await db.doc(`/screams/${req.params.screamId}`).get();

    if (!scream.exists) {
      return res.status(404).json({ error: "Scream not found" });
    }

    const likeDocument = await db
      .collection("likes")
      .where("userHandle", "==", req.user.handle)
      .where("screamId", "==", req.params.screamId)
      .limit(1);

    let screamData;

    const liked = await likeDocument.get();

    if (!liked.empty) {
      return res.status(400).json({ error: "Scream already liked" });
    }

    await db.collection("likes").add({
      screamId: req.params.screamId,
      userHandle: req.user.handle,
      createdAt: new Date().toISOString()
    });

    screamData = scream.data();
    screamData.screamId = scream.id;
    screamData.likeCount++;
    await scream.ref.update({ likeCount: screamData.likeCount });

    return res.status(201).json(screamData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.code });
  }
};

// Unlike a scream
exports.unlikeScream = async (req, res) => {
  try {
    const scream = await db.doc(`/screams/${req.params.screamId}`).get();

    if (!scream.exists) {
      return res.status(404).json({ error: "Scream not found" });
    }

    const likeDocument = await db
      .collection("likes")
      .where("userHandle", "==", req.user.handle)
      .where("screamId", "==", req.params.screamId)
      .limit(1);

    let screamData;

    const liked = await likeDocument.get();

    if (liked.empty) {
      return res.status(400).json({ error: "Scream not liked" });
    }

    await db.doc(`/likes/${liked.docs[0].id}`).delete();

    screamData = scream.data();
    screamData.screamId = scream.id;
    screamData.likeCount--;
    await scream.ref.update({ likeCount: screamData.likeCount });

    return res.status(201).json(screamData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.code });
  }
};

// Delete A Scream
exports.deleteScream = async (req, res) => {
  try {
    const scream = await db.doc(`/screams/${req.params.screamId}`).get();

    if (!scream.exists) {
      return res.status(404).json({ error: "Scream not found" });
    }

    if (scream.data().userHandle !== req.user.handle) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await scream.ref.delete();

    return res.status(200).json({ message: `Scream deleted successfully` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.code });
  }
};

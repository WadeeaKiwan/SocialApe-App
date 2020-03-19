const { db } = require("../util/admin");

// Get All Screams
exports.getAllScreams = async (req, res) => {
  try {
    const screams = [];
    const allScreams = await db
      .collection("screams")
      .orderBy("createdAt", "desc")
      .get();

    allScreams.forEach(scream => {
      screams.push({
        screamId: scream.id,
        body: scream.data().body,
        userHandle: scream.data().userHandle,
        createdAt: scream.data().createdAt
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
      createdAt: new Date().toISOString()
    };

    const scream = await db.collection("screams").add(newScream);
    return res.json({ message: `document ${scream.id} created successfully` });
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
    comments.forEach(comment => {
      screamData.comments.push(comment.data());
    });

    res.status(200).json(screamData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.code });
  }
};

// Comment on a scream
exports.commentOnScream = async (req, res) => {
  if (req.body.body.trim() === "") {
    return res.status(400).json({ body: "Body must not be empty" });
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

    await db.collection("comments").add(newComment);

    return res.status(200).json(newComment);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// Delete A Scream
exports.deleteScream = async (req, res) => {
  try {
    const scream = await db.doc(`/screams/${req.params.screamId}`).get();

    if (!scream.exists) {
      return res.status(404).json({ error: "Scream not found" });
    }

    await db.doc(`/screams/${req.params.screamId}`).delete();

    res.status(200).json({ message: `Scream deleted successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.code });
  }
};

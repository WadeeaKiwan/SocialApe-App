const { db } = require("../util/admin");

// Get All Screams
exports.getAllScreams = async (req, res) => {
  try {
    const screams = [];
    const data = await db
      .collection("screams")
      .orderBy("createdAt", "desc")
      .get();

    data.forEach(doc => {
      screams.push({
        screamId: doc.id,
        body: doc.data().body,
        userHandle: doc.data().userHandle,
        createdAt: doc.data().createdAt
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

    const doc = await db.collection("screams").add(newScream);
    return res.json({ message: `document ${doc.id} created successfully` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

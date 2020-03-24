const { admin, db } = require("../util/admin");
const firebase = require("firebase");
// Fetch the firebase configuration from the file
const firebaseConfig = require("../config/firebaseConfig");
firebase.initializeApp(firebaseConfig);

const { validateSignupData, validateLoginData, reduceUserDetails } = require("../util/validators");

// Sign user up
exports.signup = async (req, res) => {
  let token, userId;

  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle
  };

  const { valid, errors } = validateSignupData(newUser);

  if (!valid) {
    return res.status(400).json(errors);
  }

  const noImg = "no-img.png";

  try {
    const handle = await db
      .collection("users")
      .doc(newUser.handle)
      .get();

    if (handle.exists) {
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
      imageUrl: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${noImg}?alt=media`,
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
};

// Log user in
exports.login = async (req, res) => {
  let token;

  const user = {
    email: req.body.email,
    password: req.body.password
  };

  const { valid, errors } = validateLoginData(user);

  if (!valid) {
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
};

// Add user details
exports.addUserDetails = async (req, res) => {
  let userDetails = reduceUserDetails(req.body);

  try {
    await db.doc(`/users/${req.user.handle}`).update(userDetails);
    return res.status(200).json({ message: "Details added successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.code });
  }
};

// Get any user's details
exports.getUserDetails = async (req, res) => {
  let userData = {};

  try {
    const user = await db.doc(`/users/${req.params.handle}`).get();

    if (!user.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    userData.user = user.data();

    const screams = await db
      .collection("screams")
      .where("userHandle", "==", req.params.handle)
      .orderBy("createdAt", "desc")
      .get();

    userData.screams = [];
    screams.forEach(scream => {
      userData.screams.push({
        body: scream.data().body,
        createdAt: scream.data().createdAt,
        userHandle: scream.data().userHandle,
        userImage: scream.data().userImage,
        likeCount: scream.data().likeCount,
        commentCount: scream.data().commentCount,
        screamId: scream.id
      });
    });

    return res.status(200).json(userData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.code });
  }
};

// Get own user details - Firebase will still get the document of a collection by reference even though it's not existed yet
exports.getAuthenticatedUser = async (req, res) => {
  let userData = {};

  try {
    const user = await db.doc(`/users/${req.user.handle}`).get();

    if (!user.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    userData.credentials = user.data();
    const likes = await db
      .collection("likes")
      .where("userHandle", "==", req.user.handle)
      .get();

    userData.likes = [];
    likes.forEach(like => {
      userData.likes.push(like.data());
    });

    const notifications = await db
      .collection("notifications")
      .where("recipient", "==", req.user.handle)
      .orderBy("createdAt", "desc")
      .get();

    userData.notifications = [];
    notifications.forEach(notification => {
      userData.notifications.push({
        recipient: notification.data().recipient,
        sender: notification.data().sender,
        createdAt: notification.data().createdAt,
        screamId: notification.data().screamId,
        type: notification.data().type,
        read: notification.data().read,
        notificationId: notification.id
      });
    });

    return res.status(200).json(userData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.code });
  }
};

// Upload user's profile image
exports.uploadImage = (req, res) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  const busboy = new BusBoy({ headers: req.headers });

  let imageFileName;
  let imageToBeUploaded = {};

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    console.log(fieldname, file, filename, encoding, mimetype);
    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return res.status(400).json({ error: "Wrong file type submitted" });
    }

    // my.image.png => ['my', 'image', 'png']
    const imageExtension = filename.split(".")[filename.split(".").length - 1];
    // 654664832184696.png
    imageFileName = `${Math.round(Math.random() * 1000000000).toString()}.${imageExtension}`;
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filepath, mimetype };
    return file.pipe(fs.createWriteStream(filepath));
  });

  busboy.on("finish", async () => {
    try {
      await admin
        .storage()
        .bucket()
        .upload(imageToBeUploaded.filepath, {
          resumable: false,
          metadata: {
            metadata: {
              contentType: imageToBeUploaded.mimetype
            }
          }
        });

      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`;
      await db.doc(`/users/${req.user.handle}`).update({ imageUrl });

      return res.status(200).json({ message: "Image updated successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.code });
    }
  });
  busboy.end(req.rawBody);
};

// Mark the notifications as read
exports.markNotificationsRead = async (req, res) => {
  try {
    const user = await db.doc(`/users/${req.user.handle}`).get();

    if (!user.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    let batch = db.batch();
    req.body.forEach(notificationId => {
      const notification = db.doc(`/notifications/${notificationId}`);
      batch.update(notification, { read: true });
    });

    await batch.commit();

    return res.status(200).json({ message: "Notifications marked read" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.code });
  }
};

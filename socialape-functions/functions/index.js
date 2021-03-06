const functions = require("firebase-functions");
const cors = require("cors");

const FBAuth = require("./util/fbAuth");

const {
  getAllScreams,
  postOneScream,
  getScream,
  deleteScream,
  commentOnScream,
  likeScream,
  unlikeScream
} = require("./handlers/screams");
const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  getUserDetails,
  markNotificationsRead
} = require("./handlers/users");
const {
  createNotificationOnLike,
  createNotificationOnUnlike,
  createNotificationOnComment,
  onUserImageChange,
  onScreamDelete
} = require("./triggers/triggers");

const app = require("express")();
// Access to selected resources from a different origin
app.use(cors());

// Screams routes
app.get("/screams", getAllScreams);
app.post("/scream", FBAuth, postOneScream);
app.get("/scream/:screamId", getScream);
app.delete("/scream/:screamId", FBAuth, deleteScream);
app.get("/scream/:screamId/like", FBAuth, likeScream);
app.get("/scream/:screamId/unlike", FBAuth, unlikeScream);
app.post("/scream/:screamId/comment", FBAuth, commentOnScream);

// Users routes
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", FBAuth, uploadImage);
app.post("/user", FBAuth, addUserDetails);
app.get("/user", FBAuth, getAuthenticatedUser);
app.get("/user/:handle", getUserDetails);
app.post("/notifications", FBAuth, markNotificationsRead);

// Serve all routes with '/api' 'https://baseUrl.com/api'
exports.api = functions.region("europe-west1").https.onRequest(app);

// Triggers
exports.createNotificationOnLike = createNotificationOnLike();
exports.createNotificationOnUnlike = createNotificationOnUnlike();
exports.createNotificationOnComment = createNotificationOnComment();
exports.onUserImageChange = onUserImageChange();
exports.onScreamDelete = onScreamDelete();

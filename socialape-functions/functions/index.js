const functions = require("firebase-functions");
const cors = require("cors");

const FBAuth = require("./util/fbAuth");

const { getAllScreams, postOneScream } = require("./handlers/screams");
const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser
} = require("./handlers/users");

const app = require("express")();
// Access to selected resources from a different origin
app.use(cors());

// Screams routes
app.get("/screams", getAllScreams);
app.post("/scream", FBAuth, postOneScream);

// Users routes
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", FBAuth, uploadImage);
app.post("/user", FBAuth, addUserDetails);
app.get("/user", FBAuth, getAuthenticatedUser);

// Serve all routes with '/api' 'https://baseUrl.com/api'
exports.api = functions.region("europe-west1").https.onRequest(app);

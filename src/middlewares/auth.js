const admin = require("firebase-admin");
const serviceAccount = require("../config/serviceAccountKey.json")
// Initialize Firebase Admin (run this only once in your project)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

/**
 * Middleware to verify Firebase ID Token from the frontend.
 * Frontend must send token in Authorization header as:
 * Authorization: Bearer <idToken>
 */
const userAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const idToken = authHeader.split(" ")[1]; // Extract token
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    req.user = decodedToken; // Attach user info to request object
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = userAuth;

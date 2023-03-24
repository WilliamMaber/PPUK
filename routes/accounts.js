const express = require("express");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const firebase = require("firebase-admin");
const emailVerification = require("../utils/emailVerification");

const router = express.Router();

// Firebase app initialization
const firebaseApp = firebase.initializeApp({
  credential: firebase.credential.cert(require("../data/firebase.json")),
  databaseURL: "https://your-firebase-app.firebaseio.com",
});

// Firebase Authentication initialization
const firebaseAuth = firebaseApp.auth();

// Registration route
router.post("/register", async (req, res, next) => {
  const {
    firstName,
    lastName,
    dateOfBirth,
    email,
    phoneNumber,
    password,
    address,
  } = req.body;

  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user in Firebase Authentication
    const userRecord = await firebaseAuth.createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
      phoneNumber,
      emailVerified: false,
    });

    // Add user details to Firestore database
    const db = firebaseApp.firestore();
    await db.collection("users").doc(userRecord.uid).set({
      firstName,
      lastName,
      dateOfBirth,
      email,
      phoneNumber,
      address,
      isAdmin: false,
      isNEC: false,
      isInGoodStanding: true,
      isVolunteer: false,
      subscriptionTier: "standard",
    });

    // Send email verification
    const verificationLink = await emailVerification.createVerificationLink(
      userRecord.email
    );
    await emailVerification.sendVerificationEmail(
      userRecord.email,
      verificationLink
    );

    res.send({
      message:
        "Registration successful. Please check your email for verification link.",
    });
  } catch (err) {
    next(err);
  }
});

// Login route
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(400).send({ message: info.message });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.send({ message: "Login successful." });
    });
  })(req, res, next);
});

// Logout route
router.post("/logout", (req, res) => {
  req.logOut();
  res.send({ message: "Logout successful." });
});

// Email verification route
router.get("/verify-email", async (req, res, next) => {
  const { oobCode } = req.query;

  try {
    const email = await emailVerification.verifyEmail(oobCode);
    const userRecord = await firebaseAuth.getUserByEmail(email);
    await firebaseAuth.updateUser(userRecord.uid, { emailVerified: true });
    res.send({ message: "Email verification successful." });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

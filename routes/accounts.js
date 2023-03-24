const express = require("express");
const admin = require("firebase-admin");
const passport = require("passport");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const stripe = require("../utils/stripe");
const emailVerification = require("../utils/emailVerification");
const isLoggedIn = require("../utils/isLoggedIn");

const router = express.Router();

// Render login page
router.get("/login", (req, res) => {
  res.render("login");
});

// Handle login form submission
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

// Render registration page
router.get("/register", (req, res) => {
  res.render("register");
});

// Handle registration form submission
router.post(
  "/register",
  body("firstName")
    .trim()
    .isLength({ min: 1 })
    .withMessage("First name is required"),
  body("lastName")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Last name is required"),
  body("dob").isDate().withMessage("Invalid date of birth"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email address")
    .custom(async (value) => {
      const snapshot = await admin
        .firestore()
        .collection("users")
        .doc(value)
        .get();
      if (snapshot.exists) {
        return Promise.reject("Email address is already in use");
      }
    }),
  body("phone")
    .trim()
    .isMobilePhone("en-GB")
    .withMessage("Invalid phone number"),
  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("register", { errors: errors.array() });
    }
    const { firstName, lastName, dob, email, phone, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName: `${firstName} ${lastName}`,
      });
      const emailVerificationToken =
        await emailVerification.generateEmailVerificationToken(email);
      await admin.firestore().collection("users").doc(email).set({
        firstName,
        lastName,
        dob,
        email,
        phone,
        emailVerificationToken,
      });
      await emailVerification.sendEmailVerification(
        emailVerificationToken,
        email
      );
      req.flash(
        "success",
        "Account created successfully. Please check your email for verification instructions."
      );
      res.redirect("/login");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/register");
    }
  }
);

// Handle logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;

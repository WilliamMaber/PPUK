const express = require("express");
const router = express.Router();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/User.js");

// Configure passport with a local authentication strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "email", // Use email as username
      passwordField: "password",
    },
    function (email, password, done) {
      // Find the user with the matching email
      User.findOne({ email: email }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: "Incorrect email or password." });
        }
        // Verify the password
        user.verifyPassword(password, function (err, isMatch) {
          if (err) {
            return done(err);
          }
          if (!isMatch) {
            return done(null, false, {
              message: "Incorrect email or password.",
            });
          }
          return done(null, user);
        });
      });
    }
  )
);

// Configure passport to serialize and deserialize user sessions
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

// Render the login page
router.get("/login", function (req, res) {
  res.render("auth/login", { title: "Log in", user: req.user });
});

// Process the login form
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
  })
);

// Render the signup page
router.get("/signup", function (req, res) {
  res.render("auth/signup", { title: "Sign up",user:req.user });
});

// Process the signup form
router.post("/signup", function (req, res, next) {
  const { firstName, lastName, email, password } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !email || !password) {
    req.flash("error", "All fields are required.");
    return res.redirect("/auth/signup");
  }

  // Create a new user
  const newUser = new User({
    firstName,
    lastName,
    email,
    password,
  });

  // Save the user to the database
  newUser.save(function (err) {
    if (err) {
      req.flash("error", "Error creating user. Please try again later.");
      return res.redirect("/auth/signup");
    }

    // Log the user in after successful signup
    req.logIn(newUser, function (err) {
      if (err) {
        return next(err);
      }
      return res.redirect("/");
    });
  });
});

// Process the logout request
router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;

const express = require("express");
const router = express.Router();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const saltRounds = 50;
const User = require("../models/User.js");

// Set up passport local strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: "Incorrect email or password." });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: "Incorrect email or password." });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});



router.post("/signup", async (req, res, next) => {
  const { firstName, lastName, dob, address, email, phone, password } =
    req.body;
  if (
    !firstName ||
    !lastName ||
    !dob ||
    !address ||
    !email ||
    !phone ||
    !password
  ) {
    return res.status(400).send("Missing required fields.");
  }
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await User.create({
      firstName,
      lastName,
      dob,
      address,
      email,
      phone,
      password: hashedPassword,
    });
    req.login(user, (err) => {
      if (err) return next(err);
      return res.redirect("/");
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).send("Email already registered.");
    }
    next(err);
  }
});
router.get("/signup", (req, res) => {
  res.render("signup", { title: "Signup", error: false });
});
// User login/logout routes
router.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
    failureFlash: true,
  })
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = { userRouter: router, User: User };

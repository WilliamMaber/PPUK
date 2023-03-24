const express = require("express");
const admin = require("firebase-admin");
const isLoggedIn = require("../utils/isLoggedIn");

const router = express.Router();

// Render user profile page
router.get("/profile", isLoggedIn, async (req, res) => {
  const user = await admin.auth().getUser(req.user.uid);
  const userData = await admin
    .firestore()
    .collection("users")
    .doc(user.email)
    .get();
  res.render("profile", { user, userData });
});

// Update user profile
router.post("/profile", isLoggedIn, async (req, res) => {
  const { firstName, lastName, dob, phone, homeAddress } = req.body;
  const { uid } = req.user;
  const { line1, line2, city, county, postcode, country } =
    await findAddressByPostcode(homeAddress.postcode);
  try {
    await admin
      .auth()
      .updateUser(uid, { displayName: `${firstName} ${lastName}` });
    await admin.firestore().collection("users").doc(req.user.email).update({
      firstName,
      lastName,
      dob,
      phone,
      homeAddress: {
        line1,
        line2,
        city,
        county,
        postcode,
        country,
      },
    });
    req.flash("success", "Profile updated successfully");
    res.redirect("/profile");
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/profile");
  }
});

// Delete user account
router.post("/profile/delete", isLoggedIn, async (req, res) => {
  const { uid, email } = req.user;
  try {
    await admin.auth().deleteUser(uid);
    await admin.firestore().collection("users").doc(email).delete();
    req.flash("success", "Account deleted successfully");
    res.redirect("/");
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/profile");
  }
});

module.exports = router;

const express = require("express");
const stripe = require("stripe")(require("../data/stripe.json").secret_key);
const admin = require("firebase-admin");
const isLoggedIn = require("../utils/isLoggedIn");

const router = express.Router();

// Render subscription page
router.get("/", isLoggedIn, async (req, res) => {
  const user = await admin
    .firestore()
    .collection("users")
    .doc(req.user.email)
    .get();
  const subscription = user.data().subscription;
  res.render("subscription", { subscription });
});

// Handle subscription payment
router.post("/", isLoggedIn, async (req, res) => {
  const user = await admin
    .firestore()
    .collection("users")
    .doc(req.user.email)
    .get();
  const { tier } = req.body;
  let amount;
  switch (tier) {
    case "custom":
      amount = 8000;
      break;
    case "high":
      amount = 8000;
      break;
    case "standard":
      amount = 4000;
      break;
    case "reduced":
      amount = 1200;
      break;
    case "concessionary":
      amount = 600;
      break;
    default:
      amount = 0;
  }
  if (amount === 0) {
    req.flash("error", "Invalid subscription tier");
    res.redirect("/accounts/subscription");
  } else {
    try {
      const session = await stripe.checkout.sessions.create({
        customer_email: req.user.email,
        payment_method_types: ["card"],
        line_items: [
          {
            name: `Subscription (${tier} tier)`,
            amount,
            currency: "gbp",
            quantity: 1,
          },
        ],
        success_url: "http://localhost:3000/accounts/subscription?success=true",
        cancel_url: "http://localhost:3000/accounts/subscription?success=false",
      });
      await admin
        .firestore()
        .collection("users")
        .doc(req.user.email)
        .update({ subscription: { tier, sessionId: session.id } });
      res.redirect(session.url);
    } catch (err) {
      console.log(err);
      req.flash("error", "Failed to create checkout session");
      res.redirect("/accounts/subscription");
    }
  }
});

module.exports = router;

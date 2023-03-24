const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const router = express.Router();
const firestore = require('../utils/firestore');
const stripe = require('../utils/stripe');
const emailVerification = require('../utils/emailVerification');

// Render registration form
router.get('/register', (req, res) => {
  res.render('register');
});

// Handle registration form submission
router.post('/register', async (req, res) => {
  try {
    // Extract user details from form data
    const { firstName, lastName, email, password, dob, phoneNumber, homeAddress } = req.body;

    // Hash password using bcrypt
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user in Firestore
    const userDoc = await firestore.createUser({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      dob,
      phoneNumber,
      homeAddress,
      role: 'user',
      status: 'not_verified',
    });

    // Send email verification link
    await emailVerification.sendVerificationEmail(userDoc.id, email);

    // Redirect to login page
    res.redirect('/accounts/login');
  } catch (err) {
    console.error(err);
    res.render('register', { error: err.message });
  }
});

// Render login form
router.get('/login', (req, res) => {
  res.render('login');
});

// Handle login form submission
router.post('/login', passport.authenticate('local', {
  successRedirect: '/accounts/dashboard',
  failureRedirect: '/accounts/login',
  failureFlash: true,
}));

// // Render dashboard page
// router.get('/dashboard', passport.authenticationMiddleware(), (req, res) => {
//   res.render('dashboard', { user: req.user });
// });

// Handle user logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// // Render subscription page
// router.get('/subscription', passport.authenticationMiddleware(), async (req, res) => {
//   try {
//     // Retrieve user's subscription data
//     const subscription = await stripe.getSubscription(req.user.stripeSubscriptionId);

//     // Render subscription page with subscription data
//     res.render('subscription', { subscription });
//   } catch (err) {
//     console.error(err);
//     res.render('subscription', { error: err.message });
//   }
// });

// // Handle subscription form submission
// router.post('/subscription', passport.authenticationMiddleware(), async (req, res) => {
//   try {
//     // Extract subscription tier and billing period from form data
//     const { tier, period } = req.body;

//     // Calculate price based on subscription tier and billing period
//     let price;
//     switch (tier) {
//       case 'high':
//         price = period === 'monthly' ? 444 : 8000;
//         break;
//       case 'standard':
//         price = period === 'monthly' ? 333 : 4000;
//         break;
//       case 'reduced':
//         price = period === 'monthly' ? 100 : 1200;
//         break;
//       case 'concessionary':
//         price = period === 'monthly' ? 50 : 600;
//         break;
//       default:
//         throw new Error(`Invalid subscription tier: ${tier}`);
//     }

//     // Create or update user's subscription in Stripe
//     const subscription = await stripe.createOrUpdateSubscription(req.user.stripeCustomerId, price, period);

//     // Update user's subscription data in Firestore
//     await firestore.updateUser(req.user.id, { stripeSubscriptionId: subscription.id });

//     // Redirect to subscription page with success message
//     res.render('subscription', { subscription, success: 'Subscription updated successfully' });
//   } catch (err) {
//     console.error(err);
//     res.render('subscription', { error: err.message });
//   }
// });

module.exports = router;

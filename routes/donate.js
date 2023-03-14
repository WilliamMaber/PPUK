const express = require("express");
const app = express();
const stripe = require("stripe")("your_stripe_secret_key");
const { google } = require("googleapis");
// Set up the Google Pay API client
const googlePayClient = new payments.v1.PaymentsAPIClient({
  paymentGateway: {
    name: 'stripe',
    stripe: {
      stripeSecretKey: 'your_stripe_secret_key'
    }
  }
});
const payments = google.payments;
// Create a Stripe payment session endpoint
app.post("/stripe/session", async (req, res) => {
  // Retrieve the donation amount and currency from the POST parameters
  const amount = req.body.amount;
  const currency = req.body.currency;

  // Create a line item for the donation
  const lineItem = {
    name: "Donation",
    amount: amount * 100,
    currency: currency,
    quantity: 1,
  };

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [lineItem],
    success_url: "https://your-website.com/donation-success",
    cancel_url: "https://your-website.com/donation-cancel",
  });

  // Return the Stripe payment session ID to the client
  res.json({ id: session.id });
});


// Create a Google Pay payment session endpoint
app.post('/googlepay/session', async (req, res) => {
  // Retrieve the donation amount and currency from the POST parameters
  const amount = req.body.amount;
  const currency = req.body.currency;

  // Create a Google Pay payment request
  const paymentRequest = {
    apiVersion: 2,
    apiVersionMinor: 0,
    allowedPaymentMethods: [{
      type: 'CARD',
      parameters: {
        allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
        allowedCardNetworks: ['AMEX', 'DISCOVER', 'MASTERCARD', 'VISA']
      },
      tokenizationSpecification: {
        type: 'PAYMENT_GATEWAY',
        parameters: {
          gateway: 'stripe',
          stripe: {
            publishableKey: 'your_stripe_publishable_key'
          }
        }
      }
    }],
    merchantInfo: {
      merchantId: 'your_merchant_id',
      merchantName: 'Your Merchant Name'
    },
    transactionInfo: {
      totalPriceStatus: 'FINAL',
      totalPrice: `${amount.toFixed(2)}`,
      currencyCode: currency
    },
    callbackIntents: ['PAYMENT_AUTHORIZATION']
  };

  try {
    // Create a Google Pay payment session
    const response = await googlePayClient.createPaymentSession({
      parent: 'your_google_pay_merchant_account',
      request: paymentRequest
    });

    // Return the Google Pay payment session ID to the client
    res.json({ id: response.data.paymentSession.id });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});
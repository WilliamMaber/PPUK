const stripe = require("stripe");
const stripeConfig = require("../data/stripe.json");

// initialize Stripe with the secret key from the configuration file
const stripeInstance = stripe(stripeConfig.secretKey);

/**
 * Creates a new Stripe customer with the given email address and payment source.
 * @param {string} email The email address of the customer.
 * @param {string} paymentSource The payment source ID or token for the customer's payment method.
 * @returns {Promise<import('stripe').customers.ICustomer>} A Promise that resolves with the created customer object.
 */
async function createCustomer(email, paymentSource) {
  const customer = await stripeInstance.customers.create({
    email,
    source: paymentSource,
  });
  return customer;
}

/**
 * Subscribes the given customer to the specified subscription plan.
 * @param {string} customerId The ID of the customer to subscribe.
 * @param {string} planId The ID of the subscription plan to subscribe to.
 * @returns {Promise<import('stripe').subscriptions.ISubscription>} A Promise that resolves with the created subscription object.
 */
async function subscribeCustomer(customerId, planId) {
  const subscription = await stripeInstance.subscriptions.create({
    customer: customerId,
    items: [
      {
        plan: planId,
      },
    ],
  });
  return subscription;
}

module.exports = { createCustomer, subscribeCustomer };

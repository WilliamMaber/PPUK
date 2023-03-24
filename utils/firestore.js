const firebase = require("firebase/app");
const serviceAccount = require("../data/Firestore.json");
// initialize Firebase Admin with the credentials from the configuration file
const app = firebase.initializeApp(serviceAccount);
// get a reference to the Firestore database

const db = app;

/**
 * Creates a new user in Firestore with the specified data.
 * @param {string} firstName The first name of the user.
 * @param {string} lastName The last name of the user.
 * @param {string} email The email address of the user.
 * @param {string} password The password of the user.
 * @param {Object} address An object containing the user's address data.
 * @returns {Promise<string>} A Promise that resolves with the ID of the created user document.
 */
async function createUser(firstName, lastName, email, password, address) {
  const userRef = db.collection("users").doc();
  await userRef.set({
    firstName,
    lastName,
    email,
    password,
    address,
  });
  return userRef.id;
}

/**
 * Retrieves a user from Firestore by their email address.
 * @param {string} email The email address of the user to retrieve.
 * @returns {Promise<Object>} A Promise that resolves with the user object, or null if no user was found.
 */
async function getUserByEmail(email) {
  const querySnapshot = await db
    .collection("users")
    .where("email", "==", email)
    .get();
  if (querySnapshot.empty) {
    return null;
  } else {
    const userDoc = querySnapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() };
  }
}

module.exports = { createUser, getUserByEmail };

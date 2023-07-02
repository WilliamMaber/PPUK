import React, { useState } from "react";
import firebase from "firebase/app";
import { getAuth } from "firebase/auth";
import { createCheckoutSession } from "@stripe/firestore-stripe-payments";
import { getStripePayments } from "@stripe/firestore-stripe-payments";
import { doc, collection, getFirestore, setDoc } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  // Add your Firebase config here
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const payments = getStripePayments(app, {
  productsCollection: "products",
  customersCollection: "customers",
});
const DonationForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [address3, setAddress3] = useState("");
  const [address4, setAddress4] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [country, setCountry] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);

  auth.onAuthStateChanged(async (user) => {
    if (user) {
      const documentRef = doc(db, "user", user.uid);
      const documentSnapshot = await getDoc(documentRef);
      if (documentSnapshot.exists()) {
        const data = documentSnapshot.data();
        setFirstName(data[""]);
        setLastName(data[""]);
        setEmail(data[""]);
        setAddress1(data[""][""]);
        setAddress2(data[""][""]);
        setAddress3(data[""][""]);
        setAddress4(data[""][""]);
        setCity(data[""][""]);
        setPostcode(data[""][""]);
        setCountry(data[""][""]);
      }
    } 
  });
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Save donation data to

    const uid = userCredential.user.uid;
    const DonationsCollectionRef = collection(db, "donations");
    await setDoc(doc(DonationsCollectionRef, uid), data);
    firebase
      .firestore()
      .collection("donations")
      .add({
        firstName,
        lastName,
        email,
        amount: parseFloat(amount),
        address: {
          addressLines: [address1, address2, address3, address4],
          postalCode: postcode,
          locality: city,
          regionCode: country,
        },
        isRecurring,
      });
    createCheckoutSession;
    // Reset form fields
    setFirstName("");
    setLastName("");
    setEmail("");
    setAmount("");
    setAddress1("");
    setAddress2("");
    setAddress3("");
    setCity("");
    setPostcode("");
    setCountry("");
    setIsRecurring(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="firstName">First Name:</label>
        <input
          type="text"
          className="form-control"
          id="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="lastName">Last Name:</label>
        <input
          type="text"
          className="form-control"
          id="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          className="form-control"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="amount">Amount:</label>
        <input
          type="number"
          className="form-control"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="address1">Address Line 1:</label>
        <input
          type="text"
          className="form-control"
          id="address1"
          value={address1}
          onChange={(e) => setAddress1(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="address2">Address Line 2:</label>
        <input
          type="text"
          className="form-control"
          id="address2"
          value={address2}
          onChange={(e) => setAddress2(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="address4">Address Line 4:</label>
        <input
          type="text"
          className="form-control"
          id="address4"
          value={address4}
          onChange={(e) => setAddress4(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="address3">Address Line 3:</label>
        <input
          type="text"
          className="form-control"
          id="address3"
          value={address3}
          onChange={(e) => setAddress3(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="address4">Address Line 4:</label>
        <input
          type="text"
          className="form-control"
          id="address4"
          value={address4}
          onChange={(e) => setAddress4(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="city">City:</label>
        <input
          type="text"
          className="form-control"
          id="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="postcode">Postcode:</label>
        <input
          type="text"
          className="form-control"
          id="postcode"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="country">Country:</label>
        <input
          type="text"
          className="form-control"
          id="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
      </div>
      <div className="form-check">
        <input
          type="checkbox"
          className="form-check-input"
          id="recurring"
          checked={isRecurring}
          onChange={(e) => setIsRecurring(e.target.checked)}
        />
        <label className="form-check-label" htmlFor="recurring">
          Make This Recurring
        </label>
      </div>
      <button type="submit" className="btn btn-primary">
        Donate
      </button>
    </form>
  );
};

export default DonationForm;

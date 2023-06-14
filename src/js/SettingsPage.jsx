import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, getDocs, getDoc } from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDL2CHHhPUg9K6_tV_5Z2bUl4wWcB3-sic",
  authDomain: "ptate-df901.firebaseapp.com",
  projectId: "ptate-df901",
  storageBucket: "ptate-df901.appspot.com",
  messagingSenderId: "795297920122",
  appId: "1:795297920122:web:9cfd9b972dc92213dd77c3",
  measurementId: "G-9MPXZR194T",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const SettingsPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [county, setCounty] = useState("");
  const [postcode, setPostcode] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);

        // Load user settings from Firestore
        const firestore = getFirestore(app);
        const userSettingsRef = doc(firestore, "users", authUser.uid);
        console.log(userSettingsRef);

        getDoc(userSettingsRef)
          .then((doc) => {
            console.log(doc);
            if (doc.exists()) {
              const data = doc.data();
              console.log(data);
              setFirstName(data.firstName || "");
              setLastName(data.lastName || "");
              setDob(data.dob || "");
              setAddress1(data.address1 || "");
              setAddress2(data.address2 || "");
              setCity(data.city || "");
              setCounty(data.county || "");
              setPostcode(data.postcode || "");
              setCountry(data.country || "");
              setEmail(data.email || "");
              setPhone(data.phone || "");
            }
          })
          .catch((error) => {
            console.error("Error loading user settings:", error);
          });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

const handleDeleteAccount = () => {
  if (!user) {
    console.error("User not logged in");
    return;
  }

  user.delete()
    .then(() => {
      console.log("User account deleted successfully");
    })
    .catch((error) => {
      console.error("Error deleting user account:", error);
    });
};
  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      console.error("User not logged in");
      return;
    }

    const firestore = getFirestore(app);
    const userSettingsRef = collection("users").doc(user.uid);

    const settingsData = {
        firstName,
        lastName,
        dob,
        address1,
        address2,
        city,
        county,
        postcode,
        country,
        email,
        phone,
    };

    userSettingsRef
      .set(settingsData, { merge: true })
      .then(() => {
        console.log("Settings saved successfully");
      })
      .catch((error) => {
        console.error("Error saving settings:", error);
      });

    // Clear form fields after submission
  };

  return (
    <form onSubmit={handleFormSubmit} className="container pb-5 mb-5">
      <h1>Settings</h1>
        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            className="form-control"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            className="form-control"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="dob">Date of Birth:</label>
          <input
            type="date"
            id="dob"
            name="dob"
            className="form-control"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address line 1:</label>
          <input
            type="text"
            id="address1"
            name="address1"
            className="form-control"
            value={address1}
            onChange={(e) => setAddress1(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address line 2:</label>
          <input
            type="text"
            id="address2"
            name="address2"
            className="form-control"
            value={address2}
            onChange={(e) => setAddress2(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="city">City:</label>
          <input
            type="text"
            id="city"
            name="city"
            className="form-control"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="county">County:</label>
          <input
            type="text"
            id="county"
            name="county"
            className="form-control"
            value={county}
            onChange={(e) => setCounty(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="postcode">Postcode:</label>
          <input
            type="text"
            id="postcode"
            name="postcode"
            className="form-control"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="country">Country:</label>
          <input
            type="text"
            id="country"
            name="country"
            className="form-control"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="form-control"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
  <button type="submit" className="btn btn-primary">
    Save
  </button>
  <button type="button" className="btn btn-danger" onClick={handleDeleteAccount}>
    Delete Account
  </button>
    </form>
  );
};

export default SettingsPage;

import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, collection, getFirestore,addDoc } from "firebase/firestore";
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
const db = getFirestore(app);

const Register = () => {
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
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [membershipRate, setMembershipRate] = useState("");

  const validateForm = () => {
    let isValid = true;

    // Validate first name
    if (firstName.trim() === "") {
      isValid = false;
    } else {
    }

    // Validate last name
    if (lastName.trim() === "") {
      isValid = false;
    } else {
    }

    // Validate date of birth
    if (dob.trim() === "") {
      isValid = false;
    } else {
    }

    // Validate address line 1
    if (address1.trim() === "") {
      isValid = false;
    } else {
    }

    // Validate address line 2
    if (address2.trim() === "") {
      isValid = false;
    } else {
    }

    // Validate city
    if (city.trim() === "") {
      isValid = false;
    } else {
    }

    // Validate county
    if (county.trim() === "") {
      isValid = false;
    } else {
    }

    // Validate postcode
    if (postcode.trim() === "") {
      isValid = false;
    } else {
    }

    // Validate country
    if (country.trim() === "") {
      isValid = false;
    } else {
    }

    // Validate email
    if (email.trim() === "") {
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      isValid = false;
    } else {
    }

    // Validate phone number
    if (phone.trim() === "") {
      isValid = false;
    } else {
    }

    // Validate password
    if (password === "") {
      isValid = false;
    } else if (password.length < 6) {
      isValid = false;
    } else {
    }

    // Validate repeat password
    if (repeatPassword === "") {
      isValid = false;
    } else if (repeatPassword !== password) {
      isValid = false;
    } else {
    }

    // Validate membership rate
    if (membershipRate === "") {
      isValid = false;
    } else {
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm) {
      return false;
    }

    // Create a new Firebase user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Save user registration data to Firestore
    const DocumentRef = doc(db, "users", userCredential.user.uid);
    try {
      const docRef = await addDoc(collection(db, "users"), {
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
        membershipRate,
        "uid":userCredential.user.uid
      });
    } catch (error) {
      userCredential.user.delete();
      console.error("Error:", error);
      return;
    }
    try {
      // Create a Stripe checkout session
      const response = await fetch("/register/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
          membershipRate,
          userId: userCredential.user.uid, // Pass the user ID to the server
        }),
      });

      if (response.ok) {
        const session = await response.json();
        // Redirect to the Stripe checkout page
        window.location.href = session.url;
      } else {
        // Handle the error case
        console.error("Error creating checkout session");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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

      <div className="form-group">
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="repeatPassword">Repeat Password:</label>
        <input
          type="password"
          id="repeatPassword"
          name="repeatPassword"
          className="form-control"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
        />
      </div>

      <div className="form-group border">
        <div className="row" data-toggle="buttons">
          <div className="col-sm-3 mb-3 mb-sm-0">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">
                  Volunteer and Special Case Membership
                </h5>
                <p className="card-text">
                  Pirate Party UK recognizes the importance of inclusivity and
                  understands that individuals may have unique circumstances
                  that require special consideration. With the Volunteer and
                  Special Case Membership, we offer a membership option that
                  embraces diversity and ensures active participation for all.
                  This Membership will not be able to run in party elections or
                  vote in party elections without being an approved special
                  case.
                </p>
              </div>
              <input
                type="radio"
                className="btn-check btn"
                name="rate"
                id="rate_volunteer"
                value="volunteer"
                onChange={(e) => setMembershipRate(e.target.value)}
              />
              <label
                className="btn btn-outline-primary"
                htmlFor="rate_volunteer"
              >
                Free for volunteer
              </label>
            </div>
          </div>

          <div className="col-sm-3 mb-3 mb-sm-0">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Reduced Membership</h5>
                <p className="card-text">
                  Choose the discounted membership option and become a valued
                  member of the Pirate Party UK at a reduced price. With
                  discounted membership, you enjoy all the benefits and
                  privileges available to full members, including the ability to
                  vote in party elections and contribute to decision-making
                  processes. By selecting this membership, you show your support
                  for the party while benefiting from a reduced membership fee.
                </p>
              </div>
              <input
                type="radio"
                className="btn-check btn"
                name="rate"
                id="reduced_month"
                value="reduced_month"
                onChange={(e) => setMembershipRate(e.target.value)}
              />
              <label
                className="btn btn-outline-primary"
                htmlFor="reduced_month"
              >
                Month £2
              </label>
              <input
                type="radio"
                className="btn-check btn"
                name="rate"
                id="reduced_year"
                value="reduced_year"
                onChange={(e) => setMembershipRate(e.target.value)}
              />
              <label className="btn btn-outline-primary" htmlFor="reduced_year">
                Year £24
              </label>
            </div>
          </div>

          <div className="col-sm-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Standard Membership</h5>
                <p className="card-text">
                  Become a Standard member of the Pirate Party UK and enjoy all
                  the benefits and privileges, including the ability to vote in
                  party elections and contribute to decision-making processes.
                </p>
              </div>
              <input
                type="radio"
                className="btn-check btn"
                name="rate"
                id="standard_month"
                value="standard_month"
                onChange={(e) => setMembershipRate(e.target.value)}
              />
              <label
                className="btn btn-outline-primary"
                htmlFor="standard_month"
              >
                Month £5
              </label>
              <input
                type="radio"
                className="btn-check btn"
                name="rate"
                id="standard_year"
                value="standard_year"
                onChange={(e) => setMembershipRate(e.target.value)}
              />
              <label
                className="btn btn-outline-primary"
                htmlFor="standard_year"
              >
                Year £60
              </label>
            </div>
          </div>
        </div>
      </div>
      <button type="submit" className="btn btn-primary">
        Make it so
      </button>
    </form>
  );
};

export default Register;

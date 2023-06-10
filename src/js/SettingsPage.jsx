import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import 'firebase/auth';
const firebaseConfig = {
  apiKey: "AIzaSyDL2CHHhPUg9K6_tV_5Z2bUl4wWcB3-sic",
  authDomain: "ptate-df901.firebaseapp.com",
  projectId: "ptate-df901",
  storageBucket: "ptate-df901.appspot.com",
  messagingSenderId: "795297920122",
  appId: "1:795297920122:web:9cfd9b972dc92213dd77c3",
  measurementId: "G-9MPXZR194T"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const SettingsPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [date, setDate] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth,(authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      console.error('User not logged in');
      return;
    }

    const firestore = getFirestore(app);
    const userSettingsRef = collection('userSettings').doc(user.uid);

    const settingsData = {
      firstName,
      lastName,
      date,
      address,
      email,
      phone,
      password,
      currentPassword,
    };

    userSettingsRef
      .set(settingsData, { merge: true })
      .then(() => {
        console.log('Settings saved successfully');
      })
      .catch((error) => {
        console.error('Error saving settings:', error);
      });

    // Clear form fields after submission
    setFirstName('');
    setLastName('');
    setDate('');
    setAddress('');
    setEmail('');
    setPhone('');
    setPassword('');
    setCurrentPassword('');
  };

  return (
    <div className="container pb-5 mb-5">
      <h1>Settings</h1>
      <form onSubmit={handleFormSubmit}>
        {/* Form fields */}
        {/* ... */}
        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </form>
    </div>
  );
};

export default SettingsPage;

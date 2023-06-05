import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';

// Initialize Firebase
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
const firestore = getFirestore(app);

const MemberDirectory = () => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const unsubscribe = collection('members').onSnapshot((snapshot) => {
      const memberData = snapshot.docs.map((doc) => doc.data());
      setMembers(memberData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div>
      <h1>Member Directory</h1>
      <ul>
        {members.map((member) => (
          <li key={member.id}>
            <h3>{member.name}</h3>
            <p>Email: {member.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MemberDirectory;

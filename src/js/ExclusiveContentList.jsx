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

const ExclusiveContentList = () => {
  const [exclusiveContent, setExclusiveContent] = useState([]);

  useEffect(() => {
    const exclusiveContentRef = collection('exclusiveContent');
    const unsubscribe = exclusiveContentRef.onSnapshot((snapshot) => {
      const contentData = snapshot.docs.map((doc) => doc.data());
      setExclusiveContent(contentData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div>
      <h1>Exclusive Content</h1>
      {exclusiveContent.map((item) => (
        <div key={item.id}>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  );
};

export default ExclusiveContentList;

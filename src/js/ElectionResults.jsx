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

const ElectionResults = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const resultsRef = collection('results');
    const unsubscribe = resultsRef.onSnapshot((snapshot) => {
      const resultsData = snapshot.docs.map((doc) => doc.data());
      setResults(resultsData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div>
      <h1>Election Results</h1>
      <table>
        <thead>
          <tr>
            <th>Candidate</th>
            <th>Votes</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={index}>
              <td>{result.candidate}</td>
              <td>{result.votes}</td>
              <td>{result.percentage}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ElectionResults;

import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import CandidateDetails from './CandidateDetails.jsx';

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

const app = initializeApp
const firestore = firebase.firestore();

const CandidatesPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    const unsubscribe = collection('candidates').onSnapshot((snapshot) => {
      const candidatesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCandidates(candidatesData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleCandidateClick = (candidateId) => {
    const selected = candidates.find(candidate => candidate.id === candidateId);
    setSelectedCandidate(selected);
  };

  return (
    <div>
      <h1>Candidates</h1>
      <ul>
        {candidates.map(candidate => (
          <li key={candidate.id}>
            <span>{candidate.name}</span>
            <button onClick={() => handleCandidateClick(candidate.id)}>View Details</button>
          </li>
        ))}
      </ul>
      {selectedCandidate && <CandidateDetails candidate={selectedCandidate} />}
    </div>
  );
};

export default CandidatesPage;

import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// Initialize Firebase app with your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDL2CHHhPUg9K6_tV_5Z2bUl4wWcB3-sic",
  authDomain: "ptate-df901.firebaseapp.com",
  projectId: "ptate-df901",
  storageBucket: "ptate-df901.appspot.com",
  messagingSenderId: "795297920122",
  appId: "1:795297920122:web:9cfd9b972dc92213dd77c3",
  measurementId: "G-9MPXZR194T"
};
if (!firebase.apps.length) {
  const app = initializeApp(firebaseConfig);
}

const VotingPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [preferences, setPreferences] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    const candidatesRef = firebase.firestore().collection('candidates');
    try {
      const snapshot = await candidatesRef.get();
      const candidatesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCandidates(candidatesData);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
  };

  const handlePreferenceChange = (candidateId, preference) => {
    setPreferences((prevPreferences) => ({
      ...prevPreferences,
      [candidateId]: preference,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const preferencesRef = firebase.firestore().collection('preferences');
    try {
      await preferencesRef.add(preferences);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting vote:', error);
    }
  };

  return (
    <div className="container pb-5 mb-5">
      <h1>Voting</h1>
      {submitted ? (
        <p>Your vote has been submitted. Thank you!</p>
      ) : (
        <form onSubmit={handleFormSubmit}>
          <p>Input your preferences:</p>
          {candidates.map((candidate) => (
            <div key={candidate.id} className="mb-3">
              <label htmlFor={`preference-${candidate.id}`} className="form-label">
                {candidate.name}
              </label>
              <input
                type="number"
                className="form-control"
                id={`preference-${candidate.id}`}
                min="1"
                max={candidates.length}
                value={preferences[candidate.id] || ''}
                onChange={(e) => handlePreferenceChange(candidate.id, parseInt(e.target.value))}
              />
            </div>
          ))}
          <button type="submit" className="btn btn-primary mt-3">
            Submit Vote
          </button>
        </form>
      )}
    </div>
  );
};

export default VotingPage;

import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore';

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

const AdminElectionCreation = () => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [newCandidate, setNewCandidate] = useState('');

  useEffect(() => {
    const unsubscribe = collection('candidates').onSnapshot((snapshot) => {
      const candidatesData = snapshot.docs.map((doc) => doc.data().name);
      setCandidates(candidatesData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleCandidateChange = (e) => {
    setNewCandidate(e.target.value);
  };

  const handleAddCandidate = () => {
    if (newCandidate.trim() !== '') {
      setCandidates([...candidates, newCandidate]);
      setNewCandidate('');

      collection('candidates').add({ name: newCandidate })
        .then(() => {
          console.log('Candidate added successfully');
        })
        .catch((error) => {
          console.error('Error adding candidate:', error);
        });
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const electionData = {
      startTime,
      endTime,
      candidates
    };

    collection('elections').add(electionData)
      .then(() => {
        console.log('Election data submitted successfully');
      })
      .catch((error) => {
        console.error('Error submitting election data:', error);
      });
  };

  return (
    <div className="container pb-5 mb-5">
      <h1>Create Election</h1>
      <form onSubmit={handleFormSubmit}>
        <div className="mb-3">
          <label htmlFor="startTime" className="form-label">
            Start Time
          </label>
          <input
            type="datetime-local"
            className="form-control"
            id="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="endTime" className="form-label">
            End Time
          </label>
          <input
            type="datetime-local"
            className="form-control"
            id="endTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="newCandidate" className="form-label">
            Candidate Name
          </label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              id="newCandidate"
              value={newCandidate}
              onChange={handleCandidateChange}
            />
            <button type="button" className="btn btn-primary" onClick={handleAddCandidate}>
              Add Candidate
            </button>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Candidates</label>
          <ul className="list-group">
            {candidates.map((candidate, index) => (
              <li key={index} className="list-group-item">
                {candidate}
              </li>
            ))}
          </ul>
        </div>

        <button type="submit" className="btn btn-primary">
          Create Election
        </button>
      </form>
    </div>
  );
};

export default AdminElectionCreation;

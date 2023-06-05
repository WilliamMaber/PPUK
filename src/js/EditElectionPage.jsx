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

const app = initializeApp
const firestore = firebase.firestore();

const DeleteElectionPage = () => {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState('');
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    const unsubscribe = collection('elections').onSnapshot((snapshot) => {
      const electionsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setElections(electionsData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleElectionSelection = (electionId) => {
    setSelectedElection(electionId);
  };

  const handleDeleteElection = () => {
    firestore
      .collection('elections')
      .doc(selectedElection)
      .delete()
      .then(() => {
        setDeleted(true);
      })
      .catch((error) => {
        console.error('Error deleting election:', error);
      });
  };

  return (
    <div className="container pb-5 mb-5">
      <h1>Delete Election</h1>
      {deleted ? (
        <p>The election has been deleted successfully.</p>
      ) : (
        <div>
          <p>Select the election you want to delete:</p>
          <ul className="list-group">
            {elections.map((election) => (
              <li
                key={election.id}
                className={`list-group-item ${selectedElection === election.id ? 'active' : ''}`}
                onClick={() => handleElectionSelection(election.id)}
              >
                {election.name}
              </li>
            ))}
          </ul>
          {selectedElection && (
            <button className="btn btn-danger mt-3" onClick={handleDeleteElection}>
              Delete Election
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DeleteElectionPage;

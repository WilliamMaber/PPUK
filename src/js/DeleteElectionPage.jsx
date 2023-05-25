import React, { useState, useEffect } from 'react';

const DeleteElectionPage = () => {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState('');
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    // Simulate loading elections from the server
    fetchElections()
      .then((data) => {
        setElections(data);
      })
      .catch((error) => {
        console.error('Error fetching elections:', error);
      });
  }, []);

  const fetchElections = () => {
    // Simulated fetch request to retrieve elections
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, name: 'Election 1' },
          { id: 2, name: 'Election 2' },
          { id: 3, name: 'Election 3' },
          // Add more elections as needed
        ]);
      }, 1000);
    });
  };

  const handleElectionSelection = (electionId) => {
    setSelectedElection(electionId);
  };

  const handleDeleteElection = () => {
    // TODO: Implement deletion logic, e.g., send selectedElection to the server for deletion
    setDeleted(true);
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

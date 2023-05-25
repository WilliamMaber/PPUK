import React, { useState } from 'react';

const VotingPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [preferences, setPreferences] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Fetch candidates from the server or load from a JSON file
  // Modify this function to fetch candidates based on your implementation
  const fetchCandidates = () => {
    // Simulated data for candidates
    const candidatesData = [
      { id: 1, name: 'Candidate 1' },
      { id: 2, name: 'Candidate 2' },
      { id: 3, name: 'Candidate 3' },
      // Add more candidates as needed
    ];
    setCandidates(candidatesData);
  };

  useState(() => {
    fetchCandidates();
  }, []);

  const handlePreferenceChange = (candidateId, preference) => {
    setPreferences((prevPreferences) => ({
      ...prevPreferences,
      [candidateId]: preference,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement logic to submit the preferences to the server for counting
    setSubmitted(true);
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

import React, { useState } from 'react';
import CandidateDetails from './CandidateDetails.jsx';

const CandidatesPage = () => {
  const [candidates] = useState([
    { id: 1, name: 'Candidate 1', profile: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { id: 2, name: 'Candidate 2', profile: 'Nulla fringilla enim libero, nec dignissim purus hendrerit a.' },
    // Add more candidates as needed
  ]);

  const [selectedCandidate, setSelectedCandidate] = useState(null);

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

import React from 'react';

const CandidateDetails = ({ candidate }) => {
  return (
    <div>
      <h2>{candidate.name}</h2>
      <p>{candidate.profile}</p>
      {/* Additional candidate information */}
    </div>
  );
};

export default CandidateDetails;

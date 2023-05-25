import React from 'react';

const VolunteerOpportunityPage = ({ volunteerRole }) => {
  return (
    <div>
      <h1>{volunteerRole.title}</h1>
      <p>{volunteerRole.description}</p>
      <h3>Requirements:</h3>
      <ul>
        {volunteerRole.requirements.map((requirement, index) => (
          <li key={index}>{requirement}</li>
        ))}
      </ul>
    </div>
  );
};

export default VolunteerOpportunityPage;

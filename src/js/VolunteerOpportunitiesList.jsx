import React from 'react';

const VolunteerOpportunitiesList = ({ volunteerRoles }) => {
  return (
    <div>
      <h1>Volunteer Opportunities</h1>
      {volunteerRoles.map((role, index) => (
        <div key={index}>
          <h2>{role.title}</h2>
          <p>{role.description}</p>
        </div>
      ))}
    </div>
  );
};

export default VolunteerOpportunitiesList;

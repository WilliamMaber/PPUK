import React, { useState, useEffect } from 'react';

const MemberDirectory = () => {
  const [members, setMembers] = useState([]);

  // Fetch member data from the server or load from a JSON file
  const fetchMembers = () => {
    // Simulated data for member directory
    const memberData = [
      { id: 1, name: 'John Doe', email: 'johndoe@example.com' },
      { id: 2, name: 'Jane Smith', email: 'janesmith@example.com' },
      { id: 3, name: 'Alice Johnson', email: 'alicejohnson@example.com' },
    ];
    setMembers(memberData);
  };

  useEffect(() => {
    // Fetch member data when the component mounts
    fetchMembers();
  }, []);

  return (
    <div>
      <h1>Member Directory</h1>
      <ul>
        {members.map((member) => (
          <li key={member.id}>
            <h3>{member.name}</h3>
            <p>Email: {member.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MemberDirectory;

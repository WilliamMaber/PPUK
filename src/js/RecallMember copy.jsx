import React, { useState } from 'react';

const RecallMember = () => {
  const [memberId, setMemberId] = useState('');

  const handleMemberIdChange = (event) => {
    setMemberId(event.target.value);
  };

  const handleRecallSubmit = (event) => {
    event.preventDefault();
    // Perform recall process with the member ID
    console.log('Recall initiated for member ID:', memberId);
    // Reset the input field after submission
    setMemberId('');
  };

  return (
    <div>
      <h1>Recall Elected Member</h1>
      <form onSubmit={handleRecallSubmit}>
        <label>
          Member ID:
          <input type="text" value={memberId} onChange={handleMemberIdChange} />
        </label>
        <button type="submit">Initiate Recall</button>
      </form>
    </div>
  );
};

export default RecallMember;

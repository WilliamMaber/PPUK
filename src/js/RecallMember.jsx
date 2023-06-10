import React, { useState } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const RecallMember = () => {
  const [memberId, setMemberId] = useState('');

  const handleMemberIdChange = (event) => {
    setMemberId(event.target.value);
  };

  const handleRecallSubmit = (event) => {
    event.preventDefault();
    // Perform recall process with the member ID
    console.log('Recall initiated for member ID:', memberId);

    // Access Firestore collection and delete member document
    const firestore = getFirestore(app);
    const memberRef = collection('members').doc(memberId);

    memberRef
      .delete()
      .then(() => {
        console.log('Member recalled successfully');
      })
      .catch((error) => {
        console.error('Error recalling member:', error);
      });

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

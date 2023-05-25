import React, { useState } from 'react';

const AdminACL = () => {
  const [userId, setUserId] = useState('');
  const [permission, setPermission] = useState('');

  const handleUserIdChange = (event) => {
    setUserId(event.target.value);
  };

  const handlePermissionChange = (event) => {
    setPermission(event.target.value);
  };

  const handleGrantPermission = (event) => {
    event.preventDefault();
    // Grant the specified permission to the user with the given ID
    console.log(`Granting ${permission} permission to user ID ${userId}`);
    // Reset the input fields after granting permission
    setUserId('');
    setPermission('');
  };

  return (
    <div>
      <h1>Admin Access Control</h1>
      <form onSubmit={handleGrantPermission}>
        <label>
          User ID:
          <input type="text" value={userId} onChange={handleUserIdChange} />
        </label>
        <label>
          Permission:
          <input type="text" value={permission} onChange={handlePermissionChange} />
        </label>
        <button type="submit">Grant Permission</button>
      </form>
    </div>
  );
};

export default AdminACL;

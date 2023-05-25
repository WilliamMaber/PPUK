import React, { useState } from 'react';

const AccessControlPage = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Admin 1', role: 'admin' },
    { id: 2, name: 'User 1', role: 'user' },
    { id: 3, name: 'User 2', role: 'user' },
    // Add more users as needed
  ]);

  const handleRoleChange = (userId, newRole) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => {
        if (user.id === userId) {
          return { ...user, role: newRole };
        }
        return user;
      })
    );
  };

  return (
    <div className="container pb-5 mb-5">
      <h1>Access Control</h1>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </td>
              <td>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  // TODO: Implement logic to delete the user
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccessControlPage;

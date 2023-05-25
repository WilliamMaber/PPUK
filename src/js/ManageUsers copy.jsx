import React, { useState, useEffect } from 'react';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading users from the server
    fetchUsers()
      .then((data) => {
        setUsers(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const fetchUsers = () => {
    // Simulated fetch request to retrieve users
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, name: 'John Doe', email: 'johndoe@example.com', role: 'Admin' },
          { id: 2, name: 'Jane Smith', email: 'janesmith@example.com', role: 'User' },
          // Add more users as needed
        ]);
      }, 1000);
    });
  };

  const handleDeleteUser = (userId) => {
    // TODO: Implement user deletion logic, e.g., send delete request to the server
    console.log('Deleting user with ID:', userId);
  };

  return (
    <div className="container pb-5 mb-5">
      <h1>Manage Users</h1>
      {isLoading ? (
        <p>Loading users...</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageUsers;

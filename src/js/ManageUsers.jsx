import React, { useState, useEffect } from 'react';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);

  useEffect(() => {
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
    console.log('Deleting user with ID:', userId);
  };

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container pb-5 mb-5">
      <h1>Manage Users</h1>
      {isLoading ? (
        <p>Loading users...</p>
      ) : (
        <div>
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
              {currentUsers.map((user) => (
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
          <Pagination
            usersPerPage={usersPerPage}
            totalUsers={users.length}
            currentPage={currentPage}
            paginate={paginate}
          />
        </div>
      )}
    </div>
  );
};

const Pagination = ({ usersPerPage, totalUsers, currentPage, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalUsers / usersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map((pageNumber) => (
          <li key={pageNumber} className="page-item">
            <button
              type="button"
              className={`page-link ${pageNumber === currentPage ? 'active' : ''}`}
              onClick={() => paginate(pageNumber)}
            >
              {pageNumber}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default ManageUsers;

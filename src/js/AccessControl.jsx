import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDL2CHHhPUg9K6_tV_5Z2bUl4wWcB3-sic",
  authDomain: "ptate-df901.firebaseapp.com",
  projectId: "ptate-df901",
  storageBucket: "ptate-df901.appspot.com",
  messagingSenderId: "795297920122",
  appId: "1:795297920122:web:9cfd9b972dc92213dd77c3",
  measurementId: "G-9MPXZR194T"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

const AccessControlPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const unsubscribe = collection('users').onSnapshot((snapshot) => {
      const usersData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleRoleChange = (userId, newRole) => {
    collection('users').doc(userId.toString()).update({ role: newRole })
      .then(() => {
        console.log('User role updated successfully');
      })
      .catch((error) => {
        console.error('Error updating user role:', error);
      });
  };

  const handleDeleteUser = (userId) => {
    collection('users').doc(userId.toString()).delete()
      .then(() => {
        console.log('User deleted successfully');
      })
      .catch((error) => {
        console.error('Error deleting user:', error);
      });
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
                  onClick={() => handleDeleteUser(user.id)}
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

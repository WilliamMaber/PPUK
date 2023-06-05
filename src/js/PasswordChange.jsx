import React, { useState } from 'react';
import { initializeApp } from "firebase/app";
import 'firebase/auth';

const PasswordChange = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password === confirmPassword) {
      const user = firebase.auth().currentUser;

      user.updatePassword(password)
        .then(() => {
          // Password changed successfully
          console.log('Password changed successfully');
        })
        .catch((error) => {
          // Handle password change error
          console.error('Error changing password:', error);
        });
    } else {
      // Handle password mismatch error
      console.error('Passwords do not match');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="password">New Password</label>
        <input
          type="password"
          className="form-control"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          className="form-control"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary">Change Password</button>
    </form>
  );
};

export default PasswordChange;

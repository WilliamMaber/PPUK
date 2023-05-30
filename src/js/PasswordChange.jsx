import React, { useState } from 'react';

const PasswordChange = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Perform password change API request here
    // Example: fetch('/api/password-change', { method: 'POST', body: { password, confirmPassword } })
    // Handle success or error responses accordingly
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

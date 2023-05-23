import React from 'react';

function UserStatus() {
  const userLoggedIn = false; // Replace with your logic to determine if the user is logged in

  if (userLoggedIn) {
    return (
      <div className="dropdown text-end">
        <img src="/media/person.svg" alt="mdo" className="bg-light rounded-circle" width="32" height="32" />
        <ul className="dropdown-menu text-small dropdown-menu-end" aria-labelledby="dropdownUser1">
          <li>
            <a className="dropdown-item" href="/profile.html">
              Profile
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="/logout.html">
              Sign out
            </a>
          </li>
        </ul>
      </div>
    );
  } else {
    return (
      <div className="dropdown text-end">
        <a href="/login.html" className="btn btn-primary">
          Login
        </a>
        <a href="/register.html" className="btn btn-primary">
          Register
        </a>
      </div>
    );
  }
}

export default UserStatus;

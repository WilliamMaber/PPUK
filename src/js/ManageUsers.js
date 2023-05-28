import React from "react";
import ReactDOM from "react-dom";
import ManageUsers from "./ManageUsers.jsx";
const root = ReactDOM.createRoot(
  React.createElement(ManageUsers),
  document.getElementById("userStatusContainer")
);

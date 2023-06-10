import React from "react";
import ReactDOM from "react-dom";
import ElectionResults from "./ElectionResults.jsx";

const root = ReactDOM.render(
  React.createElement(ElectionResults),
  document.getElementById("ElectionResultsContainer")
);

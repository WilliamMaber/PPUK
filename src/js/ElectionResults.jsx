import React, { useState, useEffect } from 'react';

const ElectionResults = () => {
  const [results, setResults] = useState([]);

  // Fetch election results from the server or load from a JSON file
  const fetchElectionResults = () => {
    // Simulated data for election results
    const resultsData = [
      { candidate: 'Candidate 1', votes: 500, percentage: 40 },
      { candidate: 'Candidate 2', votes: 400, percentage: 32 },
      { candidate: 'Candidate 3', votes: 300, percentage: 24 },
    ];
    setResults(resultsData);
  };

  useEffect(() => {
    // Fetch election results when the component mounts
    fetchElectionResults();
  }, []);

  return (
    <div>
      <h1>Election Results</h1>
      <table>
        <thead>
          <tr>
            <th>Candidate</th>
            <th>Votes</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={index}>
              <td>{result.candidate}</td>
              <td>{result.votes}</td>
              <td>{result.percentage}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ElectionResults;

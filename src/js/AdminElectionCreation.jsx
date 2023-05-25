import React, { useState } from 'react';

const AdminElectionCreation = () => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [newCandidate, setNewCandidate] = useState('');

  const handleCandidateChange = (e) => {
    setNewCandidate(e.target.value);
  };

  const handleAddCandidate = () => {
    if (newCandidate.trim() !== '') {
      setCandidates([...candidates, newCandidate]);
      setNewCandidate('');
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement form submission logic, e.g., send election data to the server
  };

  return (
    <div className="container pb-5 mb-5">
      <h1>Create Election</h1>
      <form onSubmit={handleFormSubmit}>
        <div className="mb-3">
          <label htmlFor="startTime" className="form-label">
            Start Time
          </label>
          <input
            type="datetime-local"
            className="form-control"
            id="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="endTime" className="form-label">
            End Time
          </label>
          <input
            type="datetime-local"
            className="form-control"
            id="endTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="newCandidate" className="form-label">
            Candidate Name
          </label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              id="newCandidate"
              value={newCandidate}
              onChange={handleCandidateChange}
            />
            <button type="button" className="btn btn-primary" onClick={handleAddCandidate}>
              Add Candidate
            </button>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Candidates</label>
          <ul className="list-group">
            {candidates.map((candidate, index) => (
              <li key={index} className="list-group-item">
                {candidate}
              </li>
            ))}
          </ul>
        </div>

        <button type="submit" className="btn btn-primary">
          Create Election
        </button>
      </form>
    </div>
  );
};

export default AdminElectionCreation;

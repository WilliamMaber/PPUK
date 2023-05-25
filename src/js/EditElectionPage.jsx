import React, { useState, useEffect } from 'react';

const EditElectionPage = ({ electionId }) => {
  const [election, setElection] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [newCandidate, setNewCandidate] = useState('');

  useEffect(() => {
    // Simulate loading election data from the server based on the electionId
    fetchElectionData(electionId)
      .then((data) => {
        setElection(data);
        setStartTime(data.startTime);
        setEndTime(data.endTime);
        setCandidates(data.candidates);
      })
      .catch((error) => {
        console.error('Error fetching election data:', error);
      });
  }, [electionId]);

  const fetchElectionData = (id) => {
    // Simulated fetch request to retrieve election data based on the electionId
    return new Promise((resolve) => {
      setTimeout(() => {
        // Replace with your actual server logic to fetch election data
        resolve({
          id: id,
          startTime: '2023-06-01T09:00',
          endTime: '2023-06-10T18:00',
          candidates: ['Candidate 1', 'Candidate 2', 'Candidate 3'],
        });
      }, 1000);
    });
  };

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
    // TODO: Implement form submission logic to update election details
    const updatedElection = {
      ...election,
      startTime: startTime,
      endTime: endTime,
      candidates: candidates,
    };
    console.log('Updated Election:', updatedElection);
  };

  if (!election) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container pb-5 mb-5">
      <h1>Edit Election Details</h1>
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
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditElectionPage;

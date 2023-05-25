import React, { useState, useEffect } from 'react';

const EventList = () => {
  const [events, setEvents] = useState([]);

  // Fetch events from the server or load from a JSON file
  const fetchEvents = () => {
    // Simulated data for events
    const eventData = [
      { id: 1, title: 'Event 1', date: '2023-06-01', location: 'Location 1' },
      { id: 2, title: 'Event 2', date: '2023-06-05', location: 'Location 2' },
      // Add more events as needed
    ];
    setEvents(eventData);
  };

  useEffect(() => {
    // Fetch events when the component mounts
    fetchEvents();
  }, []);

  return (
    <div>
      <h1>Events and Meetings</h1>
      <ul>
        {events.map(event => (
          <li key={event.id}>
            <h2>{event.title}</h2>
            <p>Date: {event.date}</p>
            <p>Location: {event.location}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;

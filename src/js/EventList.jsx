import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';

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

const EventList = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const eventsRef = collection('events');
    const unsubscribe = eventsRef.onSnapshot((snapshot) => {
      const eventData = snapshot.docs.map((doc) => doc.data());
      setEvents(eventData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div>
      <h1>Events and Meetings</h1>
      <ul>
        {events.map((event) => (
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

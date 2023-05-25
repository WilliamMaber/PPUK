import React from 'react';

const ExclusiveContentList = () => {
  const exclusiveContent = [
    { id: 1, title: 'Exclusive Article 1', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { id: 2, title: 'Exclusive Article 2', description: 'Nulla fringilla enim libero, nec dignissim purus hendrerit a.' },
    // Add more exclusive content items as needed
  ];

  return (
    <div>
      <h1>Exclusive Content</h1>
      {exclusiveContent.map(item => (
        <div key={item.id}>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  );
};

export default ExclusiveContentList;

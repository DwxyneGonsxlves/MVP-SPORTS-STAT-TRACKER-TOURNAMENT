// src/components/HomeScreen.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomeScreen = () => {
  const navigate = useNavigate();

  const startMatch = () => {
    navigate('/team-selection');
  };

  return (
    <div>
      <h1>Tournament Tracker</h1>
      <button onClick={startMatch}>Start Match</button>
    </div>
  );
};

export default HomeScreen;

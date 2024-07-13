import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomeScreen from './components/HomeScreen';
import TeamSelection from './components/TeamSelection';
import PlayerStats from './components/PlayerStats';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/team-selection" element={<TeamSelection />} />
        <Route path="/player-stats" element={<PlayerStats />} />
      </Routes>
    </Router>
  );
};

export default App;

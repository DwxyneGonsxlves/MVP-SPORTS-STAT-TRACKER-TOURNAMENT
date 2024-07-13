import React, { useState } from 'react';
import { tournaments } from './Data';
import { useNavigate } from 'react-router-dom';

const TeamSelection = () => {
  const [gender, setGender] = useState('boys');
  const [group1, setGroup1] = useState('groupA');
  const [group2, setGroup2] = useState('groupA');
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');
  const navigate = useNavigate();

  const startGame = () => {
    localStorage.setItem('selectedTeams', JSON.stringify({ gender, team1, team2 }));
    navigate('/player-stats');
  };

  return (
    <div>
      <h2>Select Teams</h2>
      <div>
        <label>
          Gender:
          <select value={gender} onChange={e => setGender(e.target.value)}>
            <option value="boys">Boys</option>
            <option value="girls">Girls</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Group for Team 1:
          <select value={group1} onChange={e => setGroup1(e.target.value)}>
            <option value="groupA">Group A</option>
            <option value="groupB">Group B</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Team 1:
          <select value={team1} onChange={e => setTeam1(e.target.value)}>
            {tournaments[gender][group1].map(team => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label>
          Group for Team 2:
          <select value={group2} onChange={e => setGroup2(e.target.value)}>
            <option value="groupA">Group A</option>
            <option value="groupB">Group B</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Team 2:
          <select value={team2} onChange={e => setTeam2(e.target.value)}>
            {tournaments[gender][group2].map(team => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>
        </label>
      </div>
      <button onClick={startGame}>Start Game</button>
    </div>
  );
};

export default TeamSelection;

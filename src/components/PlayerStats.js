// src/components/PlayerStats.js
import React, { useEffect, useState } from 'react';
import { players } from './Data';
import * as XLSX from 'xlsx';

const PlayerStats = () => {
  const [selectedTeams, setSelectedTeams] = useState({ gender: '', team1: '', team2: '' });
  const [team1Players, setTeam1Players] = useState([]);
  const [team2Players, setTeam2Players] = useState([]);
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [team1Fouls, setTeam1Fouls] = useState(0);
  const [team2Fouls, setTeam2Fouls] = useState(0);
  const [team1Timeouts, setTeam1Timeouts] = useState(3);
  const [team2Timeouts, setTeam2Timeouts] = useState(3);
  const [timer, setTimer] = useState(600); // 10 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const storedTeams = JSON.parse(localStorage.getItem('selectedTeams'));
    if (storedTeams) {
      setSelectedTeams(storedTeams);
      const team1 = players[storedTeams.gender]?.[storedTeams.team1] || [];
      const team2 = players[storedTeams.gender]?.[storedTeams.team2] || [];
      setTeam1Players(team1.sort((a, b) => a.number - b.number));
      setTeam2Players(team2.sort((a, b) => a.number - b.number));
    }
  }, []);

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer(prevTimer => (prevTimer > 0 ? prevTimer - 1 : 0));
      }, 1000);
    } else if (!isRunning && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, timer]);

  const handleScore = (team, player, points) => {
    if (team === 1) {
      setTeam1Score(prev => prev + points);
      setTeam1Players(prevPlayers =>
        prevPlayers.map(p => {
          if (p.name === player.name) {
            const updatedPlayer = { ...p, points: (p.points || 0) + points };
            if (points === 1) updatedPlayer.freeThrows = (p.freeThrows || 0) + 1;
            if (points === 3) updatedPlayer.threePoints = (p.threePoints || 0) + 1;
            return updatedPlayer;
          }
          return p;
        })
      );
    } else {
      setTeam2Score(prev => prev + points);
      setTeam2Players(prevPlayers =>
        prevPlayers.map(p => {
          if (p.name === player.name) {
            const updatedPlayer = { ...p, points: (p.points || 0) + points };
            if (points === 1) updatedPlayer.freeThrows = (p.freeThrows || 0) + 1;
            if (points === 3) updatedPlayer.threePoints = (p.threePoints || 0) + 1;
            return updatedPlayer;
          }
          return p;
        })
      );
    }
  };

  const handleRebound = (team, player) => {
    if (team === 1) {
      setTeam1Players(prevPlayers =>
        prevPlayers.map(p => (p.name === player.name ? { ...p, rebounds: (p.rebounds || 0) + 1 } : p))
      );
    } else {
      setTeam2Players(prevPlayers =>
        prevPlayers.map(p => (p.name === player.name ? { ...p, rebounds: (p.rebounds || 0) + 1 } : p))
      );
    }
  };

  const handleAssist = (team, player) => {
    if (team === 1) {
      setTeam1Players(prevPlayers =>
        prevPlayers.map(p => (p.name === player.name ? { ...p, assists: (p.assists || 0) + 1 } : p))
      );
    } else {
      setTeam2Players(prevPlayers =>
        prevPlayers.map(p => (p.name === player.name ? { ...p, assists: (p.assists || 0) + 1 } : p))
      );
    }
  };

  const handlePersonalFoul = (team, player) => {
    if (team === 1) {
      setTeam1Players(prevPlayers =>
        prevPlayers.map(p => (p.name === player.name ? { ...p, fouls: (p.fouls || 0) + 1 } : p))
      );
      setTeam1Fouls(prev => prev + 1);
    } else {
      setTeam2Players(prevPlayers =>
        prevPlayers.map(p => (p.name === player.name ? { ...p, fouls: (p.fouls || 0) + 1 } : p))
      );
      setTeam2Fouls(prev => prev + 1);
    }
  };

  const resetTimer = () => {
    setTimer(600);
    setIsRunning(false);
  };

  const exportToExcel = () => {
    const createSheetData = (players, teamName) => [
      ['Team', teamName],
      [],
      ['Number', 'Name', 'PTS', 'FT', '3PT', 'REB', 'AST', 'FOULS'],
      ...players.map(player => [
        player.number,
        player.name,
        player.points || 0,
        player.freeThrows || 0,
        player.threePoints || 0,
        player.rebounds || 0,
        player.assists || 0,
        player.fouls || 0
      ])
    ];

    const team1Data = createSheetData(team1Players, selectedTeams.team1);
    const team2Data = createSheetData(team2Players, selectedTeams.team2);

    const wb = XLSX.utils.book_new();
    const ws1 = XLSX.utils.aoa_to_sheet(team1Data);
    const ws2 = XLSX.utils.aoa_to_sheet(team2Data);

    XLSX.utils.book_append_sheet(wb, ws1, selectedTeams.team1);
    XLSX.utils.book_append_sheet(wb, ws2, selectedTeams.team2);

    XLSX.writeFile(wb, 'player_stats.xlsx');
  };

  return (
    <div className="container">
      <h2 style={{ position: 'absolute', top: '5px', left: '50%', transform: 'translateX(-50%)' }}>MVP Basketball Academy</h2>
      <div className="team team1">
        <h3>{selectedTeams.team1}</h3>
        <div className="team-info">
          <div className="team-score">
            <h1>{team1Score}</h1>
            <div className="team-stats">
              <div className="fouls">
                <p>Team Fouls: {team1Fouls}</p>
                <button onClick={() => setTeam1Fouls(team1Fouls + 1)}>Add Team Foul</button>
              </div>
              <div id="timeout-container" className="timeouts">
                <p>Timeouts: {team1Timeouts}</p>
                <button onClick={() => setTeam1Timeouts(team1Timeouts + 1)}>+1 Timeout</button>
                <button onClick={() => setTeam1Timeouts(team1Timeouts > 0 ? team1Timeouts - 1 : 0)}>-1 Timeout</button>
              </div>
            </div>
          </div>
        </div>
        <div className="player-list">
          {team1Players.map(player => (
            <div key={player.number} className="player-row">
              <p><span className="player-number">{player.number}</span></p>
              <p className="player-name">{player.name}</p>
              <p>PTS {player.points || 0}</p>
              <p>FT {player.freeThrows || 0}</p>
              <p>3PT {player.threePoints || 0}</p>
              <p>REB {player.rebounds || 0}</p>
              <p>AST {player.assists || 0}</p>
              <p>FOULS {player.fouls || 0}</p>
              <button onClick={() => handleScore(1, player, 1)}>1 PT</button>
              <button onClick={() => handleScore(1, player, 2)}>2 PT</button>
              <button onClick={() => handleScore(1, player, 3)}>3 PT</button>
              <button onClick={() => handleRebound(1, player)}>REB</button>
              <button onClick={() => handleAssist(1, player)}>AST</button>
              <button onClick={() => handlePersonalFoul(1, player)}>FOUL</button>
            </div>
          ))}
        </div>
      </div>
      <div className="middle-section">
        <h1 className="timer">{Math.floor(timer / 60)}:{('0' + (timer % 60)).slice(-2)}</h1>
        <div className="controls">
          <button onClick={() => setIsRunning(!isRunning)}>{isRunning ? 'Pause' : 'Start'}</button>
          <button onClick={resetTimer}>Reset</button>
          <button onClick={() => alert('Half Finished')}>Finish Half</button>
          <button onClick={exportToExcel}>Export to Excel</button>
        </div>
      </div>
      <div className="team team2">
        <h3>{selectedTeams.team2}</h3>
        <div className="team-info">
          <div className="team-score">
            <h1>{team2Score}</h1>
            <div className="team-stats">
              <div className="fouls">
                <p>Team Fouls: {team2Fouls}</p>
                <button onClick={() => setTeam2Fouls(team2Fouls + 1)}>Add Team Foul</button>
              </div>
              <div id="timeout-container" className="timeouts">
                <p>Timeouts: {team2Timeouts}</p>
                <button onClick={() => setTeam2Timeouts(team2Timeouts + 1)}>+1 Timeout</button>
                <button onClick={() => setTeam2Timeouts(team2Timeouts > 0 ? team2Timeouts - 1 : 0)}>-1 Timeout</button>
              </div>
            </div>
          </div>
        </div>
        <div className="player-list">
          {team2Players.map(player => (
            <div key={player.number} className="player-row">
              <p><span className="player-number">{player.number}</span></p>
              <p className="player-name">{player.name}</p>
              <p>PTS {player.points || 0}</p>
              <p>FT {player.freeThrows || 0}</p>
              <p>3PT {player.threePoints || 0}</p>
              <p>REB {player.rebounds || 0}</p>
              <p>AST {player.assists || 0}</p>
              <p>FOULS {player.fouls || 0}</p>
              <button onClick={() => handleScore(2, player, 1)}>1 PT</button>
              <button onClick={() => handleScore(2, player, 2)}>2 PT</button>
              <button onClick={() => handleScore(2, player, 3)}>3 PT</button>
              <button onClick={() => handleRebound(2, player)}>REB</button>
              <button onClick={() => handleAssist(2, player)}>AST</button>
              <button onClick={() => handlePersonalFoul(2, player)}>FOUL</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayerStats;

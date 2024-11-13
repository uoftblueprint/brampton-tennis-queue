import React from 'react';
import './PlayerList.css';

interface PlayerListProps {
  activePlayers: string[];
  queuePlayers: string[];
}

const PlayerList: React.FC<PlayerListProps> = ({ activePlayers, queuePlayers }) => {
  // Function to clean up nicknames
  const formatNickname = (nickname: string) => {
    if (!nickname) return 'Unknown'; // Handle null or undefined values
    if (nickname.startsWith('Unknown')) return 'Unknown';
    if (nickname.startsWith('Empty')) return 'Empty';
    return nickname;
  };

  return (
    <div className="player-list">
      <div className="active-players">
        <h2>Active Players</h2>
        <div className="courts">
          {activePlayers.map((nickname, index) => (
            <div className="court" key={index}>
              {formatNickname(nickname)}
            </div>
          ))}
        </div>
      </div>
      <div className="queue-players">
        <h2>Queue Players</h2>
        <ul>
          {queuePlayers.length > 0 ? (
            queuePlayers.map((nickname, index) => (
              <li key={index}>{formatNickname(nickname)}</li>
            ))
          ) : (
            <li>No players in the queue.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default PlayerList;
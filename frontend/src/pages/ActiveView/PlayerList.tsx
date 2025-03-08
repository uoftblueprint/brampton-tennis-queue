import React, { useContext } from "react";
import RectangleWithOptions from "./RectangleWithOptions";
import "./PlayerList.css";
import { LocalStorageContext } from "../../context/LocalStorageContext";

interface PlayerListProps {
  activePlayers: string[];
  queuePlayers: string[];
  activeFirebaseUIDs: string[];
  queueFirebaseUIDs: string[];
}

const PlayerList: React.FC<PlayerListProps> = ({
  activePlayers,
  queuePlayers,
  activeFirebaseUIDs,
  queueFirebaseUIDs,
}) => {
  // Function to clean up nicknames
  const formatNickname = (nickname: string) => {
    if (!nickname) return "Player"; // Handle null or undefined values
    if (nickname.startsWith("Unknown")) return "Unknown";
    if (nickname.startsWith("Empty")) return "Empty";
    return nickname;
  };

  return (
    <div className="players-list-container">
      {/* Page heading */}
      <div className="header">
        <h2 className="header-title"><span>Brampton</span><br/>Tennis Queue</h2>
      </div>
      
        {/* Active Players list */}
      <div className="players-section" id="active-players">
        <h2 className="players-list-title">Active Players</h2>

        <div className="players-list">
          {activePlayers.map((nickname, index) => (
            <div key={index} className="player-card">
              <RectangleWithOptions
                key={index}
                nickname={formatNickname(nickname)}
                firebaseUID={activeFirebaseUIDs[index]}
                inQueue={false}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Queue Players list */}
      <div className="players-section" id="queue-players">
        <h2 className="players-list-title">Queue Players</h2>

        <div className="players-list">
          {queuePlayers.length > 0 ? (
            queuePlayers.map((nickname, index) => (
              <div key={index} className="player-card">
                <RectangleWithOptions
                  key={index}
                  nickname={formatNickname(nickname)}
                  firebaseUID={queueFirebaseUIDs[index]}
                  inQueue={true}
                />
              </div>
            ))
          ) : (
            <p className="empty-queue-message">No players in the queue.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerList;
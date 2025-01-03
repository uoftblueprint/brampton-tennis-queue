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
    <div className="player-list">
      <div className="active-players">
        <h2>Active Players</h2>
        <div className="courts">
          {activePlayers.map((nickname, index) => (
            <RectangleWithOptions
              key={index}
              nickname={formatNickname(nickname)}
              firebaseUID={activeFirebaseUIDs[index]}
              inQueue={false}
            />
          ))}
        </div>
      </div>
      <div className="queue-players">
        <h2>Queue Players</h2>
        <div className="queue-list">
          {queuePlayers.length > 0 ? (
            queuePlayers.map((nickname, index) => (
              <RectangleWithOptions
                key={index}
                nickname={formatNickname(nickname)}
                firebaseUID={queueFirebaseUIDs[index]}
                inQueue={true}
              />
            ))
          ) : (
            <p>No players in the queue.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerList;
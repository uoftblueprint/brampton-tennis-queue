import React from "react";
import RectangleWithOptions from "./RectangleWithOptions";
import "./PlayerList.css";

interface PlayerListProps {
  activePlayers: string[];
  queuePlayers: string[];
  activeFirebaseUIDs: string[];
  queueFirebaseUIDs: string[];
  userFirebaseUID: string;
  userInQueue: boolean;
  location: string;
}

const PlayerList: React.FC<PlayerListProps> = ({
  activePlayers,
  queuePlayers,
  activeFirebaseUIDs,
  queueFirebaseUIDs,
  userFirebaseUID,
  userInQueue,
  location,
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
              userFirebaseUID={userFirebaseUID}
              userInQueue={userInQueue}
              inQueue={false}
              location={location}
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
                userFirebaseUID={userFirebaseUID}
                userInQueue={userInQueue}
                inQueue={true}
                location={location}
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
import React, { createContext, useState, useEffect } from 'react';

// INFO: All possible props in this context
const UserInfoEnum = {
    selectedLocation: "selectedLocation",
    firebaseUID: "firebaseUID",
    nickname: "nickname",
    addedToGame: "addedToGame",
    inQueue: "inQueue",
    playerData: "playerData",
    playerDataLastUpdateTime: "playerDataLastUpdateTime",
};

// Context for why this type is set to any: https://stackoverflow.com/a/74967045
export const LocalStorageContext = createContext<any>({});

export function LocalStorageProvider({ children }) {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [firebaseUID, setFirebaseUID] = useState('');
  const [nickname, setNickname] = useState('');
  const [addedToGame, setAddedToGame] = useState(false);
  const [inQueue, setInQueue] = useState(false);
  const [playerData, setPlayerData] = useState({});
  const [playerDataLastUpdateTime, setPlayerDataLastUpdateTime] = useState('');

  // Initialize state from localStorage
  useEffect(() => {
    const storedSelectedLocation = localStorage.getItem(UserInfoEnum.selectedLocation);
    const storedFirebaseUID = localStorage.getItem(UserInfoEnum.firebaseUID);
    const storedNickname = localStorage.getItem(UserInfoEnum.nickname);
    const storedAddedToGame = localStorage.getItem(UserInfoEnum.addedToGame) === 'true';
    const storedInQueue = localStorage.getItem(UserInfoEnum.inQueue) === 'true';
    const storedPlayerData = localStorage.getItem(UserInfoEnum.playerData);
    const storedPlayerDataLastUpdateTime = localStorage.getItem(UserInfoEnum.playerDataLastUpdateTime);

    if (storedSelectedLocation) setSelectedLocation(storedSelectedLocation);
    if (storedFirebaseUID) setFirebaseUID(storedFirebaseUID);
    if (storedNickname) setNickname(storedNickname);
    if (storedAddedToGame) setAddedToGame(storedAddedToGame);
    if (storedInQueue) setInQueue(storedInQueue);
    if (storedPlayerData) setPlayerData(storedPlayerData);
    if (storedPlayerDataLastUpdateTime) setPlayerDataLastUpdateTime(storedPlayerDataLastUpdateTime);
  }, []);

  // Helper functions to update both context and localStorage
  const updateSelectedLocation = (value) => {
    setSelectedLocation(value);
    localStorage.setItem(UserInfoEnum.selectedLocation, value);
  };

  const updateFirebaseUID = (value) => {
    setFirebaseUID(value);
    localStorage.setItem(UserInfoEnum.firebaseUID, value);
  };
  
  const updateNickname = (value) => {
    setNickname(value);
    localStorage.setItem(UserInfoEnum.nickname, value);
  };

  const updateAddedToGame = (value) => {
    setAddedToGame(value);
    localStorage.setItem(UserInfoEnum.addedToGame, value);
  };

  const updateInQueue = (value) => {
    setInQueue(value);
    localStorage.setItem(UserInfoEnum.inQueue, value.toString());
  };
  
  const updatePlayerData = (value) => {
    setPlayerData(value);
    localStorage.setItem(UserInfoEnum.playerData, value);
  };

  const updatePlayerDataLastUpdateTime = (value) => {
    setPlayerDataLastUpdateTime(value);
    localStorage.setItem(UserInfoEnum.playerDataLastUpdateTime, value);
  };

  return (
    <LocalStorageContext.Provider
      value={{
        selectedLocation,
        setSelectedLocation: updateSelectedLocation,
        firebaseUID,
        setFirebaseUID: updateFirebaseUID,
        nickname,
        setNickname: updateNickname,
        addedToGame,
        setAddedToGame: updateAddedToGame,
        inQueue,
        setInQueue: updateInQueue,
        playerData,
        setPlayerData: updatePlayerData,
        playerDataLastUpdateTime,
        setPlayerDataLastUpdateTime: updatePlayerDataLastUpdateTime,
      }}
    >
      {children}
    </LocalStorageContext.Provider>
  );
}
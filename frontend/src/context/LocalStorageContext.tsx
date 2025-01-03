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
export const LocalStorageContext = createContext<any>({
  
});

export function LocalStorageProvider( { children } ) {
  //  Pull default context from local storage to persist on page reload
  const [selectedLocation, setSelectedLocation] = useState(localStorage.getItem(UserInfoEnum.selectedLocation) || '');
  const [firebaseUID, setFirebaseUID] = useState(localStorage.getItem(UserInfoEnum.firebaseUID) || '');
  const [nickname, setNickname] = useState(localStorage.getItem(UserInfoEnum.nickname) || '');
  const [addedToGame, setAddedToGame] = useState(localStorage.getItem(UserInfoEnum.addedToGame) === 'true' ? true : false);
  const [inQueue, setInQueue] = useState(localStorage.getItem(UserInfoEnum.inQueue) === 'true' ? true : false);
  const [playerData, setPlayerData] = useState(localStorage.getItem(UserInfoEnum.playerData) ? JSON.parse(localStorage.getItem(UserInfoEnum.playerData)!) : '');
  const [playerDataLastUpdateTime, setPlayerDataLastUpdateTime] = useState(localStorage.getItem(UserInfoEnum.playerDataLastUpdateTime) || '');

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
  const updateSelectedLocation = (value: string) => {
    setSelectedLocation(value);
    localStorage.setItem(UserInfoEnum.selectedLocation, value);
  };

  const updateFirebaseUID = (value: string) => {
    setFirebaseUID(value);
    localStorage.setItem(UserInfoEnum.firebaseUID, value);
  };
  
  const updateNickname = (value: string) => {
    setNickname(value);
    localStorage.setItem(UserInfoEnum.nickname, value);
  };

  const updateAddedToGame = (value: boolean) => {
    setAddedToGame(value);
    localStorage.setItem(UserInfoEnum.addedToGame, value.toString());
  };

  const updateInQueue = (value: boolean) => {
    setInQueue(value);
    localStorage.setItem(UserInfoEnum.inQueue, value.toString());
  };
  
  const updatePlayerData = (value: string) => {
    setPlayerData(value);
    localStorage.setItem(UserInfoEnum.playerData, value);
  };

  const updatePlayerDataLastUpdateTime = (value: string) => {
    setPlayerDataLastUpdateTime(value);
    localStorage.setItem(UserInfoEnum.playerDataLastUpdateTime, value);
  };

  const clear = () => {
    setSelectedLocation('');
    setFirebaseUID('');
    setNickname('');
    setAddedToGame(false);
    setInQueue(false);
    setPlayerData({});
    setPlayerDataLastUpdateTime('');
    localStorage.clear();
  }

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
        clear: clear,
      }}
    >
      {children}
    </LocalStorageContext.Provider>
  );
}
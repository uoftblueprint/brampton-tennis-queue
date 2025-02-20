import React, { createContext, useState, useEffect } from 'react';

// INFO: All possible props in this context
const UserInfoEnum = {
  selectedLocation: "selectedLocation",
  firebaseUID: "firebaseUID",
  nickname: "nickname",
  token: "token",
  addedToGame: "addedToGame",
  inQueue: "inQueue",
  playerData: "playerData",
  playerDataLastUpdateTime: "playerDataLastUpdateTime",
  expectedWaitTime: "expectedWaitTime",
};

// Add interface for children props
interface LocalStorageProviderProps {
  children: React.ReactNode;
}

// Add interface for the context value type
interface LocalStorageContextType {
  selectedLocation: string;
  setSelectedLocation: (value: string) => void;
  firebaseUID: string;
  setFirebaseUID: (value: string) => void;
  nickname: string;
  setNickname: (value: string) => void;
  token: string;
  setToken: (value: string) => void;
  addedToGame: boolean;
  setAddedToGame: (value: boolean) => void;
  inQueue: boolean;
  setInQueue: (value: boolean) => void;
  playerData: any; // or define a more specific type if possible
  setPlayerData: (value: any) => void;
  playerDataLastUpdateTime: string;
  setPlayerDataLastUpdateTime: (value: string) => void;
  expectedWaitTime: number;
  setExpectedWaitTime: (value: number) => void;
  clear: () => void;
}

// Update context creation with the type
export const LocalStorageContext = createContext<LocalStorageContextType | null>(null);

export const LocalStorageProvider: React.FC<LocalStorageProviderProps> = ({ children }) => {
  //  Pull default context from local storage to persist on page reload
  const [selectedLocation, setSelectedLocation] = useState(localStorage.getItem(UserInfoEnum.selectedLocation) || '');
  const [firebaseUID, setFirebaseUID] = useState(localStorage.getItem(UserInfoEnum.firebaseUID) || '');
  const [nickname, setNickname] = useState(localStorage.getItem(UserInfoEnum.nickname) || '');
  const [token, setToken] = useState(localStorage.getItem(UserInfoEnum.token) || 'NULL');
  const [addedToGame, setAddedToGame] = useState(localStorage.getItem(UserInfoEnum.addedToGame) === 'true' ? true : false);
  const [inQueue, setInQueue] = useState(localStorage.getItem(UserInfoEnum.inQueue) === 'true' ? true : false);
  const [playerData, setPlayerData] = useState(localStorage.getItem(UserInfoEnum.playerData) ? JSON.parse(localStorage.getItem(UserInfoEnum.playerData)!) : '');
  const [playerDataLastUpdateTime, setPlayerDataLastUpdateTime] = useState(localStorage.getItem(UserInfoEnum.playerDataLastUpdateTime) || '');
  const [expectedWaitTime, setExpectedWaitTime] = useState(localStorage.getItem(UserInfoEnum.expectedWaitTime) ? Number(localStorage.getItem(UserInfoEnum.expectedWaitTime)!) : 0)

  // Initialize state from localStorage
  useEffect(() => {
    const storedSelectedLocation = localStorage.getItem(UserInfoEnum.selectedLocation);
    const storedFirebaseUID = localStorage.getItem(UserInfoEnum.firebaseUID);
    const storedNickname = localStorage.getItem(UserInfoEnum.nickname);
    const storedToken = localStorage.getItem(UserInfoEnum.token);
    const storedAddedToGame = localStorage.getItem(UserInfoEnum.addedToGame) === 'true';
    const storedInQueue = localStorage.getItem(UserInfoEnum.inQueue) === 'true';
    const storedPlayerData = localStorage.getItem(UserInfoEnum.playerData);
    const storedPlayerDataLastUpdateTime = localStorage.getItem(UserInfoEnum.playerDataLastUpdateTime);
    const storedExpectedWaitTime = Number(localStorage.getItem(UserInfoEnum.expectedWaitTime));

    if (storedSelectedLocation) setSelectedLocation(storedSelectedLocation);
    if (storedFirebaseUID) setFirebaseUID(storedFirebaseUID);
    if (storedNickname) setNickname(storedNickname);
    if (storedToken) setToken(storedToken);
    if (storedAddedToGame) setAddedToGame(storedAddedToGame);
    if (storedInQueue) setInQueue(storedInQueue);
    if (storedPlayerData) setPlayerData(storedPlayerData);
    if (storedPlayerDataLastUpdateTime) setPlayerDataLastUpdateTime(storedPlayerDataLastUpdateTime);
    if (storedExpectedWaitTime > 0) setExpectedWaitTime(storedExpectedWaitTime);
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

  const updateToken = (value: string) => {
    setToken(value);
    localStorage.setItem(UserInfoEnum.token, value);
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

  const updateExpectedWaitTime = (value: number) => {
    setExpectedWaitTime(value);
    localStorage.setItem(UserInfoEnum.expectedWaitTime, value.toString());
  };

  const clear = () => {
    setSelectedLocation('');
    setFirebaseUID('');
    setNickname('');
    setToken('NULL');
    setAddedToGame(false);
    setInQueue(false);
    setPlayerData({});
    setPlayerDataLastUpdateTime('');
    setExpectedWaitTime(0);
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
        token,
        setToken: updateToken,
        addedToGame,
        setAddedToGame: updateAddedToGame,
        inQueue,
        setInQueue: updateInQueue,
        playerData,
        setPlayerData: updatePlayerData,
        playerDataLastUpdateTime,
        setPlayerDataLastUpdateTime: updatePlayerDataLastUpdateTime,
        expectedWaitTime,
        setExpectedWaitTime: updateExpectedWaitTime,
        clear: clear,
      }}
    >
      {children}
    </LocalStorageContext.Provider>
  );
}
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './JoinCourt.css';
import { LocalStorageContext } from '../../context/LocalStorageContext';
import { expectedWaitTime } from "../../utils/api"
import clockIcon from "../../assets/clock-icon.svg";


const JoinCourt: React.FC = () => {
  const context = useContext(LocalStorageContext);

  // Selected location
  const selectedLocation = context.selectedLocation;
  // State for whether all of the courts are full or not
  const [allCourtsFull, setAllCourtsFull] = useState(true);
  const [queueNicknames, setQueueNicknames] = useState([]);
  // const [activeNicknames, setActiveNicknames] = useState([]); Can be implemented later when there's enough information about each court

  // Hook for navigating to the next page
  const navigate = useNavigate();
  
  // Handle the navigation button click
  const handleNextPage = () => {
    navigate('/user-info'); // Navigate to the next page
  };

  useEffect(() => {
    const getLocationWaitData = async () => {
        const locationWaitData = await expectedWaitTime(selectedLocation);
        
        setAllCourtsFull(locationWaitData.allCourtsFull);
        setQueueNicknames(locationWaitData.queueNicknames);
        // setActiveNicknames(locationWaitData.activeNicknames); Can be implemented later when there's enough information about each court
        context.setExpectedWaitTime(locationWaitData.expectedWaitTime);
    }

    getLocationWaitData();
  }, []);

  return (
    <div className="main-container">
      <div className="header">
        {/* Page heading */}
        <h2 className="header-title"><span>Brampton</span><br/>Tennis Queue</h2>
      </div>

      <div className="joiner-container">

        {/* Page heading */}
        <h1 className="joiner-header-title">{selectedLocation}</h1>
        
        {/* Wait time */}
        <div className="wait-time">
          <img src={clockIcon} alt="Clock Icon" className="button-icon" />
          <p>Current queue time - {context.expectedWaitTime * 60} minutes</p>
        </div>

        {/* Active courts: can be implemented later when there's enough information about each court */}
        {/* <div className="courts-carrousel">
          {activeNicknames.map((nickname, index) => {
            const [name, numPlaying] = (String(nickname)).split(' +'); // Splitting at " +"

            return (
              <div key={index} className="court-card">
                <h3>{name}</h3>
                <p>{numPlaying ? `Playing with ${numPlaying} others` : "Solo player"}</p>
              </div>
            );
          })}
        </div> */}

        <div className="players-in-front">
          <h3 className="joiner-subtext">Players in front of you</h3>
          {queueNicknames.length > 0 ? (
            <div className="queue-list">
              {queueNicknames.map((nickname, index) => {
                const [name, numPlaying] = (String(nickname)).split(' +'); // Extract name & number

                return (
                  <div key={index} className="queue-item">
                    <span className="queue-position">{index + 1}</span>
                    <div className="queue-info">
                      <h4>{name}</h4>
                      {numPlaying && <p>+{numPlaying} others</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-queue-list">
              <p className="empty-queue-message">The queue is empty.</p>
            </div>
          )}
        </div>

        {queueNicknames.length >= 5 ?
          <button
            disabled
            className="joiner-button"
          >
            Queue full
          </button>
        :
          <button 
              className="joiner-button" 
              onClick={handleNextPage}
          >
            {allCourtsFull ? "Join Queue" : "Start Playing"}
          </button>
        }

        {/* Button for if courts are not full */}
      </div>
    </div>
  );
};

export default JoinCourt;
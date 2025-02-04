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
        context.setExpectedWaitTime(locationWaitData.expectedWaitTime);
    }

    getLocationWaitData();
  }, []);

  return (
    <div className="court-joiner">

      {/* Page heading */}
      <div className="heading">
        <h2 className="title">{selectedLocation}</h2>
        <h3 className="subtext">Tennis Courts</h3>
      </div>
      {/* Label for Selecting location */}
      
      <div className="wait-time">
        <img src={clockIcon} alt="Clock Icon" className="button-icon" />
        <p>Current queue time - {context.expectedWaitTime * 60} minutes</p>
      </div>
      <div className="bottom-border"></div>

      <div className="players-in-front">
        <h3 className="subtext">Players in front of you</h3>

        <ol>
          {queueNicknames.map((nickname) => {
            return <li>{nickname}</li>
          })}
        </ol>
      </div>

      <div className="bottom-border"></div>

    {queueNicknames.length >= 5 ?
      <button
        disabled
        className="next-button">
        Queue full
      </button>
     :
      <button 
          className="next-button" 
          onClick={handleNextPage}
        >
        {allCourtsFull ? "Join Queue" : "Start Playing"}
      </button>
    }

      {/* Button for if courts are not full */}
      
    </div>
  );
};

export default JoinCourt;
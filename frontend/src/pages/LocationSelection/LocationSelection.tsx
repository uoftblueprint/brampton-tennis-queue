import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LocationSelection.css';
import { LocalStorageContext } from '../../context/LocalStorageContext';

const LocationSelection: React.FC = () => {
  const context = useContext(LocalStorageContext);

  // Sample locations list
  const locations = ["Cassie Campbell"];

  // State to store the selected location
  // Use this state to access the user selected location for queue purposes
  const [selectedLocation, setSelectedLocation] = useState<string>('');

  // State to track if the current time is within the valid range
  const [isWithinTimeRange, setIsWithinTimeRange] = useState<boolean>(false);

  // Hook for navigating to the next page
  const navigate = useNavigate();

  // Check if the current time is between the hours of operation (only on page load)
  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const options = { timeZone: "America/New_York", hour12: false, hour: "numeric" };
      const hour = Number(new Intl.DateTimeFormat("en-US", options).format(now));
      const startHour = 8; // 8 AM
      const endHour = 23; // 11 PM
      setIsWithinTimeRange(hour >= startHour && hour < endHour);
    };
    checkTime();
  }, []); // Run only on page load

  // Handle location change
  const handleLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLocation(event.target.value);
    context.setSelectedLocation(event.target.value);
  };

  // Handle the navigation button click
  const handleNextPage = () => {
    if (selectedLocation) {
      navigate('/join-court'); // Navigate to the next page
    } else {
      alert('Please select a location before proceeding.');
    }
  };

  return (
    <div className="location-selection">

      <div className="big-header">
        {/* Page heading */}
        <h2 className="big-header-title"><span>Brampton</span><br/>Tennis Queue</h2>
      </div>

      <div className='content'>
        {/* Label for Selecting location */}
        <label htmlFor="locationDropdown" className="label">
          Select a community centre to play
        </label>

        {/* Select dropdown menu */}
        <select
          className="dropdown"
          value={selectedLocation}
          onChange={handleLocationChange}
          disabled={!isWithinTimeRange} // Disable selection outside time range
        >
          <option value="">Select from...</option>
          {locations.map((location, index) => (
            <option key={index} value={location}>
              {location}
            </option>
          ))}
        </select>

        {/* Simple Next Page Button */}
        <button 
          className="next-button" 
          onClick={handleNextPage}
          disabled={!isWithinTimeRange || !selectedLocation} // Disable button outside time range
        >
          Next
        </button>

        {/* Time restriction warning message */}
        {!isWithinTimeRange && (
          <p className="time-warning">Courts are available between 8 AM and 11 PM EST. Refresh this page during the valid time range.</p>
        )}
      </div>
    </div>
  );
};

export default LocationSelection;
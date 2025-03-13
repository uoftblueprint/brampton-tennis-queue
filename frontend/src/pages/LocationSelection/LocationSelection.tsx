import React, { useContext, useState } from 'react';
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

  // Hook for navigating to the next page
  const navigate = useNavigate();

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
          onChange={handleLocationChange}        >
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
          disabled={!selectedLocation}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default LocationSelection;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LocationSelection.css';

const LocationSelection: React.FC = () => {
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
    localStorage.setItem('selectedLocation', event.target.value);
  };

  // Handle the navigation button click
  const handleNextPage = () => {
    if (selectedLocation) {
      navigate('/user-info'); // Navigate to the next page
    } else {
      alert('Please select a location before proceeding.');
    }
  };

  return (
    <div className="location-selection">

      {/* Page heading */}
      <h2 className="title"><span>Brampton</span><br/>Tennis Queue</h2>
      {/* Label for Selecting location */}
      <div id='selection-container'>
        <label htmlFor="locationDropdown" className="label">
          Select Community Centre
        </label>

        {/* Select dropdown menu */}
        <select
          id="locationDropdown"
          className="dropdown"
          value={selectedLocation}
          onChange={handleLocationChange}
        >
          <option value="">Select from...</option>
          {locations.map((location, index) => (
            <option key={index} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>

      {/* Simple Next Page Button */}
      <button 
        className="next-button" 
        onClick={handleNextPage}
      >
        Next
      </button>
    </div>
  );
};

export default LocationSelection;
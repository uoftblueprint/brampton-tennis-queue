import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LocationSelection.css';

const LocationSelection: React.FC = () => {
  // Sample locations list
  const locations = ["Cassie Campbell", "Option 1", "Option 2"];

  // State to store the selected location
  // Use this state to access the user selected location for queue purposes
  // By default, select the first location (Cassie Campbell)
  const [selectedLocation, setSelectedLocation] = useState<string>(locations[0]);


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
      <h2 className="title">Brampton Tennis Queue</h2>
      {/* Label for Selecting location */}
      <label htmlFor="locationDropdown" className="label">
        Select Community Centre
      </label>
      <br></br>

      {/* Select dropdown menu */}
      <select
        id="locationDropdown"
        className="dropdown"
        value={selectedLocation}
        onChange={handleLocationChange}
      >
        <option value="" disabled>Select From...</option>
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
      >
        Next
      </button>
    </div>
  );
};

export default LocationSelection;

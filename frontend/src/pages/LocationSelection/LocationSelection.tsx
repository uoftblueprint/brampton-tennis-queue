import React, { useState } from 'react';
import './LocationSelection.css';

const LocationSelection: React.FC = () => {
  // State to store the selected location
  // Use this state to access the user selected location for queue purposes
  const [selectedLocation, setSelectedLocation] = useState<string>('');

  // Sample locations list
  const locations = ["Cassie Campbell", "Option 1", "Option 2"];

  // Handle location change
  const handleLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLocation(event.target.value);
    localStorage.setItem('selectedLocation', event.target.value);
  };

  // Handle the navigation button click
  const handleNextPage = () => {
    if (selectedLocation) {
      //TODO: add navigation to next page
      window.location.href = '/selected-location'; // Navigate to the selected location page
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

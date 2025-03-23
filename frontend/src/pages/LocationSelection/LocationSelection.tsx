import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LocationSelection.css';
import { LocalStorageContext } from '../../context/LocalStorageContext';

const LocationSelection: React.FC = () => {
  // Get context to save selected location globally
  const context = useContext(LocalStorageContext)!;

  // React Router hook for navigation
  const navigate = useNavigate();

  // List of available locations (can be expanded later)
  const locations = ["Cassie Campbell"];

  // State to store user's selected location
  const [selectedLocation, setSelectedLocation] = useState<string>('');

  // Handle dropdown change: update local state and context
  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedLocation(value);
    context.setSelectedLocation(value); // Store in global context
  };

  // Navigate to the next page only if location is selected
  const handleNextPage = () => {
    navigate('/join-court');
  };

  return (
    <div className="location-selection">
      {/* Page header */}
      <div className="big-header">
        <h2 className="big-header-title">
          <span>Brampton</span><br />Tennis Queue
        </h2>
      </div>

      <div className='content'>
        {/* Dropdown label */}
        <label htmlFor="locationDropdown" className="label">
          Select a community centre to play
        </label>

        {/* Dropdown for selecting a location */}
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

        {/* "Next" button: disabled until a location is selected */}
        <button
          className="next-button"
          onClick={handleNextPage}
          disabled={!selectedLocation} // disables button if no selection
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default LocationSelection;

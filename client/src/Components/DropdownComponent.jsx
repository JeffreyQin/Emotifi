import React, { useState } from 'react';
import ReadingComponent from './ReadingComponent';
import './DropdownComponent.css';
import startbutton from '../Assets/startbutton.png'; // Adjust the path as needed
import PropTypes from 'prop-types';

const DropDownComponent = ({onSelect, handleImageUpdate, setIsReading, setMood}) => {
  const [selection, setSelection] = useState('');
  const [showReading, setShowReading] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State to manage loading indicator
  
  const handleSelectionChange = (event) => {
    const selectedValue = event.target.value;
    setSelection(selectedValue);
    onSelect(selectedValue);
  };

  const handleStartClick = async () => {
    setMood('stressed')
    setIsReading(true)
    if (!selection) {
        alert('Please make a selection first.');
        return;
    }
    setIsLoading(true); // Start loading
    setShowReading(true); //  state to show the ReadingComponent

    try {
      const response = await fetch('http://localhost:5001/infer-mood-brainwave')
      setIsReading(false)
      if (response.ok) {
        const data = await response.json();
        console.log("Success:", data);
        handleImageUpdate(
          `http://localhost:5001/images/before_processing.png?${Date.now()}`,
          `http://localhost:5001/images/after_processing.png?${Date.now()}`
        );
      } else {
        const errorData = await response.text();  // Assuming the server might send plain text error messages
        throw new Error(`Server responded with status ${response.status}: ${errorData}`);
      }
    } catch (error) {
      console.error('Error:', error.message);
      alert(`Failed to fetch: ${error.message}`);
    } finally { 
      setIsLoading(false); //end loading 
    }
  };


  return (
    <div>
      <select onChange={handleSelectionChange}>
        <option value="">Select an option</option>
        <option value="sample">Use a sample brainwave recording</option>
        <option value="own">Use your own brainwaves - requires headset configuration</option>
      </select>
      <div onClick={handleStartClick} style={{ cursor: 'pointer' }}>
        <img src={startbutton} alt="Start" className="startbutton" />
      </div>
      {isLoading && <div>loading...</div>} 
      {showReading && <ReadingComponent />}
    </div>
  );
};

export default DropDownComponent;

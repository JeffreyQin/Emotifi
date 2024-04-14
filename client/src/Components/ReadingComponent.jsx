// ReadingComponent.jsx
import React, { useEffect, useRef } from 'react';
import './ReadingComponent.css';
import reading from '../Assets/reading.mp4'; // Your video path

const ReadingComponent = ({ isLoading, stopVideo }) => {
  const videoRef = useRef(null); // Create a ref for the video element

  useEffect(() => {
    // This effect runs when the stopVideo prop changes
    if (stopVideo && videoRef.current) {
      videoRef.current.pause(); // Pause the video if stopVideo is true
      videoRef.current.currentTime = 0; // Optionally reset the video to the start
    }
  }, [stopVideo]);  // Depend on the stopVideo state


  return (
    <div className="video-container">
      {isLoading && (
        <div className="loading-overlay">
          Loading...
        </div>
      )}
      <video
        ref={videoRef}  // Attach the ref to the video element
        width="1920"
        height="1080"
        autoPlay
        muted
        preload="auto"
        controls
        style={{ display: isLoading ? 'none' : 'block' }}  // Hide video while loading
      >
        <source src={reading} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default ReadingComponent;

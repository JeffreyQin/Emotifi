import React, { useState, useEffect } from 'react';
import './ImagesDisplay.css'; 

const ImagesDisplay = ({ beforeProcessingUrl, afterProcessingUrl }) => {
  const [loadingBefore, setLoadingBefore] = useState(true);
  const [loadingAfter, setLoadingAfter] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadImageBefore = new Image();
    const timestamp = Date.now();
    loadImageBefore.src = beforeProcessingUrl;
    loadImageBefore.onload = () => setLoadingBefore(false);
    loadImageBefore.onerror = () => {
      setError('Failed to load before processing image');
      setLoadingBefore(false);
    };

    const loadImageAfter = new Image();
    loadImageAfter.src = `${afterProcessingUrl}?${timestamp}`;
    loadImageAfter.onload = () => setLoadingAfter(false);
    loadImageAfter.onerror = () => {
      setError('Failed to load after processing image');
      setLoadingAfter(false);
    };

    // Cleanup function to avoid setting state on unmounted component
    return () => {
      loadImageBefore.onload = null;
      loadImageBefore.onerror = null;
      loadImageAfter.onload = null;
      loadImageAfter.onerror = null;
    };
  }, [beforeProcessingUrl, afterProcessingUrl]);

  const isLoading = loadingBefore || loadingAfter; // True if either image is still loading

  return (
    <div className="images-display-container">
      <div className="text-container">
        <h2>EEG Bandpass Frequency Samples</h2>
        {isLoading && <p>Loading images...</p>}
        {error && <p>Error: {error}</p>}
      </div>

      {!isLoading && !error && (
        <><div className="image-container">
        <h2>Before Processing</h2>
        <img src={`${beforeProcessingUrl}?${Date.now()}`} alt="Before Processing" onError={() => setError('Failed to load before processing image')} />
      </div>
      <div className="image-container">
        <h2>After Processing</h2>
        <img src={`${afterProcessingUrl}?${Date.now()}`} alt="After Processing" onError={() => setError('Failed to load after processing image')} />
      </div>
        </>
      )}
    </div>
  );
};

export default ImagesDisplay;

import React, { useState, useEffect } from 'react';

const EventStreamComponent = () => {
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to initialize the EventSource
  const startStreaming = () => {
    setLoading(true);
    setError('');
    setResult('');

    const evtSource = new EventSource('http://localhost:5001/analyze-image');

    evtSource.onmessage = function(event) {
      const data = JSON.parse(event.data);
      if (data.error) {
        console.error('Error from server:', data.error);
        setError(data.error);
        evtSource.close();  // Close the stream if there's an error
      } else {
        setResult(prevResult => prevResult + data.message + '\n');
      }
    };

    evtSource.onerror = function(event) {
      console.error('EventSource failed:', event);
      setError('Failed to connect to the event stream. ReadyState: ' + evtSource.readyState);
      evtSource.close();  // Close the stream on error
      setLoading(false);
    };

    evtSource.onopen = function() {
      console.log("Connection to server opened.");
    };

    // Close the connection when the component unmounts
    return () => evtSource.close();
  };

  return (
    <div>
      <h3>Server-Sent Events Output:</h3>
      <button onClick={startStreaming} disabled={loading}>
        {loading ? 'Processing...' : 'Analyze Image'}
      </button>
      {error ? <p>Error: {error}</p> : <pre>{result}</pre>}
    </div>
  );
};

export default EventStreamComponent;

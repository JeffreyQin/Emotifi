import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './ImageGenerator.css';
import { useMood } from '../../Context/MoodContext';
import { fetchAnalysisResult } from '../../Components/ImageSentimentAnalyzer'

const ImageGenerator = ({ setGeneratedArt, mood }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // const { mood } = useMood(); // Use the mood from context

  useEffect(() => {
    if (!mood) {
      setError('Mood is not set yet');
    }
  }, [mood]); // Depend on mood changes

  const fetchGeneratedImage = () => {
    setLoading(true);
    setError('');
    console.log(mood);
    
    const apiUrl = `http://localhost:5001/get-art?mood=${mood}`;
    const postData = { 'mood': mood }; // Using mood from the context

    /*
    axios.post(apiUrl, postData, {
        headers: {
            'Content-Type': 'application/json'
        },
        responseType: 'blob'
    })
    */
    axios.get(apiUrl)
    .then(response => {
      const url = URL.createObjectURL(new Blob([response.data]));
      setImageUrl(`http://localhost:5001/images/abstract_art.png`)
      setLoading(false);

      // call sentiment analyzer
      setGeneratedArt(true)
    })
    .catch(err => {
        setError('Failed to load generated image. ' + err.message);
        setLoading(false);
        console.error('Error fetching the generated image:', err);
    });
  };

  return (
    <div className='ai-image-generator'>
      <div className="header">Emotion AI <span>Visualization</span></div>
      {isLoading ? (
        <p>Loading...</p>
      ) : imageUrl ? (
        <div className="image">
          <img src={imageUrl} alt="Generated Art" onError={() => setError('Failed to load image')} />
        </div>
      ) : (
        error && <p>Error: {error}</p>
      )}
      <p>This artwork is generated from your mood analyzed from your brainwave signals:</p>
      <div className="generate-btn" onClick={fetchGeneratedImage}>
        Request Image
      </div>
    </div>
  );
};

export default ImageGenerator;

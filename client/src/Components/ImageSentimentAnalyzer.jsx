import React, { useEffect, useState, useContext } from 'react';
import { useMood } from '../Context/MoodContext'

const ImageSentimentAnalyzer = ({ generatedArt, mood }) => {
  const [analysisResult, setAnalysisResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAdvice, setLoadingAdvice] = useState(true)
  // const { mood } = useMood();
  const [adviceRequested, setAdviceRequested] = useState(false)
  const [adviceResult, setAdviceResult] = useState('')
  
  const requestAdvice = async () => {
    setAdviceRequested(true)

    try {
      const response = await fetch(`http://localhost:5001/get-advice?mood=${mood}`); //requestOptions);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAdviceResult(data['result']); // Adjust based on the response structure
    } catch (error) {
      console.error('Error fetching advice:', error);
      setAdviceResult('Error fetching advice.');
    } finally {
      setLoadingAdvice(false);
    }
  };

  const fetchAnalysisResult = async () => {

    const file = 'static/images/abstract_art.png'

    let onloading = 'true'
    if (generatedArt === true) {
      onloading = 'false'
    }
    /*
    const formData = new FormData();
    formData.append('mood', mood); // Example mood
    formData.append('art', file); 
    const requestOptions = {
      method: 'POST',
      body: formData,
      headers: {
          'Content-Type': 'multipart/form-data' // Correctly set the Content-Type for file upload
      },
    };
    */

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5001/analyze-image?mood=${mood}&art=${file}&onload=${onloading}`); //requestOptions);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAnalysisResult(data['result']); // Adjust based on the response structure
    } catch (error) {
      console.error('Error fetching analysis:', error);
      setAnalysisResult('Error fetching analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {

    console.log(generatedArt)
    fetchAnalysisResult()

  }, [generatedArt]);

  if (!mood) {
    return <p>Loading...</p>; // Or any other loading indicator
  }

  return (
    <div>
    <div>
      <h1>Analysis of Generated Artwork</h1>
      {isLoading ? (
        <h3>Loading analysis...</h3>
      ) : (
        <div>
          <h3>Analysis Result:</h3>
          <p>{JSON.stringify(analysisResult)}</p>
        </div>
      )}
    </div>
    <div>
      <h3>Advice</h3>
      {!adviceRequested? (
        <button onClick={requestAdvice} type='button'>
          Get advice
        </button>
      ): null}
      {adviceRequested && loadingAdvice === true? (
        <h3>Loading advice ...</h3>
      ): (
        <div>
          <p>{JSON.stringify(adviceResult)}</p>
        </div>
      )}
      </div>
    </div>
    
  );
};

export default ImageSentimentAnalyzer;

//<iframe src="https://open.spotify.com/embed/playlist/37i9dQZF1EIgG2NEOhqsD7?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
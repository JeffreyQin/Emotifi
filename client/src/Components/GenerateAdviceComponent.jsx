import React, { useState } from 'react';

const GenerateAdviceComponent = () => {
  const [advice, setAdvice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mood, setMood] = useState(''); // Assume mood can be set elsewhere or added as a prop
  const [art, setArt] = useState(''); // Assume art description is available or added as a prop

  const fetchAdvice = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('mood', mood);
      formData.append('art', art);

      const response = await fetch('http://localhost:5001/get-advice', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch advice');
      }

      const adviceText = await response.text(); // Assuming the response is just plain text
      setAdvice(adviceText);
    } catch (error) {
      console.error('Error fetching advice:', error);
      setAdvice('Error fetching advice.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h3>Get Customized Artwork Advice</h3>
      <button onClick={fetchAdvice} disabled={isLoading}>
        {isLoading ? 'Fetching Advice...' : 'Get Advice'}
      </button>
      {advice && <div><p>Advice:</p><p>{advice}</p></div>}
    </div>
  );
};

export default GenerateAdviceComponent;

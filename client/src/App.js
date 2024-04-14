import React, { useState, useRef, useContext } from 'react';
import ImagesDisplay from './Components/ImagesDisplay'; // Adjust the path as needed
import { useMood, MoodProvider } from './Context/MoodContext'; 
import './App.css';
import EventStreamComponent from './Components/EventStreamComponent'
import ImageSentimentAnalyzer from './Components/ImageSentimentAnalyzer';
import ReadingComponent from './Components/ReadingComponent';
import ImageGenerator from './Assets/ImageGenerator/ImageGenerator';
import LandingComponent from './Components/LandingComponent'; 
import AudioRecorder from './Components/AudioRecorder';
import { FaArrowDown } from 'react-icons/fa'; 
import { useEffect } from 'react';
import DropdownComponent from './Components/DropdownComponent';
import InferMoodComponent from './Components/InferMoodComponent'; // Adjust path as necessary

let animationController;

function App() {

  let [recordOption, setRecordOption] = useState("audio");
  // Existing state and refs (video constants)

  const [mood, setMood] = useState(null)
  const [isLoading, setIsLoading] = useState(false);
  const [showArrow, setShowArrow] = useState(false);
  const [selection, setSelection] = useState(false);
  const [images, setImages] = useState([]); // To store fetched image URLs
  const [stopVideo, setStopVideo] = useState(false);
  const [showReadingComponent, setShowReadingComponent] = useState(false);
  const [beforeProcessingUrl, setBeforeProcessingUrl] = useState('');
  const [art, setArt] = useState('');
  const [afterProcessingUrl, setAfterProcessingUrl] = useState('');
  const beforeUrl = 'http://localhost:5001/static/images/before_processing.png';
  const afterUrl = 'http://localhost:5001/static/images/after_processing.png';
  const [isReading, setIsReading] = useState(false)
  const [generatedArt, setGeneratedArt] = useState(false)
  const [generatedMusic, setGeneratedMusic] = useState(false)
  const toggleRecordOption = (type) => {
    return () => {
        setRecordOption(type);
    };
};
  const handleImageUpdate = (beforeUrl, afterUrl) => {
    setBeforeProcessingUrl(beforeUrl);
    setAfterProcessingUrl(afterUrl);
  };

  const handleArtUpdate = (stablediffusionArt)=>{
    setArt(generatedArt);
};

  // const { mood, setMood } = useMood() ?? {};


  //webaudio constants
  const [file, setFile] = useState(null);
  const canvasRef = useRef();
  const audioRef = useRef(); 
  const source = useRef(); 
  const analyzer = useRef();

   // Logic to handle audio play
  const handleAudioPlay = () => {
    let audioContext = new AudioContext();
    if (!source.current) {
      source.current = audioContext.createMediaElementSource(audioRef.current);
      analyzer.current = audioContext.createAnalyser();
      source.current.connect(analyzer.current);
      analyzer.current.connect(audioContext.destination);
    }
    visualizeData();
  };

  // Visualization logic
  const visualizeData = () => {
    animationController = window.requestAnimationFrame(visualizeData);
  if (audioRef.current.paused) {
    return cancelAnimationFrame(animationController);
  }
  const songData = new Uint8Array(140);
  analyzer.current.getByteFrequencyData(songData);
  const bar_width = 3;
  let start = 0;
  const ctx = canvasRef.current.getContext("2d");
  ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  for (let i = 0; i < songData.length; i++) {
    // compute x coordinate where we would draw
    start = i * 4;
    //create a gradient for the  whole canvas
    let gradient = ctx.createLinearGradient(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    gradient.addColorStop(0.2, "#2392f5");
    gradient.addColorStop(0.5, "#fe0095");
    gradient.addColorStop(1.0, "purple");
    ctx.fillStyle = gradient;
    ctx.fillRect(start, canvasRef.current.height, bar_width, -songData[i]);
  }
  }; 

  // triggers loading
  const handleGenerate = async () => {
    setIsLoading(true);
    setShowReadingComponent(true);
    
    setTimeout(() => {
      console.log("Setting isLoading to false and stopping video");

      setIsLoading(false);
      setStopVideo(true); // stop video in ReadingComponent
      // fetchImages(); // fetch images after stopping the video 
    }, 3000); 
  };

  useEffect(() => {
    // Show the arrow after 1 second
    const timer1 = setTimeout(() => {
      setShowArrow(true);
    }, 1000);

    // Hide the arrow after an additional 2 seconds
    const timer2 = setTimeout(() => {
      setShowArrow(false);
    }, 8000);

    // Clear timeouts when component unmounts
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

/*connect React application with backend route for create_audio.py
const handleGenerateMidi = async () => {
  const notes =  convert data to the required format;
  const response = await fetch('http://localhost:5000/generate-midi', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({notes}),
  });

  if (response.ok) { 
    const blob = await response.blob();
    const url = URL.createObjectUTL(blob);
    setFile(url); //assuming setFile will then set the audio source 
  } else {
    console.error('Failed to generate MIDI');
  }
};
*/

  const getMusic = async () => {
    await fetch(`http://localhost:5001/get-music?mood=${mood}`)
    setGeneratedMusic(true)

    const filename = 'music.mid'

  }

  return (
    <MoodProvider>
    <div className="App">
      <LandingComponent />
      <ImagesDisplay 
      beforeProcessingUrl={beforeUrl}
      afterProcessingUrl={afterUrl}
      />
      <DropdownComponent 
        onSelect={setSelection} 
        handleImageUpdate={handleImageUpdate} 
        setIsReading={setIsReading}
        setMood={setMood}
        />
        {selection === 'sample' && <InferMoodComponent />}
        {isReading ? (
          <ReadingComponent 
          isLoading={isLoading} 
          showReadingComponent={showReadingComponent} 
        />
        ): null}
      <div>
        <h3>
          Current mood: stressed
        </h3>
      </div>; 
      <div>
      {recordOption === "audio" ? <AudioRecorder setMood={setMood} mood={mood}/> : <AudioRecorder setMood={setMood} mood={mood}/>}
      </div>
      <ImageGenerator isLoading={isLoading} setGeneratedArt={setGeneratedArt} mood={mood} />
      {showArrow && (
        <div className="scroll-down">
          <FaArrowDown />
          <p>Scroll Down</p>
        </div>
      )}
      <ImageSentimentAnalyzer generatedArt={generatedArt} mood={mood}/>
      

<div className="music-generator-heading">
    <h2>Play Music Generated by Gemini based on your Emotions</h2>
    {generatedMusic? (
      <p>Done!</p>
    ): (
    <button onClick={getMusic}>
      Save Music
    </button>
    )}
    
  </div>
      <canvas ref={canvasRef} width={500} height={200} />

      {images.map((url, index) => (
        <div key={index}>
          <img src={url} alt={index === 0 ? "Before Processing" : "After Processing"} />
          <p>{index === 0 ? "Before" : "After"} processing EEG signals.</p>
        </div>
      ))}
      <p>
        Emotifi calls a BrainFlow BoardShim API to filter their EEG. This process involves leveraging a bandpass filter called Butter Worth to decompose data into component frequency bands optimal for analyzing emotional state, from very low frequency Delta waves oscillating at 0.1 Hertz to high-frequency Gamma waves oscillating at 40 Hertz. This pre-processed data is fed to a mood classifier ML model.
      </p>
    </div>
    </MoodProvider>
  );
}

export default App;
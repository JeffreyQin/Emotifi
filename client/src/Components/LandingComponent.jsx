import React from 'react';
import './LandingComponent.css'; // Import the CSS file for styling
import beginning from '../Assets/beginning.mp4';
import BCI from '../Assets/BCI.mp4';

const LandingComponent = () => {
  return (
    <div className="video-container">
      <video width="1920" height="1080" autoPlay muted loop>
        <source src={beginning} type="video/mp4" />
      </video>

      <div className="about-section">
        <h2>About This Project</h2>
        
        <p>
         FMRI studies have shown that most adults with ADHD don’t know how to express feelings. However, as people with ADHD tend to excel in thinking outside the box, art therapy has proven to create natural moments to express thoughts and feelings in an environment that is often less threatening than talk therapy. 
        </p>
        
        <video width="320" height="240" autoPlay muted loop controls>
          <source src={BCI} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        <h2>How to use Emotifi</h2>
        <p>
        The OpenBCI Cyton headset analyzes your EEG (electroencephalogram) by measuring the electrical activity of the brain and infers your mood. The signals are then converted into audio and visual representations with the help of Google's RAG (Retrieval-Augmented Generation) enhanced Vertex AI Gemini Pro. To check out what your brain signals can generate, put on the headset and press start!
        </p>

      </div>
    </div>
  );
};

export default LandingComponent;

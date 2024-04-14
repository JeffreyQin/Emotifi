# Introducing Emotifi

## Inspiration :red_circle:
ADHD affects more than 8 million individuals worldwide. FMRI studies have shown that most adults with ADHD don’t know how to express feelings. However, as people with ADHD tend to excel in thinking outside the box, art therapy has proven to create natural moments to express thoughts and feelings in an environment that is often less threatening than talk therapy. 

## What it does :yellow_circle:
When the user puts on the OpenBCI headset powered by the Cyton board, we call a BrainFlow BoardShim API to filter their EEG(electroencephalogram). This process involves leveraging a bandpass filter called Butter Worth to decompose data into component frequency bands optimal for analyzing emotional state, from very low frequency Delta waves oscillating at 0.1 Hertz to high-frequency Gamma waves oscillating at 40 Hertz. This pre-processed data is fed to a mood classifier ML model with LSTM layers which we have labelled and recorded for 3 hours, effectively extracting the FFT (Fast-Fourier-Transformation) model. 
We also provide users with the option to talk about their feelings through an audio recording which then leverages the Gemini 1.5 Pro multimodal ability of native audio understanding, to receive advice on ADHD management. 
Through prompt engineering we make calls to Stable Diffusion and Gemini to generate art and MIDI file, respectively. 

## How we built it  :green_circle:
Emotify.AI uses Vertex AI Gemini Pro enhanced with RAG (Retrieval-Augmented Generation) on culture-specific ADHD medical literature to provide advice on managing behaviour using Gemini’s embedding service. Emotifi leverages the multimodal Gemini Vision AI to perform sentiment analysis on the EEG-generated artwork, a pipeline which has been fine-tuned with publications of clinical methodology in Jungian psychology to simulate a professional art therapy session. We used Model.generate_content with multimodal input. Text-to-music

## Accomplishments we’re proud of :large_blue_circle:

Bringing intelligence to wellness. 
Building an interactive, fully functional software application to help those facing difficulties expressing their emotions by providing a creative outlet through visual and auditory mediums. 
Operating and collaborating under a time constraint. 
We're especially happy that we had the opportunity to use the newest Gemini features along with the hardware in our hack, as it provides a unique aspect to our solution.

## What we learned :white_circle:
We learned a lot about the new horizons and current limitations of multimodal ai models. Navigating the Google-Gemini Cookbook we learned to use SafetyRatings check for the genai.GenerateContentResponse to ensure user safety. Multimodal Retrieval Augmented Generation(MM-RAG): Augmenting the generation from Large Multimodal Models(LMMs) with multimodal retrieval of images and more


## Challenges we ran into :black_circle:
Streaming to the frontend was not very feasible, although we spent extensive hours trying to implement it, we could only handle return chunks of the response in the backend, using the Python SDK. We tried looking into server-sent events (SSE) protocol and JavaScript APIs (Fetch)  to send a one-time analysis result using the text/event-stream MIME type, but further investigation is needed. 

# Built with 

- **Frontend**: React, HTML/CSS, JavaScript
- **Hardware**: OpenBCI, Brainflow
- **Backend**: Flask, Gemini API, LangChain (for Retrieval-augmented generation), Stable Diffusion API
- **Machine learning**: PyTorch, NumPy, Pandas

## What’s next for Emotify.AI
We're thinking of building a 'Be Real' like social media plattform, where people will be able to post the art they generated on a daily basis to their peers. We're also planning on improving the brain2music feature using MusicLM from Google's AI Test Kitchen, where users can not only see how they feel, but what it sounds like as well. 


# !pip install -U -q google.generativeai

import google.generativeai as genai
import os, json, dotenv
from PIL import Image

import create_audio
dotenv.load_dotenv()
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

genai.configure(api_key=GEMINI_API_KEY)

text_model = genai.GenerativeModel('gemini-pro')
vision_model = genai.GenerativeModel('gemini-pro-vision')
audio_model = genai.GenerativeModel('models/gemini-1.5-pro-latest')

""" ANALYSIS """

def get_analysis(mood, img_path):

    img = Image.open(img_path)
    prompt = f"""You are a professional art therapist and you are analyzing an abstract artwork based on a person with ADHD. 
    Their current mood is {mood}. The artwork was created based on the mood they are feeling. 
    Tell us your artistic interpretation of the art and how the person with ADHD might be feeling at the psychological level."
    """

    response = vision_model.generate_content([prompt, img], stream=False)
    return response.text
    """
    for chunk in vision_model.generate_content([prompt, img], stream=True):
        print(chunk.text)
        yield chunk.text
    """

def get_music(mood):

    prompt = f"""I need you to produce a musical piece in the form of a sequence of individual notes.
    Each note is represented as a tuple of two elements: the pitch (integer) and the duration (float)

    The pitch of each note should be a number from 21 (represents note A0, 2750 Hz) to 96 (represents C7 - 2093 Hz)

    The duration of each note should be one of the following:
    2 for a double whole note
    1 for a whole note
    0.5 for a half note
    0.25 for a quarter note
    0.125 for an eighth note
    The greater the number, the longer and slower the note. The smaller the number, the shorter and faster the note.

    Generate your musical piece by indicating the sequence of notes in the following format:
    [(note, duration), (note, duration), (note, duration), etc.]

    Make sure your melody contains a combination of notes with different pitches and durations, but adheres to a certain mental state that I provide to you

    1. The melody for a stressed and tired mental state should be slow, have low pitches and small pitch differences in between different notes
    2. The melody for an angry and frustrated mental state should be fast, have a diversity of low and high pitches, with large jumps in between notes
    3. The melody for a fear and unsettled mental state should mostly be slow and have low pitches, but occasional get fast with high pitches
    4. The melody for an excited and energetic mental state should be fast and have very high note pitches
    5. The melody for a relaxed and peaceful mental state should be slow, and have medium or high note pitches

    Things to prevent in any melody:
    
    1. a number of consecutive notes whose pitches increase or decrease by 1 each time
    2. a large number of consecutive notes with the same duration

    Based on these rules, generates a melody with around 20 to 30 notes based on a {mood} mental state
    """

    response = text_model.generate_content(prompt, stream=False)
    response = response.text
    print(response)

    response = response.replace(' ', '').replace('\n', '')
    response = '[' + response.split('[')[1]
    response = response.split(']')[0] + ']'

    notes = [(int(x), float(y)) for x, y in eval(response)]
    return notes


def get_mood_from_audio(audio_path):
    audio = genai.upload_file(path=audio_path)
    prompt = """The given audio is a conversation between an ADHD patient and a psychological therapist.
    Based on the content of the conversation, deduce the current mood of the ADHD patient as exactly one of the following
    relaxed
    stressed
    angry
    fear
    excited
    Respond in the form of the following json
    {
        "mood": mood_result
    }
    where mood_result is one of relaxed, stressed, angry, fear, excited
    """
    response = audio_model.generate_content([prompt, audio], stream=False)
    response = response.text

    response = '{' + response.split('{')[1]
    response = response.split('}')[0] + '}'
    response = json.loads(response)
    return response['mood']

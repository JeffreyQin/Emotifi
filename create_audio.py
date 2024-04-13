from flask import Flask, request, send_file 
from flask_cors import CORS 
import mido
import pygame
import os
import uuid 

# midi creation config
TICKS_PER_BEAT = 480
BEATS_PER_MINUTE = 120
TICKS_PER_SECOND = TICKS_PER_BEAT * BEATS_PER_MINUTE / 60

# pygame mixer config
INIT_FREQ = 44100
INIT_BITSIZE = -16
INIT_NUM_CHANNELS = 2
INIT_BUFFER = 512

# midi file path
MIDI_PATH = 'music.midi'

def create_midi(notes, midi_path):

    midi_file = mido.MidiFile(ticks_per_beat=TICKS_PER_BEAT)
    midi_track = mido.MidiTrack()
    midi_file.tracks.append(midi_track)

    for (note, duration) in notes:
        midi_track.append(mido.Message(type='note_on', note=note, velocity=64, time=0))
        midi_track.append(mido.Message(type='note_off', note=note, velocity=64, time=int(duration * TICKS_PER_SECOND)))

    midi_file.save(midi_path)


def play_midi(midi_path):

    pygame.mixer.init(frequency=INIT_FREQ, size=INIT_BITSIZE, channels=INIT_NUM_CHANNELS, buffer=INIT_BUFFER)
    pygame.mixer.music.set_volume(1)

    try:
        clock = pygame.time.Clock()

        pygame.mixer.music.load(midi_path)
        pygame.mixer.music.play()
        while pygame.mixer.music.get_busy() is True:
            clock.tick(30)
    except KeyboardInterrupt:
        pygame.mixer.music.fadeout(1000)
        pygame.mixer.music.stop()
        raise SystemExit



"""
app = Flask(__name__)
CORS(app) # Enable CORS for all routes 

@app.route('/generate-midi', methods=['POST'])
def generate_midi():
    data = request.json 
    notes = data['notes']

    file_id = str(uuid.uuid4())
    midi_path = f'{file_id}.midi'

    create_midi(notes, midi_path) 

    return send_file(midi_path, as_attachment=True, attachment_filename='')

if __name__ == '__main__':
    app.run(debug=TRUE)

"""
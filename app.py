from flask import Flask, jsonify, request, send_file, Response, send_from_directory, url_for
from flask_cors import CORS, cross_origin
from brainflow.board_shim import BoardShim, BrainFlowInputParams, LogLevels, BoardIds

import subprocess
import os, sys, dotenv
import uuid

from eeg_analyzer import infer

import gemini_RAG
import gemini
from gemini import get_analysis
import eeg_analyzer
import create_audio
import stable_diffusion

app = Flask(__name__, static_folder='static')
CORS(app, 
support_credentials=True, 
resources=
{r"/*": {"origins": "*"},
r"/api/*": {"origins": "http://localhost:3000"},  
r"/images/*": {"origins": "*"}, 
r"/get-art": {"origins": "*", "methods": ["POST", "OPTIONS"]},
r"/analyze-image": {"origins": "http://localhost:3000", "methods": ["POST", "OPTIONS"]},
r"/get-advice": {"origins": "http://localhost:3000", "methods": ["POST", "OPTIONS"]},
r"/infer-mood-brainwave": {"origins": "http://localhost:3000", "methods": ["POST", "OPTIONS"]}
})



@app.route('/infer-mood-brainwave', methods=['GET'])
@cross_origin(origins="http://localhost:3000", methods=["GET"])
def infer_mood_brainwave():
    # assert(request.files['eeg'].filename.endswith('.csv'))
    
    eeg_input_csv_path = 'eeg.csv'
    
    # request.files['eeg'].save(eeg_input_csv_path)

    return {
        'result': 'stressed'
    }
    """
    mood_result = eeg_analyzer.infer(eeg_input_csv_path)
    return {
        'result': mood_result
    }
    """

@app.route('/infer-mood-audio', methods=['GET'])
@cross_origin()
def infer_mood_audio():

    mp3_input_path = 'audio.mp3'

    mood_result = gemini.get_mood_from_audio(mp3_input_path)

    return {
        'result': mood_result
    }


@app.route('/get-art', methods=['GET'])
@cross_origin(origins=["http://localhost:3000"])
def get_art():

    mood = request.args.get('mood')
    print(mood)
    if mood == 'relaxed':
        mood_description = 'relaxation and peace'
    elif mood == 'stressed':
        mood_description = 'stress and anxiety'
    elif mood == 'angry':
        mood_description = 'anger and frustration'
    elif mood == 'excited':
        mood_description = 'excitement and energy'
    elif mood == 'fear':
        mood_description = 'fear and unsettled'

    art_output_png_path = 'static/images/abstract_art.png'
    stable_diffusion.get_abstract_art(mood_description, art_output_png_path)
    return jsonify({
                'brainwave-art': url_for('serve_image', filename=art_output_png_path),
            })

@app.route('/get-music', methods=['GET'])
@cross_origin()
def get_music():


    music_output_midi_path = 'music-downloads/music.mid'

    mood = request.args.get('mood')

    if mood == 'excited':
        mood_description = 'excited and energetic'
    elif mood == 'relaxed':
        mood_description = 'relaxed and peaceful'
    elif mood == 'stressed':
        mood_description = 'stressed and tired',
    elif mood == 'angry':
        mood_description = 'angry and frustrated'
    elif mood == 'fear':
        mood_description = 'fear and unsettled'
    

    notes = gemini.get_music(mood_description)
    create_audio.create_midi(notes, music_output_midi_path)

    return {
        "result": "completed"
    }


@app.route('/get-advice', methods=['GET'])
@cross_origin()
def get_advice():

    mood = request.args.get('mood')
    
    if mood == 'excited':
        mood_description = 'excited and energetic'
    elif mood == 'relaxed':
        mood_description = 'relaxed and peaceful'
    elif mood == 'stressed':
        mood_description = 'stressed, tired, and anxious'
    elif mood == 'angry':
        mood_description = 'angry and frustrated'
    elif mood == 'fear':
        mood_description = 'fear, unsettled, and worried'

    return {
        "result": gemini_RAG.get_advice(mood_description)
    }
    # return Response(gemini_RAG.get_advice(mood_description), content_type='text/event-stream')


@app.route('/analyze-image', methods=['GET'])
@cross_origin()
def analyze_image():

    mood = request.args.get('mood')
    analysis_input_png_path = request.args.get('art')
    onload = request.args.get('onload')

    if onload == 'true':
        return {
            'result': 'No art generated'
        }
    else:
        return {
            'result': gemini.get_analysis(mood, analysis_input_png_path)
        }


@app.route('/infer-mood-hardcoded', methods=['POST'])
@cross_origin()
def infer_mood_direct():
    mood_result = "relaxed"
    return jsonify({'result': mood_result})


@app.route('/images/<filename>')
def serve_image(filename):
    return send_from_directory(app.static_folder + '/images', filename)


@app.route('/handle-selection', methods=['POST', 'OPTIONS'])
@cross_origin(origins="http://localhost:3000", allow_headers=['Content-Type', 'Authorization'], supports_credentials=True)
def handle_selection():
    data = request.get_json()
    selection = data.get('option')
    try:
        if selection == 'sample':
            script_path = 'image_display_sample_eeg.py'
            subprocess.run(['python', script_path], check=True)
            return jsonify({
                'before': url_for('serve_image', filename='before_processing.png'),
                'after': url_for('serve_image', filename='after_processing.png'),
            })
        
        
        elif selection == 'own':
            params = BrainFlowInputParams()
            params.serial_port = 'COM3'
            params.board_id = BoardIds.CYTON_BOARD.value
            data = run_full_session(params)
            
            mood_result = infer_mood(data)
            return jsonify({
                'message': 'EEG session completed successfully and processed',
                'mood_result': mood_result
            })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)

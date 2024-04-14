import gemini
import create_audio as create_audio

mood = 'happy'

text = gemini.get_music_response(mood)
print(text)
create_audio.generate_music(text)




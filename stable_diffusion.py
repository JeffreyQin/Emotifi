import base64
import os, dotenv
import requests

dotenv.load_dotenv()

sd_api_key = os.getenv('SD_API_KEY')

def get_abstract_art(mood, img_path):

    response = requests.post(
        f'https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image',
        headers={
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": f"Bearer {sd_api_key}"
        },
        json={
            "text_prompts": [
                {
                    "text": f'An abstract art that illustrates the mood of {mood}'
                }
            ],
            "cfg_scale": 7,
            "height": 1024,
            "width": 1024,
            "samples": 1,
            "steps": 30,
        }
    )

    if response.status_code != 200:
        raise Exception(str(response.text))

    response = response.json()

    with open(img_path, 'wb') as f:
        result_img = response['artifacts'][0]
        f.write(base64.b64decode(result_img['base64']))


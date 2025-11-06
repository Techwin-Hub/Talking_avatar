from fastapi import FastAPI, Body
from fastapi.responses import FileResponse
from TTS.api import TTS
import uuid

tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2")
app = FastAPI()

@app.post("/speak")
def speak(payload: dict = Body(...)):
    text = payload.get("text", "")
    filename = f"out_{uuid.uuid4()}.wav"
    tts.tts_to_file(text=text, file_path=filename)
    return FileResponse(filename, media_type="audio/wav")

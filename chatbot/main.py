from fastapi import FastAPI
import requests

app = FastAPI()

@app.post("/ask")
def ask_ollama(prompt: str):
    try:
        # Stream Ollama’s output
        with requests.post(
            "http://localhost:11434/api/generate",
            json={"model": "phi3", "prompt": prompt},
            stream=True,
        ) as r:
            r.raise_for_status()
            reply_text = ""
            for line in r.iter_lines():
                if not line:
                    continue
                data = line.decode("utf-8")
                if '"response":"' in data:
                    # extract the text part only
                    part = data.split('"response":"')[1].split('"')[0]
                    reply_text += part
            return {"reply": reply_text.strip()}

    except Exception as e:
        return {"error": str(e)}

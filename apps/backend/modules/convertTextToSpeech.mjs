import fetch from "node-fetch";
import fs from "fs";
import { promisify } from "util";
import { pipeline } from "stream";
import dotenv from "dotenv";

dotenv.config();
const streamPipeline = promisify(pipeline);

const ttsServiceUrl = process.env.TTS_SERVICE_URL || "http://coqui-tts:5002";

async function convertTextToSpeech({ text, fileName }) {
  try {
    const response = await fetch(`${ttsServiceUrl}/speak`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`Unexpected response ${response.statusText}`);
    }

    // The python service returns a wav file, so we need to save it with the correct extension.
    const wavFileName = fileName.replace(".mp3", ".wav");
    await streamPipeline(response.body, fs.createWriteStream(wavFileName));
  } catch (error) {
    console.error("Error converting text to speech:", error);
    throw error;
  }
}

export { convertTextToSpeech };

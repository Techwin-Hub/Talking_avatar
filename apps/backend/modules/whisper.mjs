import { OpenAI } from "openai";
import { convertAudioToMp3 } from "../utils/audios.mjs";
import fs from "fs";
import os from "os";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const openAI = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function convertAudioToText({ audioData }) {
  const mp3AudioData = await convertAudioToMp3({ audioData });
  console.log("MP3 audio data size:", mp3AudioData.length);
  const outputPath = path.join(os.tmpdir(), "output.mp3");
  fs.writeFileSync(outputPath, mp3AudioData);
  const transcription = await openAI.audio.transcriptions.create({
    file: fs.createReadStream(outputPath),
    model: "whisper-1",
  });
  const transcribedText = transcription.text;
  fs.unlinkSync(outputPath);
  return transcribedText;
}

export { convertAudioToText };

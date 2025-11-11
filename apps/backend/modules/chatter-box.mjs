import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import path from "path";

const chatterBoxUrl = "http://127.0.0.1:4123/v1/audio/speech/upload";
const voiceSamplePath = path.join(process.cwd(), "../../chatterbox-tts-api/voice-sample.mp3");

async function convertTextToSpeech({ text, fileName }) {
  try {
    const formData = new FormData();
    formData.append("input", text);
    formData.append("voice_file", fs.createReadStream(voiceSamplePath));

    const response = await axios.post(chatterBoxUrl, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      responseType: "arraybuffer",
    });

    if (response.status === 200) {
      fs.writeFileSync(fileName.replace(".mp3", ".wav"), response.data);
      console.log("✅ Voice-cloned audio saved as", fileName.replace(".mp3", ".wav"));
    } else {
      throw new Error(`Chatter-box request failed with status ${response.status}: ${response.data}`);
    }
  } catch (error) {
    console.error("Error converting text to speech with chatter-box:", error.message);
    throw error;
  }
}

export { convertTextToSpeech };

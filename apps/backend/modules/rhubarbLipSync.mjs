import { exec } from "child_process";
import path from "path";
import fs from "fs/promises";

const getPhonemes = async ({ message }) => {
  try {
    const start = Date.now();
    console.log(`🎙️ Starting conversion for message ${message}`);

    const backendDir = path.resolve("./");
    const audiosDir = path.join(backendDir, "audios");
    const rhubarbPath = path.join(
      backendDir,
      "bin",
      process.platform === "win32" ? "rhubarb.exe" : "rhubarb"
    );

    const mp3File = path.join(audiosDir, `message_${message}.mp3`);
    const wavFile = path.join(audiosDir, `message_${message}.wav`);
    const jsonFile = path.join(audiosDir, `message_${message}.json`);

    // 1️⃣ Convert MP3 → WAV if necessary
    try {
      await fs.access(wavFile);
      console.log(`✅ WAV file already exists for message ${message}. Skipping conversion.`);
    } catch {
      try {
        await fs.access(mp3File);
        console.log(`Converting MP3 to WAV for message ${message}...`);
        await new Promise((resolve, reject) => {
          const cmd = `ffmpeg -y -i "${mp3File}" "${wavFile}"`;
          exec(cmd, (error, stdout, stderr) => {
            if (error) return reject(stderr || error);
            console.log(`✅ MP3→WAV done for message ${message} in ${Date.now() - start}ms`);
            resolve();
          });
        });
      } catch (mp3Error) {
        throw new Error(`Audio source file not found for message ${message}. Neither ${wavFile} nor ${mp3File} exists.`);
      }
    }

    // 2️⃣ Run Rhubarb
    await new Promise((resolve, reject) => {
      const cmd = `"${rhubarbPath}" -f json -o "${jsonFile}" "${wavFile}" -r phonetic`;
      console.log(`🎤 Running Rhubarb: ${cmd}`);

      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          console.error(`❌ Rhubarb failed:`, stderr || error.message);
          return reject(error);
        }
        console.log(`✅ Lip-sync JSON generated for message ${message}`);
        resolve();
      });
    });

    console.log(`✨ Completed message ${message} in ${Date.now() - start}ms`);
  } catch (error) {
    console.error(`❌ Error while getting phonemes for message ${message}:`, error);
  }
};

export { getPhonemes };

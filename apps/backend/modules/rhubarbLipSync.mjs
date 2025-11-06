import { exec } from "child_process";
import path from "path";

const getPhonemes = async ({ audioFile }) => {
  try {
    const start = Date.now();
    console.log(`🎙️ Starting Rhubarb Lip Sync for ${audioFile}`);

    const backendDir = path.resolve("./");
    const rhubarbPath = path.join(
      backendDir,
      "bin",
      process.platform === "win32" ? "rhubarb.exe" : "rhubarb"
    );

    const jsonFile = audioFile.replace(".wav", ".json");

    // Run Rhubarb
    await new Promise((resolve, reject) => {
      const cmd = `"${rhubarbPath}" -f json -o "${jsonFile}" "${audioFile}" -r phonetic`;
      console.log(`🎤 Running Rhubarb: ${cmd}`);

      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          console.error(`❌ Rhubarb failed:`, stderr || error.message);
          return reject(error);
        }
        console.log(`✅ Lip-sync JSON generated for ${audioFile}`);
        resolve();
      });
    });

    console.log(`✨ Completed Rhubarb for ${audioFile} in ${Date.now() - start}ms`);
  } catch (error) {
    console.error(`❌ Error while getting phonemes for ${audioFile}:`, error);
    throw error;
  }
};

export { getPhonemes };

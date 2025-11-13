import { LLM } from "langchain/llms/base";
import fetch from "node-fetch";

class OllamaLLM extends LLM {
  _llmType() {
    return "ollama";
  }

  async _call(prompt, options) {
    try {
      const response = await fetch("http://127.0.0.1:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `Ollama API responded with status ${response.status}: ${errorBody}`
        );
      }

      const data = await response.json();
      return data.reply;
    } catch (error) {
      console.error("Failed to connect to Ollama server:", error);
      throw error;
    }
  }
}

export { OllamaLLM };

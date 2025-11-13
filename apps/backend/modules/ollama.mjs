import { OllamaLLM } from "./OllamaLLM.mjs";
import { z } from "zod";
import {
  StructuredOutputParser,
  OutputFixingParser,
} from "langchain/output_parsers";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";

const zodSchema = z.object({
  messages: z.array(
    z.object({
      text: z.string().describe("Text to be spoken by the AI"),
      facialExpression: z
        .string()
        .describe(
          "Facial expression. Select from: smile, sad, angry, surprised, funnyFace, and default"
        ),
      animation: z
        .string()
        .describe(
          "Animation. Select from: Idle, TalkingOne, TalkingThree, SadIdle, Defeated, Angry, Surprised, DismissingGesture, and ThoughtfulHeadShake."
        ),
    })
  ),
});

const resumeSchema = z.object({
  name: z.string().describe("Candidate's full name"),
  education: z.string().describe("Summary of the candidate's education"),
  skills: z.array(z.string()).describe("List of key skills"),
  experience_summary: z
    .string()
    .describe("A brief summary of the candidate's work experience"),
  projects: z.array(z.string()).describe("List of key projects"),
  career_objective: z
    .string()
    .describe("The candidate's stated career objective"),
});

const parser = StructuredOutputParser.fromZodSchema(zodSchema);
const resumeParser = StructuredOutputParser.fromZodSchema(resumeSchema);

const model = new OllamaLLM();

const template = `You are Mottaiyan, a 22-year-old AI/ML hiring HR from AVASOFT with 2 years of experience.
You are conducting an interview for an AI/ML intern position.

Context:
- userName: {userName}
- userResumeSummary: {userResumeSummary}
- sessionContext: {chat_history}
- firstGreeted: {firstGreeted}

Rules:
1. If firstGreeted === false:
   - Greet user once by name and introduce yourself.
   - Briefly describe Techwin company and the AI/ML intern role.
   - Ask 2–3 relevant opening questions based on the resume summary (skills, education, projects).
2. If firstGreeted === true:
   - Continue the interview without re-introducing yourself.
   - Reference prior chat history naturally.
3. Never hallucinate or invent details.
4. Always respond in structured JSON.
   \n{format_instructions}

Human: {question}
AI:`;

const prompt = ChatPromptTemplate.fromMessages([
  ["ai", template],
  new MessagesPlaceholder("chat_history"),
  ["human", "{question}"],
]);

const ollamaChain = prompt.pipe(model).pipe(parser);

async function summarizeResume(rawText) {
  const format_instructions = resumeParser.getFormatInstructions();
  const prompt = `Summarize the following resume text into a structured JSON object.
  \n${format_instructions}
  \nResume Text:
  ${rawText}`;

  const response = await model.call(prompt);

  try {
    return JSON.parse(response);
  } catch (e) {
    const fixParser = OutputFixingParser.fromLLM(model, resumeParser);
    const fixedResponse = await fixParser.parse(response);
    return fixedResponse;
  }
}

export { ollamaChain, parser, summarizeResume };

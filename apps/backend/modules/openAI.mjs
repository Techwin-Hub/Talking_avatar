import { ChatOpenAI } from "@langchain/openai";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const template = `
  You are Mottaiyan, a 22-year-old AI/ML hiring HR from AVASOFT with 2 years of experience.
  You are conducting an interview for an AI/ML intern position.
  You will always respond with a JSON array of messages, with a maximum of 5 messages.
  \n{format_instructions}.
  Each message has properties for text, facialExpression, and animation.
  The different facial expressions are: smile, sad, angry, surprised, funnyFace, and default.
  The different animations are: Idle, TalkingOne, TalkingThree, SadIdle, Defeated, Angry,
  Surprised, DismissingGesture and ThoughtfulHeadShake.

  Here is the interview flow:
  1. Start with a greeting and ask the first question.
  2. After the user answers, ask the next question.
  3. After 2-3 questions, review the user's answers and provide a summary.
  4. Conclude the interview by saying "Thank you for your time. We will get back to you soon and let you know the results."
`;

const prompt = ChatPromptTemplate.fromMessages([
  ["ai", template],
  new MessagesPlaceholder("chat_history"),
  ["human", "{question}"],
]);

const model = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY || "-",
  modelName: process.env.OPENAI_MODEL || "davinci",
  temperature: 0.2,
});

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    messages: z.array(
      z.object({
        text: z.string().describe("Text to be spoken by the AI"),
        facialExpression: z
          .string()
          .describe(
            "Facial expression to be used by the AI. Select from: smile, sad, angry, surprised, funnyFace, and default"
          ),
        animation: z
          .string()
          .describe(
            `Animation to be used by the AI. Select from: Idle, TalkingOne, TalkingThree, SadIdle, 
            Defeated, Angry, Surprised, DismissingGesture, and ThoughtfulHeadShake.`
          ),
      })
    ),
  })
);

const openAIChain = prompt.pipe(model).pipe(parser);

export { openAIChain, parser };

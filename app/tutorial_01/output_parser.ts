import { config } from "dotenv";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

config();

const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-2.0-flash",
  maxOutputTokens: 2048,
});

const outputParser  = async () => {
  const res = await model.invoke([
    [
      "human",
      "What would be a good company name for a company that makes colorful socks?",
    ],
  ]);
  return res;
}

export default outputParser;



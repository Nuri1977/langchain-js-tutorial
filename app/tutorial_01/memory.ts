import pg from "pg";
import { PostgresChatMessageHistory } from "@langchain/community/stores/message/postgres";
import { TaskType } from "@google/generative-ai";
import {
  ChatGoogleGenerativeAI,
  GoogleGenerativeAIEmbeddings,
} from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import * as readline from 'readline';

const poolConfig = {
  host: "127.0.0.1",
  port: 5432,
  user: "nuri",
  password: "Password123",
  database: "langchain",
};

const pool = new pg.Pool(poolConfig);

const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-2.0-flash",
  maxOutputTokens: 2048,
});

const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004", // 768 dimensions
  taskType: TaskType.RETRIEVAL_DOCUMENT,
  title: "Document title",
});

const chatHistoryPG = new PostgresChatMessageHistory({
  sessionId: "memory_tutorial",
  pool: pool,
});
const memory = new BufferMemory({
  memoryKey: "history_test",
  chatHistory: chatHistoryPG,
});

const askQuestion = async (rl: readline.Interface, chain: ConversationChain) => {
  console.log("You can ask questions about LangChain. Type 'exit' to quit.");
  
  while (true) {
    const input = await new Promise<string>((resolve) => {
      rl.question('You: ', (answer) => {
        resolve(answer);
      });
    });
    
    console.log(`You asked: ${input}`);
    
    if (input.toLowerCase() === 'exit') {
      console.log('Exiting...');
      rl.close();
      break;
    }

    if(!input.trim()) {
      console.log("Response: Please enter a valid question.");
      continue;
    }
    
    console.log("Processing your question...");
    try {
      const response = await chain.invoke({
        input: input,
      });
      console.log("Response:", response.response);
      console.log(); // Add empty line for better readability
    } catch (error) {
      console.error("Error:", error);
      console.log(); // Add empty line for better readability
    }
  }
};

const memoryRetrevialChain = async (rl: readline.Interface) => {
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You are a helpful assistant that answers questions about LangChain. Use the conversation history to provide context-aware responses.",
    ],
    ["human", "Previous conversation:\n{history_test}\n\nHuman: {input}"],
  ]);

  const chain = new ConversationChain({
    llm: model,
    prompt: prompt,
    memory: memory,
  });

  await askQuestion(rl, chain);
  console.log("Memory contents:", await memory.loadMemoryVariables([]));
  await pool.end();
};

export default memoryRetrevialChain;
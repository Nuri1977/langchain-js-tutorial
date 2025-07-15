import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { createReactAgent, AgentExecutor } from "langchain/agents";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { ChatPromptTemplate, PromptTemplate } from "@langchain/core/prompts";
import * as readline from 'readline';
import {HumanMessage, AIMessage} from '@langchain/core/messages';
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { TaskType } from "@google/generative-ai";
import { createRetrieverTool } from "langchain/tools/retriever";

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

// Create vector store from web page
const createVectorStore = async () => {
  // Srcrape web page and load documents
  const loader = new CheerioWebBaseLoader(
    "https://v03.api.js.langchain.com/modules/langchain.html",
    {
      selector: "p",
    }
  );
  const docs = await loader.load();
  // Split documents into smaller chunks
  const spliter = new RecursiveCharacterTextSplitter({
    chunkSize: 200,
    chunkOverlap: 20, 
  })
  const splitDocuments = await spliter.splitDocuments(docs);
  // Create a vector store from the split documents
  const vectorStore = await MemoryVectorStore.fromDocuments(
    splitDocuments,
    embeddings
  );

  return vectorStore;
}

const agentsRetrievalChain = async (rl: readline.Interface) => {

    const vectorStore = await createVectorStore();
    const retriever = vectorStore.asRetriever({
      k: 2,
    });
    const retrieverTool = createRetrieverTool(retriever, {
      name: "Web Retriever",
      description: "Retrieves relevant documents for langchain modules from a web page",
    });
    const serchTool = new TavilySearchResults({
        maxResults: 3,
        apiKey: process.env.TAVILY_API_KEY,
    });
    // Create a simple tool for demonstration
    const tools_01 = [serchTool, retrieverTool];

    // Create a proper React agent prompt with required variables
    const prompt = PromptTemplate.fromTemplate(`Answer the following questions as best you can. You have access to the following tools:

{tools}

Use the following format:

Question: the input question you must answer
Thought: you should always think about what to do
Action: the action to take, should be one of [{tool_names}]
Action Input: the input to the action
Observation: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: the final answer to the original input question

IMPORTANT: 
- Do NOT make up or hallucinate observations. Only provide the Thought and Action/Action Input. The system will provide the actual Observation.
- Use "tavily_search_results_json" for web search and current events
- Use "Web Retriever" for LangChain documentation questions
- Always choose the most appropriate tool for the question

Begin!

Question: {input}
Chat History: {chat_history}
Thought: {agent_scratchpad}`);

    const agent = await createReactAgent({
        llm: model,
        tools: tools_01 as any[], // Type assertion to avoid type errors
        prompt,
    });

    const executor = new AgentExecutor({
        agent,
        tools : tools_01,
        verbose: true,
        handleParsingErrors: true,
        maxIterations: 3,
    });

    const chat_history = [];

    console.log("🚀 Starting agents retrieval chain with LangSmith tracing...\n");
    console.log("💬 Interactive Agent Chat");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🤖 Hello! I'm your AI assistant with access to web search.");
    console.log("🔍 I can help you with questions, research, current events, and more!");
    console.log("💡 Just type your question and I'll do my best to help you.");
    console.log("🚪 Type 'exit' anytime to end our conversation.");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    // Main chat loop
    let conversationCount = 0;
    while (true) {
        let userInput = '';
        try {
            // Add conversation context
            conversationCount++;
            const prompt = conversationCount === 1 ? 
                "System: 🧑 What would you like to know? " : 
                "System: 🧑 What else can I help you with? ";
            
            userInput = await new Promise<string>((resolve) => {
                rl.question(prompt, (answer) => {
                    resolve(answer);
                });
            });
            chat_history.push(new HumanMessage(userInput));
            
            // Check if user wants to exit
            if (userInput.toLowerCase() === 'exit' || userInput.toLowerCase() === 'quit' || userInput.toLowerCase() === 'bye') {
                console.log("\n👋 Thank you for chatting with me! Have a great day!");
                break;
            }

            if (userInput.trim() === '') {
                console.log("🤔 I didn't catch that. Please ask me something, or type 'exit' to end our chat.\n");
                conversationCount--; // Don't count empty inputs
                continue;
            }

            console.log("\n🤖 Let me think about that...\n");

            const result = await executor.invoke({
                input: userInput,
                chat_history: chat_history.map(msg => 
                    `${msg.constructor.name === 'HumanMessage' ? 'Human' : 'AI'}: ${msg.content}`
                ).join('\n')
            });
            
            console.log("🤖 System:", result.output);
            chat_history.push(new AIMessage(result.output));
            console.log("\n" + "─".repeat(60) + "\n");
            
        } catch (error) {
            console.error("❌ I encountered an error:", error);
            
            // Fallback: simple direct response without tools
            console.log("🔄 Let me try a different approach...\n");
            try {
                const fallbackResult = await model.invoke(userInput);
                console.log("🤖 Assistant:", fallbackResult.content);
                console.log("\n" + "─".repeat(60) + "\n");
            } catch (fallbackError) {
                console.error("❌ Fallback also failed:", fallbackError);
                console.log("🤖 Assistant: I'm sorry, I'm having technical difficulties right now. Could you please try asking your question again?");
                console.log("\n" + "─".repeat(60) + "\n");
            }
        }
    }
    
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🔍 LangSmith Tracing Information:");
    console.log("- Project: default (free tier)");
    console.log("- Tracing enabled:", process.env.LANGCHAIN_TRACING_V2 === "true");
    console.log("- Dashboard: https://smith.langchain.com/");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    return { output: "Chat session ended successfully" };
}

export default agentsRetrievalChain;
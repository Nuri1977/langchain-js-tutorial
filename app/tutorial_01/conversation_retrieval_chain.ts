import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { AIMessage, HumanMessage } from "@langchain/core/messages";   
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";

// Configure LangSmith tracing
process.env.LANGCHAIN_TRACING_V2 = "true";
// Using default project on free tier

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
    "https://www.weekday.works/people/vishwas-gopinath-vishwas-gopinath-0020a09b",
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

// Function to create the retrieval chain
const createChain = async () => {
  // Create a prompt template for the retrieval chain
  const template = ChatPromptTemplate.fromMessages(
    [
      ["system", "You are a helpful assistant. Answer the users question. Context: {context}"],
      new MessagesPlaceholder("chat_history"),
      ["user", "{input}"]
    ]
  )
  // Create a chain to combine documents
  const chain = await createStuffDocumentsChain({
    llm: model,
    prompt: template,
  });

  return chain;
}
// Dummy chat history about hobbies and interests
const dummyHistory = [
  new HumanMessage("What are Vishwas Gopinath's hobbies?"),
  new AIMessage("I enjoy coding, teaching through YouTube, and building developer tools."),
  new HumanMessage("What programming languages does he specialize in?"),
  new AIMessage("He specializes in JavaScript, React, React Native, TypeScript, and has experience with Vue, Angular, Node.js, and MongoDB."),
  new HumanMessage("What is his educational background?"),
  new AIMessage("He has a Bachelor of Engineering (B.E.) in Computer Science from Visvesvaraya Technological University."),
  new HumanMessage("What companies has he worked for?"),
  new AIMessage("He has worked for Builder.io, Codevolution, Kerv, BookMyShow, and Microchip Technology Inc."),
];


// main function to create the retrieval chain
const conversationRetrievalChain = async () => {
  console.log("🔗 Starting Conversation Retrieval Chain with LangSmith tracing...\n");
  
  try {
    // Create the chain
    console.log("📋 Creating document chain...");
    const chain = await createChain();
    
    // Create a vector store from the web page
    console.log("🗂️ Creating vector store from web data...");
    const vectorStore = await createVectorStore();
    
    const retriever = vectorStore.asRetriever({
      k: 5,
    });
    
    console.log("🧠 Setting up history-aware retriever...");
    const historyAwareRetriever = await createHistoryAwareRetriever({
      llm: model,
      retriever,
      rephrasePrompt: ChatPromptTemplate.fromMessages(
        [
          new MessagesPlaceholder("chat_history"),
          ["user", "{input}"],
          ["user", "Given the chat history and input, generate a search query to look up information relevant to the conversation."],
        ]
      ),
    });

    // Create the retrieval chain
    console.log("⛓️ Creating retrieval chain...");
    const conversation_chain = await createRetrievalChain({
      combineDocsChain: chain,
      retriever: historyAwareRetriever,
    });
    
    console.log("🤖 Invoking chain with question...");
    console.log("Question: 'What is Vishwas Gopinath's current role and what are his main technical skills?'\n");
    
    // Invoke the chain with a question - this will be traced in LangSmith
    const res = await conversation_chain.invoke({
      input: "What is Vishwas Gopinath's current role and what are his main technical skills?",
      chat_history: dummyHistory,
    });
    
    console.log("✅ Response received:");
    console.log("Answer:", res.answer);
    console.log("\n📊 Context documents used:");
    res.context.forEach((doc, index) => {
      console.log(`Document ${index + 1}:`, doc.pageContent.substring(0, 100) + "...");
    });
    
    console.log("\n🔍 LangSmith Tracing Information:");
    console.log("- Project: default (free tier)");
    console.log("- Tracing enabled:", process.env.LANGCHAIN_TRACING_V2 === "true");
    console.log("- Check your LangSmith dashboard at: https://smith.langchain.com/");
    
  } catch (error) {
    console.error("❌ Error in conversation retrieval chain:", error);
  }
}

export default conversationRetrievalChain;
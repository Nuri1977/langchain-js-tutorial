import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
// import { Document } from "@langchain/core/documents";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createRetrievalChain } from "langchain/chains/retrieval";



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



const retrievalChain  = async () => {
  const template = ChatPromptTemplate.fromTemplate(
    `Answer the users question.
    Context: {context}
    Question:  {input}`
  )

    const chain = await createStuffDocumentsChain({
    llm: model,
    prompt: template,
  });

  // // Documents can be used to provide context for the model
  // const documentA = new Document({
  //   pageContent: "Nuri Lacka has worked with AdaptiveScale, Kennedy Technology, Lacka Furniture, Ministry of Education and Science North Macedonia, USAID Project in Macedonia",
  //   metadata: {
  //     source: "https://www.weekday.works/people/nuri-lacka-nuri-lacka"
  //   },
  // });

  // const documentB = new Document({
  //   pageContent: "Nuri Lacka like basketball, football, and tennis.",
  // });
  


  // const chain = template.pipe(model);


  ///////////////////////////////////////////////
  // Load documents from a web page
  ///////////////////////////////////////////////

  const loader = new CheerioWebBaseLoader(
    "https://www.weekday.works/people/vishwas-gopinath-vishwas-gopinath-0020a09b",
    {
      selector: "p",
    }
  );

  const docs = await loader.load();
  console.log("Loaded documents lenght:", docs[0].pageContent.length);

  ///////////////////////////////////////////////
  // Split documents into smaller chunks and create a vector store
  ///////////////////////////////////////////////

  const spliter = new RecursiveCharacterTextSplitter({
    chunkSize: 200,
    chunkOverlap: 20, 
  })

  const splitDocuments = await spliter.splitDocuments(docs);
  console.log("Split documents lenght:", splitDocuments[0].pageContent);
  console.log("Split documents:", splitDocuments[1].pageContent);

  const vectorStore = await MemoryVectorStore.fromDocuments(
    splitDocuments,
    embeddings
  );

  ////////////////////////////////////////////
  // Retrieve documents from the vector store
  ///////////////////////////////////////////////
  const retriever = vectorStore.asRetriever({
    k: 5,
  });

  const retrieval_chain = await createRetrievalChain({
    combineDocsChain: chain,
    retriever,
  });


  const res = await retrieval_chain.invoke({
    input: "Who is Vishwas Gopinath?",
  });
  console.log("Response:", res);
}

export default retrievalChain;
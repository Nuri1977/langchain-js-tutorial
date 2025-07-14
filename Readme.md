# LangChain JS Tutorial

A comprehensive tutorial project for learning LangChain with JavaScript/TypeScript, featuring interactive examples and hands-on implementations.

## 🚀 Overview

This project provides a structured approach to learning LangChain concepts through practical examples. It includes multiple tutorials covering different aspects of LangChain, from basic output parsing to advanced retrieval chains using real-world data about Vishwas Gopinath, a Developer Relations Manager at Builder.io.

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A valid Google AI API key (for Gemini integration)
- Optional: LangSmith API key (for tracing and debugging)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd langchain-js-tutorial
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.sample .env
   ```
   Then edit `.env` and add your API keys:
   ```
   GOOGLE_API_KEY=your_actual_google_api_key_here
   LANGSMITH_API_KEY=your_langsmith_api_key_here  # Optional
   LANGCHAIN_TRACING_V2=true                      # Optional
   ```

## 🔑 Getting Your API Keys

### Google AI API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key and paste it in your `.env` file

### LangSmith API Key (Optional)
1. Go to [LangSmith](https://smith.langchain.com/)
2. Sign up or sign in
3. Go to Settings → API Keys
4. Create a new API key
5. Add it to your `.env` file for tracing capabilities

## 🎯 Usage

### Quick Start (Recommended)

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up your API keys** in `.env` file (copy from `.env.sample`)

3. **Run the application**
   ```bash
   npm start
   ```

4. **Select a tutorial** from the interactive menu:
   ```
   === LangChain JS Tutorial Menu ===
   Please select a tutorial to run:
   1. Output Parser
   2. Retrieval Chain
   3. Conversation Retrieval Chain
   0. Exit
   ==================================
   Enter your choice (0-3):
   ```

That's it! The application will automatically compile TypeScript and run your selected tutorial.

### Advanced Usage (Optional)

If you want to run tutorials individually or explore the code:

### Advanced Usage (Optional)

If you want to run tutorials individually or explore the code:

#### Option 1: Direct TypeScript Execution
```bash
npx tsx app/tutorial_01/output_parser.ts
npx tsx app/tutorial_01/retrieval_chain.ts
npx tsx app/tutorial_01/conversation_retrieval_chain.ts
```

#### Option 2: Compile First, Then Run
```bash
npx tsc
node dist/app/tutorial_01/output_parser.js
node dist/app/tutorial_01/retrieval_chain.js
node dist/app/tutorial_01/conversation_retrieval_chain.js
```

> **Note:** The recommended approach is to use `npm start` and select tutorials from the menu.

## 📁 Project Structure

```
langchain-js-tutorial/
├── app/
│   ├── index.ts                           # Main application entry point
│   └── tutorial_01/
│       ├── output_parser.ts               # Output parsing examples
│       ├── retrieval_chain.ts             # Retrieval chain examples
│       └── conversation_retrieval_chain.ts # Conversation with retrieval
├── dist/                                  # Compiled JavaScript files
├── .env                                   # Environment variables
├── .env.sample                            # Environment variables template
├── package.json                           # Project dependencies
├── tsconfig.json                          # TypeScript configuration
└── README.md                              # This file
```

## 📚 Tutorials

### 1. Output Parser
Learn how to parse and structure outputs from language models using LangChain's output parsing capabilities.

**File:** `app/tutorial_01/output_parser.ts`

**Topics covered:**
- Basic output parsing
- Structured output formats
- Error handling and validation
- Using Zod for schema validation

**Run command:**
```bash
npx tsc && node dist/app/tutorial_01/output_parser.js
```

### 2. Retrieval Chain
Explore retrieval-augmented generation (RAG) patterns and how to build effective retrieval chains using real professional data.

**File:** `app/tutorial_01/retrieval_chain.ts`

**Topics covered:**
- Document retrieval from web sources
- Web scraping with CheerioWebBaseLoader
- Document splitting and chunking
- Vector databases and similarity search
- Chain composition and context integration
- Real-world data processing (Vishwas Gopinath's professional profile)

**Run command:**
```bash
npx tsc && node dist/app/tutorial_01/retrieval_chain.js
```

### 3. Conversation Retrieval Chain
Build advanced conversational AI with memory and context-aware retrieval using professional profile data.

**File:** `app/tutorial_01/conversation_retrieval_chain.ts`

**Topics covered:**
- Conversation history management
- History-aware retrieval
- Vector store creation and management
- Memory integration with chains
- LangSmith tracing and debugging
- Context-aware responses about professional backgrounds

**Run command:**
```bash
npx tsc && node dist/app/tutorial_01/conversation_retrieval_chain.js
```

**Features:**
- ✅ LangSmith tracing integration
- 🧠 Memory-aware conversations
- 🔍 Context-aware document retrieval
- 📊 Detailed logging and debugging
- 👨‍💻 Real professional data (Vishwas Gopinath's profile)

## 🔧 Development

### Building the Project

```bash
# Compile TypeScript
npx tsc

# Watch mode for development
npx tsc --watch
```

### Project Scripts

- `npm start` - Compile and run the main application
- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Run in development mode with watch

## 🧪 Testing

```bash
npm test
```

## 📦 Dependencies

### Core Dependencies
- `@langchain/core` - Core LangChain functionality
- `@langchain/google-genai` - Google Generative AI integration
- `@langchain/community` - Community loaders and tools
- `@langchain/textsplitters` - Text splitting utilities
- `langchain` - Main LangChain library
- `dotenv` - Environment variable management
- `zod` - Schema validation
- `langsmith` - LangSmith tracing and debugging

### Development Dependencies
- `typescript` - TypeScript compiler
- `@types/node` - Node.js type definitions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

1. **API Key Error**
   ```
   GoogleGenerativeAIFetchError: API key not valid
   ```
   **Solution:** Ensure your Google API key is valid and correctly set in the `.env` file.

2. **TypeScript Compilation Error**
   ```
   TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts"
   ```
   **Solution:** Run `npx tsc` to compile TypeScript files before execution.

3. **Module Not Found**
   ```
   Cannot find module './tutorial_01/output_parser.js'
   ```
   **Solution:** Ensure TypeScript compilation is complete and files exist in the `dist` directory.

### Getting Help

- Check the [LangChain Documentation](https://js.langchain.com/docs/)
- Review the [Google AI Studio Documentation](https://ai.google.dev/docs)
- Open an issue in this repository for project-specific problems

## 🙏 Acknowledgments

- [LangChain](https://langchain.com/) for the amazing framework
- [Google AI](https://ai.google.dev/) for the Gemini API
- The open-source community for continuous inspiration

---

**Happy Learning!** 🎉
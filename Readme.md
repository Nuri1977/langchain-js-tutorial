# LangChain JS Tutorial

A comprehensive tutorial project for learning LangChain with JavaScript/TypeScript, featuring interactive examples and hands-on implementations.

## 🚀 Overview

This project provides a structured approach to learning LangChain concepts through practical examples. It includes multiple tutorials covering different aspects of LangChain, from basic output parsing to advanced retrieval chains.

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A valid Google AI API key (for Gemini integration)

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
   cp .env.example .env
   ```
   Then edit `.env` and add your Google API key:
   ```
   GOOGLE_API_KEY=your_actual_api_key_here
   ```

## 🔑 Getting Your Google API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key and paste it in your `.env` file

## 🎯 Usage

### Interactive Mode

Run the application with an interactive menu:

```bash
npm start
```

You'll see a menu like this:
```
=== LangChain JS Tutorial Menu ===
Please select a tutorial to run:
1. Output Parser
2. Retrieval Chain
0. Exit
==================================
Enter your choice (0-2):
```

### Direct Execution

You can also run individual tutorials directly:

```bash
# Compile TypeScript first
npx tsc

# Run specific tutorial
node dist/app/tutorial_01/output_parser.js
node dist/app/tutorial_01/retrevial_chain.js
```

## 📁 Project Structure

```
langchain-js-tutorial/
├── app/
│   ├── index.ts                 # Main application entry point
│   └── tutorial_01/
│       ├── output_parser.ts     # Output parsing examples
│       └── retrevial_chain.ts   # Retrieval chain examples
├── dist/                        # Compiled JavaScript files
├── .env                         # Environment variables
├── package.json                 # Project dependencies
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file
```

## 📚 Tutorials

### 1. Output Parser
Learn how to parse and structure outputs from language models using LangChain's output parsing capabilities.

**Topics covered:**
- Basic output parsing
- Structured output formats
- Error handling and validation

### 2. Retrieval Chain
Explore retrieval-augmented generation (RAG) patterns and how to build effective retrieval chains.

**Topics covered:**
- Document retrieval
- Vector databases
- Chain composition
- Context integration

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
- `langchain` - Main LangChain library
- `dotenv` - Environment variable management
- `zod` - Schema validation

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
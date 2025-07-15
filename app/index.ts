// Renamed the file to TypeScript
import { config } from 'dotenv';
import * as readline from 'readline';
import outputParser from './tutorial_01/output_parser.js';
import retrievalChain from './tutorial_01/retrieval_chain.js';
import conversationReatrievalChain from './tutorial_01/conversation_retrieval_chain.js';
import agentsRetrievalChain from './tutorial_01/agent.js';
import memoryRetrievalChain from './tutorial_01/memory.js';

config();

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to prompt user for tutorial selection
function promptUser(): Promise<number> {
  return new Promise((resolve) => {
    console.log('\n=== LangChain JS Tutorial Menu ===');
    console.log('Please select a tutorial to run:');
    console.log('0. Exit');
    console.log('1. Output Parser');
    console.log('2. Retrieval Chain');
    console.log('3. Conversation Retrieval Chain');
    console.log('4. Agents Retrieval Chain');
    console.log('5. Memory Retrieval Chain');
    console.log('==================================');
    
    rl.question('Enter your choice (0-5): ', (answer) => {
      const choice = parseInt(answer.trim());
      if (isNaN(choice) || choice < 0 || choice > 5) {
        console.log('Invalid choice. Please enter 0, 1, 2, 3, 4 or 5.');
        resolve(promptUser());
      } else {
        resolve(choice);
      }
    });
  });
}

// Main execution
async function main() {
  try {
    const tutorial = await promptUser();
    
    console.log(`\nRunning tutorial ${tutorial}...\n`);
    
    switch (tutorial) {
      case 1:
        await outputParser();
        break;
      case 2:
        await retrievalChain();
        break;
      case 3:
        await conversationReatrievalChain();
        break;
      case 4:
        await agentsRetrievalChain(rl);
        break;
      case 5:
        await memoryRetrievalChain(rl);
        break;
      case 0:
        console.log('Goodbye!');
        break;
      default:
        console.log('Invalid tutorial number');
    }
  } catch (error) {
    console.error('Error running tutorial:', error);
  } finally {
    rl.close();
  }
}

// Run the main function
main();
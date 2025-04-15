// Renamed the file to TypeScript
import { config } from 'dotenv';
import outputParser from './tutorial_01/output_parser.js';

config();

const test: string = process.env.TEST || 'not working';

const tutorial: number = 1;

switch (tutorial) {
  case 1:
    await outputParser();
    break;
  case 2:
    console.log('tutorial2 runned');
    break;
  default:
    console.log('Invalid tutorial number');
}
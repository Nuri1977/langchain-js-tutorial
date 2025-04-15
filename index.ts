// Renamed the file to TypeScript
import { config } from 'dotenv';
import  outputParser from './tutorial_01/output_parser.js';

config();

const test: string = process.env.TEST || 'not working';

const res = await outputParser()
console.log(res);
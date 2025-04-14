// Renamed the file to TypeScript
import { config } from 'dotenv';
config();
const test = process.env.TEST || 'not working';
console.log(test);

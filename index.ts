// Renamed the file to TypeScript
import { config } from 'dotenv';

config();

const test: string = process.env.TEST || 'not working';

console.log(test);
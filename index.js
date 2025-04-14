"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Renamed the file to TypeScript
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const test = process.env.TEST || 'not working';
console.log(test);

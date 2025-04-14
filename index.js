
import { config } from 'dotenv'

config()

const test = process.env.TEST || 'not working'

console.log(test)
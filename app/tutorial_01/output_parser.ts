import { config } from "dotenv";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  CommaSeparatedListOutputParser,
  StringOutputParser,
} from "@langchain/core/output_parsers";
import { StructuredOutputParser} from "@langchain/core/output_parsers";
import { z } from "zod";

config();

const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-2.0-flash",
  maxOutputTokens: 2048,
});

const outputParser  = async () => {

  const prompt1 = ChatPromptTemplate.fromMessages([
    ["system", "Genarete 5 jokes, separated by commas, based on a word provided by the user"],
    ["human", "{input}"],
  ]);

  const prompt2 = ChatPromptTemplate.fromTemplate(`
    Extract information from the following text.
    Formating Instructuions: {format_instractions}
    Text: {input}`)

  const prompt3 = ChatPromptTemplate.fromTemplate(`
    Extract information from the following text.
    Formating Instructuions: {format_instractions}
    Text: {input}`)

  const strinParser = new StringOutputParser();
  const commaParser = new CommaSeparatedListOutputParser();
  const structuredParser1 = StructuredOutputParser.fromZodSchema(
    z.object({
      recipe: z.string().describe("Recipe"),
      ingredients: z.array(z.string()).describe("Ingredients"),
    }),
  );
  const structuredParser2 = StructuredOutputParser.fromNamesAndDescriptions(
    {
      name: 'Extract persons name',
      age: 'Extract persons age as number',
    })

  // create chain
  const chain1 = prompt1.pipe(model).pipe(strinParser);
  const chain2 = prompt1.pipe(model).pipe(strinParser).pipe(commaParser);
  const chain3 = prompt2.pipe(model).pipe(strinParser).pipe(structuredParser1);
  const chain4 = prompt3.pipe(model).pipe(strinParser).pipe(structuredParser2);

  // run chain
  const res1 = await chain1.invoke({
    input: "dog",
  });

  const res2 = await chain2.invoke({
    input: "dog",
  });

  const res3 = await chain3.invoke({
    input: "A bolognaise is a meat-based sauce originating from the Italian city of Bologna. It is typically made with ground beef, pork, or veal, and is often served with pasta.",
    format_instractions: structuredParser1.getFormatInstructions(),
  });

  const res4 = await chain4.invoke({
    input: "Nuri Lacka is 47 old",
    format_instractions: structuredParser2.getFormatInstructions(),
  });

  console.log("StringOutputParser: ", res1);
  console.log("CommaSeparatedListOutputParser: ", res2);
  console.log("StructuredOutputParser: ", res3);
  console.log("StructuredOutputParser: ", res4);
}

export default outputParser;



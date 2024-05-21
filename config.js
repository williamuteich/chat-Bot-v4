import { config } from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createProdia } from 'prodia';

config();

export const genAI = new GoogleGenerativeAI(process.env.TOKEN_GEMINI);
export const prodiaAI = createProdia({apiKey: process.env.TOKEN_PRODIA});
export const riotGame = new RiotAPI(process.env.TOKEN_RIOT)

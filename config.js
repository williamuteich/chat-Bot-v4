import { config } from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createProdia } from 'prodia';
import { initializeApp } from "firebase/app";

config();

export const genAI = new GoogleGenerativeAI(process.env.TOKEN_GEMINI);
export const prodiaAI = createProdia({apiKey: process.env.TOKEN_PRODIA});

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
  };
  
  export const app = initializeApp(firebaseConfig);
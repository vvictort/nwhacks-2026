import express from 'express';
import { GoogleGenAI } from '@google/genai';

const router = express.Router();
const MODEL = "gemini-1.5-flash";
const ai = new GoogleGenAI({});

router.post('/gemini', async (req, res) => {
  try {
    const response = await ai.models.generateContent({
    model: MODEL,
    contents: "Explain how AI works in a few words",
  });
  console.log(response.text);
    res.json({ text: response.text });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

// import { GoogleGenAI } from "@google/genai";

// // The client gets the API key from the environment variable `GEMINI_API_KEY`.
// const ai = new GoogleGenAI({});

// async function main() {
//   const response = await ai.models.generateContent({
//     model: "gemini-3-flash-preview",
//     contents: "Explain how AI works in a few words",
//   });
//   console.log(response.text);
// }

// main();
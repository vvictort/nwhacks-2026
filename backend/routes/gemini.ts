import express from 'express';
import { GoogleGenAI } from '@google/genai';    
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const router = express.Router();
const MODEL = "gemini-3-flash-preview";
const KEY = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey: KEY });

// fetch generated responses from Gemini API
router.get('/', async (req, res) => {
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

// debugging: lists the available models from Gemini API
router.get('/models', async (req, res) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${KEY}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});


// router.post('/', async (req, res) => {
//   try {
//     const response = await ai.models.generateContent({
//     model: MODEL,
//     contents: "Explain how AI works in a few words",
//   });
//   console.log(response.text);
//     res.json({ text: response.text });
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// });

export default router;

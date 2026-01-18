import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const router = express.Router();
const MODEL = "gemini-3-flash-preview";
const KEY = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey: KEY });

const PROMPT =
`You are a toy classifier. Analyze the provided image and text description of a children's toy. Output ONLY valid JSON with these exact keys, selecting ONE option per category from the allowed values. Do not add extra fields, explanations, or markdown.

Rules:
- Toy category: Choose exactly one from ["Figures", "Building", "Games", "Puzzles", "Crafts", "Active", "Vehicles", "STEM", "Pretend", "Plush"] based on primary function/shape (e.g., dolls/characters=Figures, blocks=Lego-like=Building).
- Condition: Choose exactly one from ["New in Box", "Like new", "Lightly used", "Well used", "Heavily used"] by inspecting image for box/packaging, scratches, dirt, wear (e.g., pristine sealed=New in Box, minor marks=Lightly used).
- Age range: Choose exactly one from ["Toddler", "Preschooler", "Child"] from size, safety features, complexity (e.g., large/simple=toddler, detailed=puzzle=child).

Step 1: Describe key visual/text attributes silently.
Step 2: Select categories with reasoning (internal only).
Step 3: Output JSON only.

Example input image: [toy photo], text: "Lego set with instructions".
Example output:
{
  "toy_category": "Building",
  "condition": "Like new",
  "age_range": "child"
}
`;

// classify toy image and description into appropriate categories
router.post('/classify', express.json({ limit: '20mb' }), async (req, res) => {
  try {
    const { image_base64, text } = req.body;

    if (!image_base64 || !text) {
      return res.status(400).json({ error: 'Need image_base64 and text' });
    }

   const response = await ai.models.generateContent({
      model: MODEL,
      contents: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: image_base64.replace(/^data:image\/[a-z]+;base64,/, '')
          }
        },
        {
          text: `${PROMPT}\n\nText description: "${text}"`
        }
      ]
    });
    const text_content = response.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text_content) {
      return res.status(500).json({ error: 'No text content in response' });
    }
    const json = JSON.parse(text_content);
    res.json(json);

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

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


// EXTRA ENDPOINT UNUSED
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

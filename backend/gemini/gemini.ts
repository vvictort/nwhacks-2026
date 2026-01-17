// const express = require('express');
// const { GoogleGenerativeAI } = require('@google/generative-ai');
// const app = express();
// app.use(express.json());

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// app.post('/generate', async (req, res) => {
//   try {
//     const { prompt } = req.body;
//     const result = await model.generateContent(prompt);
//     res.json({ text: result.response.text() });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.listen(3000);



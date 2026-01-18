import express, { Request, Response } from 'express';
import geminiRouter from './routes/gemini';
import cors from 'cors';
const app = express();
const port = 3000;

// Allow your frontend origin specifically (safer than '*')
app.use(cors({
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200  // For legacy browsers
}));

app.use('/gemini', geminiRouter);

// Basic route for the home page
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World! This is your basic Express TypeScript server.');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.get('/about', (req: Request, res: Response) => {
  res.send('This is the about page.');
});


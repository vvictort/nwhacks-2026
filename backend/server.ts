import express, { Request, Response } from 'express';
import geminiRouter from './routes/gemini';
import toysRouter from './src/routes/toys';
import userRouter from './src/routes/user';
import cors from 'cors';


const app = express();
const port = 3000;

// Allow your frontend origin specifically (safer than '*')
app.use(cors({
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200  // For legacy browsers
}));

app.get('/', (req: Request, res: Response) => {
    res.send('Connected successfully.');
});

app.use('/gemini', geminiRouter);
app.use('/toys', toysRouter);
app.use('/user', userRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


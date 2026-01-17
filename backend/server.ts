import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

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

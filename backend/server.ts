import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import geminiRouter from './routes/gemini';
import toysRouter from './src/routes/toys';
import usersRouter from './src/routes/user';
import { generalLimiter, apiLimiter } from './src/middleware/rateLimiter';

const app = express();
const port = 3000;
app.use(generalLimiter);

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200
}));

// Parse JSON bodies
app.use(express.json());

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'ToyJoy API Server',
    version: '1.0.0',
    endpoints: {
      gemini: '/gemini',
      toys: '/toys',
      users: '/users'
    }
  });
});

// Mount API routers
app.use('/gemini', geminiRouter);
app.use('/toys', toysRouter);  // Mounts toys routes with /toys prefix
app.use('/users', usersRouter); // Mounts users routes with /users prefix

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
  console.log(`📝 Available endpoints:`);
  console.log(`   GET  /              - API info`);
  console.log(`   GET  /toys          - List all toys (public)`);
  console.log(`   GET  /toys/:toyName - Get toy details (public)`);
  console.log(`   POST /toys          - Create toy (auth required)`);
  console.log(`   PATCH /toys/:toyName - Update toy (auth required)`);
  console.log(`   GET  /users         - Get current user (auth required)`);
  console.log(`   GET  /users/recommendations - Get recommendations (auth required)`);
  console.log(`   POST /gemini        - Gemini AI endpoint`);
});


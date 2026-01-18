import 'dotenv/config';
import express, { Request, Response } from "express";
import cors from "cors";
import { connectSnowflake } from "./src/config/snowflake";
import { generalLimiter, apiLimiter } from './src/middleware/rateLimiter';

import geminiRouter from "./routes/gemini";
import toysRouter from "./src/routes/toys";
import userRouter from "./src/routes/user";

const port = 3000;

async function main() {
    await connectSnowflake();

    const app = express();

    app.use(
        cors({
            origin: "http://localhost:5173",
            optionsSuccessStatus: 200,
        })
    );
    app.use(generalLimiter);
    app.use(express.json());

    app.get("/", (_req: Request, res: Response) => {
        res.send("Connected successfully.");
    });

    app.use("/gemini", geminiRouter);
    app.use("/toys", toysRouter);
    app.use("/user", userRouter);

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
        console.log(`   POST /gemini/classify        - Classify toy with Gemini AI`);
    });
}

main().catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
});


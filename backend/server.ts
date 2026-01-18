import express, { Request, Response } from "express";
import cors from "cors";

import geminiRouter from "./routes/gemini";
import toysRouter from "./src/routes/toys";
import userRouter from "./src/routes/user";
import { connectSnowflake } from "./src/config/snowflake";

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

    app.use(express.json());

    app.get("/", (_req: Request, res: Response) => {
        res.send("Connected successfully.");
    });

    app.use("/gemini", geminiRouter);
    app.use("/toys", toysRouter);
    app.use("/user", userRouter);

    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

main().catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
});
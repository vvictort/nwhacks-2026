"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const snowflake_1 = require("./src/config/snowflake");
const rateLimiter_1 = require("./src/middleware/rateLimiter");
const gemini_1 = __importDefault(require("./routes/gemini"));
const toys_1 = __importDefault(require("./src/routes/toys"));
const user_1 = __importDefault(require("./src/routes/user"));
const app = (0, express_1.default)();
const port = 3000;
async function main() {
    await (0, snowflake_1.connectSnowflake)();
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({
        origin: ["http://localhost:5173", "http://playitfwd.tech:5173"],
        optionsSuccessStatus: 200,
    }));
    app.use(rateLimiter_1.generalLimiter);
    app.use(express_1.default.json());
    app.get("/", (_req, res) => {
        res.send("Connected successfully.");
    });
    app.use("/gemini", gemini_1.default);
    app.use("/toys", toys_1.default);
    app.use("/user", user_1.default);
    app.use((req, res) => {
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

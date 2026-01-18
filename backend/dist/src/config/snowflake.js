"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectSnowflake = connectSnowflake;
exports.querySnowflake = querySnowflake;
// src/db/snowflake.ts
const snowflake_sdk_1 = __importDefault(require("snowflake-sdk"));
let connection = null;
function getConnection() {
    if (!connection) {
        // Only create connection if all required env vars are present
        if (!process.env.SNOWFLAKE_ACCOUNT || !process.env.SNOWFLAKE_USERNAME) {
            throw new Error('Snowflake credentials not configured. Please set SNOWFLAKE_ACCOUNT, SNOWFLAKE_USERNAME, etc. in .env');
        }
        connection = snowflake_sdk_1.default.createConnection({
            account: process.env.SNOWFLAKE_ACCOUNT,
            username: process.env.SNOWFLAKE_USERNAME,
            password: process.env.SNOWFLAKE_PASSWORD,
            warehouse: process.env.SNOWFLAKE_WAREHOUSE,
            database: process.env.SNOWFLAKE_DATABASE,
            schema: process.env.SNOWFLAKE_SCHEMA,
        });
    }
    return connection;
}
async function connectSnowflake() {
    const conn = getConnection();
    await new Promise((resolve, reject) => {
        conn.connect((err) => (err ? reject(err) : resolve()));
    });
}
async function querySnowflake(sqlText, binds = []) {
    const conn = getConnection();
    return await new Promise((resolve, reject) => {
        conn.execute({
            sqlText,
            binds, // use binds to prevent SQL injection
            complete: (err, _stmt, rows) => {
                if (err)
                    return reject(err);
                resolve((rows ?? []));
            },
        });
    });
}

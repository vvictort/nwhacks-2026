// src/db/snowflake.ts
import snowflake from "snowflake-sdk";

let connection: any = null;

function getConnection() {
    if (!connection) {
        // Only create connection if all required env vars are present
        if (!process.env.SNOWFLAKE_ACCOUNT || !process.env.SNOWFLAKE_USERNAME) {
            throw new Error('Snowflake credentials not configured. Please set SNOWFLAKE_ACCOUNT, SNOWFLAKE_USERNAME, etc. in .env');
        }

        connection = snowflake.createConnection({
            account: process.env.SNOWFLAKE_ACCOUNT!,
            username: process.env.SNOWFLAKE_USERNAME!,
            password: process.env.SNOWFLAKE_PASSWORD!,
            warehouse: process.env.SNOWFLAKE_WAREHOUSE!,
            database: process.env.SNOWFLAKE_DATABASE!,
            schema: process.env.SNOWFLAKE_SCHEMA!,
        });
    }
    return connection;
}

export async function connectSnowflake(): Promise<void> {
    const conn = getConnection();
    await new Promise<void>((resolve, reject) => {
        conn.connect((err: any) => (err ? reject(err) : resolve()));
    });
}

export async function querySnowflake<T = any>(sqlText: string, binds: any[] = []): Promise<T[]> {
    const conn = getConnection();
    return await new Promise<T[]>((resolve, reject) => {
        conn.execute({
            sqlText,
            binds, // use binds to prevent SQL injection
            complete: (err: any, _stmt: any, rows: any) => {
                if (err) return reject(err);
                resolve((rows ?? []) as T[]);
            },
        });
    });
}
// src/db/snowflake.ts
import snowflake from "snowflake-sdk";

const connection = snowflake.createConnection({
    account: process.env.SNOWFLAKE_ACCOUNT!,
    username: process.env.SNOWFLAKE_USERNAME!,
    password: process.env.SNOWFLAKE_PASSWORD!,
    warehouse: process.env.SNOWFLAKE_WAREHOUSE!,
    database: process.env.SNOWFLAKE_DATABASE!,
    schema: process.env.SNOWFLAKE_SCHEMA!,
});

export async function connectSnowflake(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
        connection.connect((err) => (err ? reject(err) : resolve()));
    });
}

export async function querySnowflake<T = any>(sqlText: string, binds: any[] = []): Promise<T[]> {
    return await new Promise<T[]>((resolve, reject) => {
        connection.execute({
            sqlText,
            binds, // use binds to prevent SQL injection
            complete: (err, _stmt, rows) => {
                if (err) return reject(err);
                resolve((rows ?? []) as T[]);
            },
        });
    });
}
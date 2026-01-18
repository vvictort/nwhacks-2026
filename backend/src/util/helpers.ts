import {querySnowflake} from "../config/snowflake";

export async function ensureUserRow(uid: string, email: string | null): Promise<void> {
    await querySnowflake(
        `MERGE INTO TOY_APP.PUBLIC.USERS u
     USING (SELECT ? AS USER_ID, ? AS EMAIL) s
     ON u.USER_ID = s.USER_ID
     WHEN NOT MATCHED THEN
       INSERT (USER_ID, EMAIL) VALUES (s.USER_ID, s.EMAIL)
     WHEN MATCHED THEN
       UPDATE SET EMAIL = COALESCE(s.EMAIL, u.EMAIL)`,
        [uid, email]
    );
}
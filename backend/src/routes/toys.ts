import { Router } from "express";
import { authenticateFirebaseToken } from "../middleware/authMiddleware";
import { AuthRequest } from "../types/auth-request";

const router = Router();

// POST /toys (auth required)
router.post("/toys", authenticateFirebaseToken, async (req: AuthRequest, res) => {
    const { toy_name, description, category, age_range, condition, image_data } = req.body;
    const owner_id = req.user.uid; // Extracted from Firebase token
    const image_id = `IMG_${Date.now()}`; // Simple unique ID for the prototype

    try {
        // 1. Start a transaction
        await snowflake.execute({ sql: "BEGIN" });

        // 2. Insert Toy Metadata
        const toySql = `
            INSERT INTO TOYS (TOY_NAME, DESCRIPTION, CATEGORY, AGE_RANGE, CONDITION, OWNER_ID, STATUS)
            VALUES (?, ?, ?, ?, ?, ?, 'AVAILABLE')
        `;
        await snowflake.execute({
            sql: toySql,
            binds: [toy_name, description, category, age_range, condition, owner_id]
        });

        // 3. Insert Image Data
        const imageSql = `
            INSERT INTO TOY_IMAGES (IMAGE_ID, TOY_NAME, IMAGE_DATA)
            VALUES (?, ?, ?)
        `;
        await snowflake.execute({
            sql: imageSql,
            binds: [image_id, toy_name, image_data]
        });

        // 4. Commit if both succeed
        await snowflake.execute({ sql: "COMMIT" });

        return res.status(201).json({ 
            message: "Toy created successfully", 
            toy_name 
        });

    } catch (error) {
        // Rollback if any part of the process fails
        await snowflake.execute({ sql: "ROLLBACK" });
        
        console.error("Database error:", error);
        return res.status(500).json({ error: "Failed to create toy listing" });
    }
});

// PATCH /toys/:toyName (auth required)
router.patch("/toys/:toyName", authenticateFirebaseToken, async (req: AuthRequest, res) => {
    const { toyName } = req.params;
    const ownerId = req.user.uid; // From Firebase
    const updates = req.body; // e.g., { description: "New desc", status: "SOLD" }

    // 1. Filter out fields that shouldn't be updated or are empty
    const allowedUpdates = ['DESCRIPTION', 'CATEGORY', 'AGE_RANGE', 'CONDITION', 'STATUS'];
    const fieldsToUpdate = Object.keys(updates)
        .filter(key => allowedUpdates.includes(key.toUpperCase()))
        .map(key => ({
            col: key.toUpperCase(),
            val: updates[key]
        }));

    if (fieldsToUpdate.length === 0) {
        return res.status(400).json({ error: "No valid fields provided for update" });
    }

    // 2. Build the Dynamic SQL
    // Example: SET DESCRIPTION = ?, STATUS = ?
    const setClause = fieldsToUpdate.map(f => `${f.col} = ?`).join(", ");
    const bindValues = fieldsToUpdate.map(f => f.val);
    
    // Add parameters for the WHERE clause
    bindValues.push(toyName);
    bindValues.push(ownerId);

    try {
        const sql = `
            UPDATE TOYS 
            SET ${setClause}
            WHERE TOY_NAME = ? 
            AND OWNER_ID = ?
        `;

        const result: any = await snowflake.execute({
            sql: sql,
            binds: bindValues
        });

        // 3. Check if any row was actually changed
        // Snowflake returns the number of updated rows in the result set
        const rowsUpdated = result[0]?.number_of_rows_updated || 0;

        if (rowsUpdated === 0) {
            return res.status(404).json({ 
                error: "Toy not found or you do not have permission to edit it." 
            });
        }

        return res.status(200).json({ 
            message: "Toy updated successfully", 
            toyName 
        });

    } catch (error) {
        console.error("Update error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// GET /toys (public)
router.get("/toys", async (_req, res) => {
    return res.status(200).json({
        toys: [
            {
                toyName: "LEGO Fire Truck",
                description: "Complete set, lightly used",
                category: "building_blocks",
                ageRange: "5-7",
                condition: "good",
                ownerId: "demo_uid_1",
                status: "available",
                createdAt: "2026-01-17T22:41:10.123Z",
            },
            {
                toyName: "Plush Bear",
                description: "Clean and soft",
                category: "plush",
                ageRange: "3-4",
                condition: "good",
                ownerId: "demo_uid_2",
                status: "available",
                createdAt: "2026-01-17T22:39:02.515Z",
            },
            {
                toyName: "Hot Wheels Track Set",
                description: "Includes 8 cars, one ramp missing",
                category: "vehicles",
                ageRange: "5-7",
                condition: "used",
                ownerId: "demo_uid_3",
                status: "available",
                createdAt: "2026-01-17T22:35:30.000Z",
            },
        ],
    });
});

// GET /toys/:toyName (public)
router.get("/toys/:toyName", async (req, res) => {
    const { toyName } = req.params;

    try {
        const sql = `
            SELECT 
                t.TOY_NAME,
                t.DESCRIPTION,
                t.CATEGORY,
                t.AGE_RANGE,
                t.CONDITION,
                t.OWNER_ID,
                t.STATUS,
                t.CREATED_AT,
                i.IMAGE_DATA
            FROM TOYS t
            LEFT JOIN TOY_IMAGES i ON t.TOY_NAME = i.TOY_NAME
            WHERE t.TOY_NAME = ?
        `;

        const rows: any[] = await snowflake.execute({
            sql: sql,
            binds: [toyName]
        });

        // Snowflake returns an array of rows
        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: "Toy not found" });
        }

        const toy = rows[0];

        return res.status(200).json(toy);

    } catch (error) {
        console.error("Fetch error:", error);
        return res.status(500).json({ error: "Failed to retrieve toy details" });
    }
});

export default router;
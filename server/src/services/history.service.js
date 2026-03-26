import { query } from "../config/db.js";

export const getHistory = async (userId) => {
    if (!userId) {
        const err = new Error("Missing user");
        err.statusCode = 400;
        throw err;
    }
    console.log(userId)
    const res = await query(
        "SELECT * FROM completed_workouts WHERE user_id = $1",
        [userId]
    );

    return res.rows;
};


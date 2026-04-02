import { query } from "../config/db.js";

export const getHistory = async (userId) => {

    const res = await query(
        "SELECT * FROM completed_workouts WHERE user_id = $1",
        [userId]
    );

    return res.rows;
};


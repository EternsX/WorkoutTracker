import bcrypt from "bcrypt";
import { query } from "../config/db.js";

export const register = async ({ username, password }) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await query(
        `INSERT INTO users (username, password)
         VALUES ($1, $2)
         ON CONFLICT (username) DO NOTHING
         RETURNING id, username`,
        [username, hashedPassword]
    );

    if (!result.rows.length) {
        const err = new Error("Username already exists");
        err.statusCode = 400;
        throw err;
    }

    return result.rows[0];
};

export const login = async ({ username, password }) => {
    const result = await query(
        `SELECT id, username, password FROM users WHERE username = $1`,
        [username]
    );

    const user = result.rows[0];

    if (!user) {
        const err = new Error("Invalid username or password");
        err.statusCode = 401;
        throw err;
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        const err = new Error("Invalid username or password");
        err.statusCode = 401;
        throw err;
    }

    return {
        id: user.id,
        username: user.username
    };
};

export const getById = async (id) => {
    const result = await query(
        `SELECT id, username FROM users WHERE id = $1`,
        [id]
    );

    return result.rows[0] || null;
};
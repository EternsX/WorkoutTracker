import bcrypt from "bcrypt";
import { query } from "../config/db.js";

export const register = async ({ username, email, password }) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const result = await query(
            `INSERT INTO users (username, email, password)
         VALUES ($1, $2, $3)
         RETURNING id, username`,
            [username, email, hashedPassword]
        );

        return result.rows[0];
    } catch (err) {
        if (err.code === "23505") {
            if (err.detail?.includes("username")) {
                throw new Error("Username already exists");
            }
            if (err.detail?.includes("email")) {
                throw new Error("Email already exists");
            }
            throw new Error("User already exists");
        }
        throw err;
    }
};

export const login = async ({ usernameOrEmail, password }) => {
    const email = usernameOrEmail.includes("@") ? usernameOrEmail : null;
    const username = email ? null : usernameOrEmail;

    const result = await query(
        `SELECT id, username, password FROM users WHERE username = $1 OR email = $2`,
        [username, email]
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
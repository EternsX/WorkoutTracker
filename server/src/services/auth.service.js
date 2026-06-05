import bcrypt from "bcrypt";
import { query } from "../config/db.js";
import crypto from "crypto";

export const register = async ({ username, email, password }) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = crypto.randomBytes(32).toString("hex");
    const expire = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    try {
        const result = await query(
            `INSERT INTO users (username, email, password, verification_token, verification_token_expires)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, username, email, verified`,
            [username, email, hashedPassword, token, expire]
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
        username: user.username,
        email: user.email,
        verified: user.verified
    };
};

export const getById = async (id) => {
    const result = await query(
        `SELECT id, username, email, verified FROM users WHERE id = $1`,
        [id]
    );

    return result.rows[0] || null;
};

export const verify = async (token) => {
    const result = await query(
        `UPDATE users SET verified = now() WHERE verification_token = $1 RETURNING id`,
        [token]
    );
    console.log("Verification result:", result.rows[0]);

    if (!result.rows[0]) {
        const err = new Error("User not found");
        err.statusCode = 404;
        throw err;
    }
    console.log("User verified:", result.rows[0]);
    
    return result.rows[0];
};

export const updateUsername = async (id, username) => {
    const result = await query(
        `UPDATE users SET username = $1 WHERE id = $2 RETURNING id, username, email, verified`,
        [username, id]
    );

    if (!result.rows[0]) {
        const err = new Error("User not found");
        err.statusCode = 404;
        throw err;
    }

    return result.rows[0];
};

export const updateEmail = async (id, email) => {
    const result = await query(
        `UPDATE users SET email = $1 WHERE id = $2 RETURNING id, username, email, verified`,
        [email, id]
    );
    
    if (!result.rows[0]) {
        const err = new Error("User not found");
        err.statusCode = 404;
        throw err;
    }
    
    return result.rows[0];
};
import bcrypt from "bcrypt";
import { query } from "../config/db.js";
import crypto from "crypto";
import JobFlow from "../../../../JobFlow/JobFlow/JobFlow.js"
import AppError from "../AppError/AppError.js";

const jobFlow = new JobFlow();

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
        console.log(1)
        const res = await jobFlow.sendWelcomeEmail(process.env.EMAIL, email, username);
        console.log('WorkoutTracker', res);
        return result.rows[0];
    } catch (err) {
        if (err.code === "23505") {
            if (err.detail?.includes("username")) {
                throw new AppError("Username already exists", "register", "USERNAME_EXISTS", 409);
            }
            if (err.detail?.includes("email")) {
                throw new AppError("Email already exists", "register", "EMAIL_EXISTS", 409);
            }
            throw new AppError("User already exists", "register", "USER_EXISTS", 409);
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
        throw new AppError("Invalid username or password", "login", "INVALID_CREDENTIALS", 401);
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        throw new AppError("Invalid username or password", "login", "INVALID_CREDENTIALS", 401);
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

    if (!result.rows[0]) {
        throw new AppError("User not found", "verify", "USER_NOT_FOUND", 404);
    }

    return result.rows[0];
};

export const updateUsername = async (id, username) => {
    try {

    const result = await query(
        `UPDATE users SET username = $1 WHERE id = $2 RETURNING id, username, email, verified`,
        [username, id]
    );

    if (!result.rows[0]) {
        throw new AppError("User not found", "username", "USER_NOT_FOUND", 404);
    }

    return result.rows[0];
    } catch (err) {
        if (err.code === "23505" && err.constraint === "users_username_key") {
            throw new AppError("Username already exists", "username", "USERNAME_EXISTS", 409);
        }
        throw err;
    }
};

export const updateEmail = async (id, email) => {
    try {
        const result = await query(
            `UPDATE users SET email = $1, verified = NULL WHERE id = $2 RETURNING id, username, email, verified`,
            [email, id]
        );

        if (!result.rows[0]) {
            throw new AppError("User not found", "email", "USER_NOT_FOUND", 404);
        }

        return result.rows[0];
    } catch (err) {
        if (err.code === "23505" && err.constraint === "users_email_key") {
            throw new AppError("Email already exists", "email", "EMAIL_EXISTS", 409);
        }
        throw err;
    }
};

export const deleteAccount = async (id) => {
    const result = await query(
        `DELETE FROM users WHERE id = $1 RETURNING id`,
        [id]
    );

    if (!result.rows[0]) {
        throw new AppError("User not found", "deleteAccount", "USER_NOT_FOUND", 404);
    }

    return result.rows[0];
};
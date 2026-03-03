import * as authService from "../services/auth.service.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from '../middleware/asyncHandler.js';

export const register = asyncHandler(async (req, res) => {
    const user = await authService.register(req.body);

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    });

    res.status(201).json({ user, token });
});

export const login = asyncHandler(async (req, res) => {
    const user = await authService.login(req.body);

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    });

    res.json({ user, token });
});

export const logout = asyncHandler(async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out" });
});

export const user = asyncHandler(async (req, res) => {
    const token = req.cookies.token;

    if (!token) return res.status(200).json({ user: null });

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        err.statusCode = 401;
        throw err;
    }

    res.json({ user: { id: decoded.id } });
});
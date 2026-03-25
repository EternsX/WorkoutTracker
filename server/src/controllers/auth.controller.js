import * as authService from "../services/auth.service.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from '../middleware/asyncHandler.js';

export const register = asyncHandler(async (req, res) => {
    const user = await authService.register(req.body);

    const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.status(201).json({ user, token }); // ✅ send token
});

export const login = asyncHandler(async (req, res) => {
    const user = await authService.login(req.body);

    const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.json({ user, token }); // ✅ send token
});

export const logout = asyncHandler(async (req, res) => {
    res.json({ message: "Logged out" }); // no cookie anymore
});

export const user = asyncHandler(async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(200).json({ user: null });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ user: { id: decoded.id } });
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
});
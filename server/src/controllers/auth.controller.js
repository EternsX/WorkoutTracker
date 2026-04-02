import * as authService from "../services/auth.service.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from '../middleware/asyncHandler.js';

// Not using Cookie-based auth, cause it made the deployment through Render problematic

// Register
export const register = asyncHandler(async (req, res) => {

    const user = await authService.register(req.body);

    const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.status(201).json({ user, token });
});

// Login
export const login = asyncHandler(async (req, res) => {

    const user = await authService.login(req.body);

    const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.json({ user, token });
});

// Logout (stateless JWT)
export const logout = asyncHandler(async (req, res) => {
    res.json({ message: "Logged out" });
});

// Get current user
export const user = asyncHandler(async (req, res) => {
    res.json({ user: req.user || null });
});
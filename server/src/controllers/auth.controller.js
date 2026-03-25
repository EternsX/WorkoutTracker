// src/controllers/auth.controller.js
import * as authService from "../services/auth.service.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from '../middleware/asyncHandler.js';

const cookieOptions = {
  httpOnly: true,       // cannot be accessed by JS
  secure: true,         // HTTPS only, required for SameSite=None
  sameSite: "none",     // allow cross-origin
  maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
};

export const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  // Set cookie
  res.cookie("token", token, cookieOptions);

  res.status(201).json({ user });
});

export const login = asyncHandler(async (req, res) => {
  const user = await authService.login(req.body);

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  // Set cookie
  res.cookie("token", token, cookieOptions);

  res.json({ user, token });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", { ...cookieOptions });
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
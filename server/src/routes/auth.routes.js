import express from "express";
import {
    register,
    login,
    logout,
    user
} from "../controllers/auth.controller.js";
import { authLimiter } from '../middleware/rateLimiter.js';


import { validate } from "../middleware/validate.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);

router.use(authMiddleware);

router.get("/user", user);
router.get("/logout", logout);

export default router;
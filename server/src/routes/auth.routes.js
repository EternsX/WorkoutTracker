import express from "express";
import {
    register,
    login,
    logout,
    user,   
    verify,
    updateUsername,
    updateEmail,
    deleteAccount
} from "../controllers/auth.controller.js";
import { authLimiter } from '../middleware/rateLimiter.js';


import { validate } from "../middleware/validate.js";
import { registerSchema, loginSchema, updateEmailSchema, updateUsernameSchema } from "../validators/auth.validator.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);

router.use(authMiddleware);

router.get("/user", user);
router.get("/logout", logout);
router.get("/verify/:token", verify);
router.put("/update-username", validate(updateUsernameSchema), updateUsername);
router.put("/update-email", validate(updateEmailSchema), updateEmail);
router.delete("/delete-account", deleteAccount);

export default router;
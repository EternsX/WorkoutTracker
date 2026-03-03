import express from "express";
import {
    register,
    login,
    logout,
    user
} from "../controllers/auth.controller.js";


const router = express.Router();

router.get("/user", user);
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

export default router;
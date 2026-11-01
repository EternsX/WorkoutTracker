import jwt from "jsonwebtoken";
import * as authService from "../services/auth.service.js";

export default async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    console.log("AUTH HEADER EXISTS:", !!authHeader);
    console.log("JWT SECRET EXISTS:", !!process.env.JWT_SECRET);

    if (!authHeader) {
        req.user = null;
        return next();
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({ error: "Invalid token format" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("JWT VERIFIED");
        console.log("DECODED ID:", decoded.id);

        const user = await authService.getById(decoded.id);

        console.log("USER FOUND:", !!user);

        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        req.user = user;
        return next();

    } catch (err) {
        console.log("JWT ERROR:", err.name, err.message);
        return res.status(401).json({ error: "Invalid token" });
    }
}
import jwt from 'jsonwebtoken';

export default function authMiddleware(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: 'Not logged in' });
    }

    // verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('JWT verification error:', err); // log for debugging
            return res.status(401).json({ error: 'Invalid token' });
        }

        req.user = decoded; // attach user info to request
        next();
    });
}
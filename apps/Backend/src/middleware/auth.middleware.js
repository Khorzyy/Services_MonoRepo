import { getSession } from '../utils/session.js';

export const requireLogin = (req, res, next) => {

    const sessionId = req.headers['x-session-id'];

    if (!sessionId) {
        return res.status(401).json({
            message: "Session diperlukan"
        });
    }

    const user = getSession(sessionId);

    if (!user) {
        return res.status(401).json({
            message: "Session tidak valid"
        });
    }

    req.user = user;

    next();
};
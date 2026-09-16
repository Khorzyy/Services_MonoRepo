import { loginService } from '../services/auth.service.js';
import { createSession } from '../utils/session.js';
import { deleteSession } from '../utils/session.js';

export const login = async (req, res) => {
    try {

        const { username, password } = req.body;

        const user = await loginService(username, password);

        const sessionId = createSession(user);

        res.json({
            message: "Login berhasil",
            sessionId,
            user
        });

    } catch (err) {

        res.status(401).json({
            message: err.message
        });

    }
};

export const logout = (req, res) => {
    const sessionId = req.headers['authorization']?.split(' ')[1];
    if (sessionId) {
        deleteSession(sessionId);
        res.json({ message: "Logout berhasil" });
    } else {
        res.status(400).json({ message: "Session ID tidak ditemukan" });
    }
};
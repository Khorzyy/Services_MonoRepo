import app from './app.js';
import http from 'http';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    // Jika Anda punya logic verifyToken, bisa dipanggil di sini
    // if (!verifyToken(token)) return next(new Error("Unauthorized"));

    // Simpan token/user info di socket untuk dipakai nanti
    socket.auth = { token };
    next();
});

io.on('connection', (socket) => {
    console.log('🔌 Frontend connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('🔌 Frontend disconnected:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Server + Socket.io running on port ${PORT}`);
});
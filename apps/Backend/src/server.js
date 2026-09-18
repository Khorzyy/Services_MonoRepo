import app from './app.js';
import http from 'http';
import { Server } from 'socket.io';
// import mongodb modules
import mongoose from 'mongoose';

// port from .env
const PORT = process.env.PORT || 5000;

// server
const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"],
        credentials: true,
    },
});

// socket authentication middleware
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    // if (!verifyToken(token)) return next(new Error("Unauthorized"));

    socket.auth = {
        token
    };

    next();

});

// socket connection event
io.on('connection', (socket) => {
    console.log('🔌 Frontend connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('🔌 Frontend disconnected:', socket.id);
    });
});

// MongoDB Connection
mongoose.connect(process.env.MONGOURI)
    .then(() => console.log('MongoDB Atlas connected'))
    .catch((err) => console.error('Connection error:', err));

server.listen(PORT, () => {
    console.log(`🚀 Server + Socket.io running on port ${PORT}`);
});
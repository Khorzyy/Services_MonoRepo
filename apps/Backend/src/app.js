// Import Modules
import express from 'express';
import cors from 'cors';

// Import Parkirent Routes
import petugasRoutes from './routes/petugas.routes.js';
import ParkirentauthRoutes from './routes/auth.routes.js';
import parkirRoutes from './routes/iot.routes.js';
import ownerRoutes from './routes/owner.routes.js';
import adminRoutes from './routes/admin.routes.js';
import "./services/mqtt.service.js";

// Import Opendata Routes and Auth Modules
import tableRoutes from './controllers/tableRoutes.js';
import dataRoutes from './controllers/dataRoutes.js';
import uploadRoutes from './config/upload.js';
import OpendataAuthRoutes from '../../Backend/src/routes/auth.js';
import { verifyToken } from '../../Backend/src/middleware/authMiddleware.js';

const app = express();

// ParkirentMiddleware
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
}));
app.use(express.json());

// Opendata Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Parkirent Routes
app.use('/auth', ParkirentauthRoutes);
app.use('/parkir', parkirRoutes);
app.use('/petugas', petugasRoutes);
app.use('/owner', ownerRoutes);
app.use('/admin', adminRoutes);

// Opendata Routes
app.use('/api/admin', OpendataAuthRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/data', dataRoutes);
app.use('/tables', uploadRoutes);

// Protected Openndata Route
app.get('/api/admin/dashboard', verifyToken, (req, res) => {
    res.json({ message: `Selamat datang admin: ${req.admin.email}` });
});

// Health Check Endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default app;
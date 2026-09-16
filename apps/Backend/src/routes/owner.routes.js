import express from "express";
import { requireLogin } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

import {
    incomePerMonth,
    vehicleStats,
    recentTransaksi
} from "../controllers/owner.controller.js";

const router = express.Router();


router.get("/income", requireLogin, requireRole("owner"), incomePerMonth);
router.get("/vehicle", requireLogin, requireRole("owner"), vehicleStats);
router.get("/recent", requireLogin, requireRole("owner"), recentTransaksi);

export default router;
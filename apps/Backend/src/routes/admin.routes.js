import express from "express";
import { requireLogin } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

import {
    getUser,
    createUserController,
    updateUserController,
    getTarifController,
    updateTarifController
} from "../controllers/admin.controller.js";


const router = express.Router();

router.get("/user", requireLogin, requireRole("admin"), getUser);
router.post("/user", requireLogin, requireRole("admin"), createUserController);
router.put("/user/:id", requireLogin, requireRole("admin"), updateUserController);
router.get("/tarif", requireLogin, requireRole("admin"), getTarifController);
router.put("/tarif/:id", requireLogin, requireRole("admin"), updateTarifController);

export default router;
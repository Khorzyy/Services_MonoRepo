import express from "express";
import { requireRole } from "../middleware/role.middleware.js";
import { requireLogin } from "../middleware/auth.middleware.js";

import {
    parkirAktif,
    menungguBayar,
    riwayatParkir,
    bukaPalangPetugas
} from "../controllers/petugas.controller.js";

const router = express.Router();


router.get("/parkir-aktif", parkirAktif, requireRole(["petugas"]), requireLogin);
router.get("/menunggu-bayar", menungguBayar, requireRole(["petugas"]), requireLogin);
router.get("/riwayat", riwayatParkir, requireRole(["petugas"]), requireLogin);
router.post("/buka-palang/:id", bukaPalangPetugas, requireRole(["petugas"]), requireLogin);


export default router;
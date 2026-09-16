import express from 'express';
import { entryRFID, exitRFID } from '../controllers/iot.controller.js';

const router = express.Router();

router.post('/entry', entryRFID);
router.post('/exit', exitRFID);

export default router;
import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { syncAccount } from '../controllers/authController.js';

const router = Router();

router.post('/sync', authenticate, asyncHandler(syncAccount));

export default router;

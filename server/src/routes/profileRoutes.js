import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getMyProfile, updateMyProfile } from '../controllers/profileController.js';

const router = Router();

router.get('/me', authenticate, asyncHandler(getMyProfile));
router.put('/me', authenticate, asyncHandler(updateMyProfile));

export default router;

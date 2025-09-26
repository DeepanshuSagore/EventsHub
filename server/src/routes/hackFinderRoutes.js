import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  createHackFinderPost,
  listPublishedHackFinderPosts
} from '../controllers/hackFinderController.js';

const router = Router();

router.get('/', asyncHandler(listPublishedHackFinderPosts));
router.post('/', authenticate, requireRole('student', 'eventHead', 'admin'), asyncHandler(createHackFinderPost));

export default router;

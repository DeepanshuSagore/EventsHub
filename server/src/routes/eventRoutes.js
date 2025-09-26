import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createEvent, listPublishedEvents } from '../controllers/eventController.js';

const router = Router();

router.get('/', asyncHandler(listPublishedEvents));
router.post('/', authenticate, requireRole('admin', 'eventHead'), asyncHandler(createEvent));

export default router;

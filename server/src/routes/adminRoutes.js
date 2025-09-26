import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  approveEvent,
  approveHackFinderPost,
  deleteEvent,
  deleteHackFinderPost,
  getAdminQueues,
  rejectEvent,
  rejectHackFinderPost
} from '../controllers/adminController.js';

const router = Router();

router.use(authenticate);
router.use(requireRole('admin'));

router.get('/queues', asyncHandler(getAdminQueues));
router.post('/events/:eventId/approve', asyncHandler(approveEvent));
router.post('/events/:eventId/reject', asyncHandler(rejectEvent));
router.delete('/events/:eventId', asyncHandler(deleteEvent));
router.post('/hackfinder/:postId/approve', asyncHandler(approveHackFinderPost));
router.post('/hackfinder/:postId/reject', asyncHandler(rejectHackFinderPost));
router.delete('/hackfinder/:postId', asyncHandler(deleteHackFinderPost));

export default router;

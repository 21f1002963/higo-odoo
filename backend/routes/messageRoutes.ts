import express from 'express';
import { auth } from '../middleware/auth';
import {
  sendMessage,
  getConversations,
  getMessages,
  markAsRead
} from '../controllers/messageController';

const router = express.Router();

// All message routes require authentication
router.use(auth);

router.post('/', sendMessage);
router.get('/conversations', getConversations);
router.get('/:productId/:userId', getMessages);
router.put('/:messageId/read', markAsRead);

export default router; 
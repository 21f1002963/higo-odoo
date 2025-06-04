import express from 'express';
import { auth } from '../middleware/auth';
import {
  register,
  login,
  getProfile,
  updateProfile,
  getUserProducts,
  getUserReviews,
  addReview
} from '../controllers/userController';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/:userId/products', getUserProducts);
router.get('/:userId/reviews', getUserReviews);

// Protected routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.post('/:userId/reviews', auth, addReview);

export default router; 
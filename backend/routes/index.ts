import express from 'express';
import productRoutes from './productRoutes';
import userRoutes from './userRoutes';
import messageRoutes from './messageRoutes';

const router = express.Router();

router.use('/products', productRoutes);
router.use('/users', userRoutes);
router.use('/messages', messageRoutes);

export default router; 
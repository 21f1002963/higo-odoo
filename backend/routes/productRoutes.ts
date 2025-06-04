import express from 'express';
import { auth } from '../middleware/auth';
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  placeBid,
  saveProduct
} from '../controllers/productController';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected routes
router.post('/', auth, createProduct);
router.put('/:id', auth, updateProduct);
router.delete('/:id', auth, deleteProduct);
router.post('/:id/bid', auth, placeBid);
router.post('/:id/save', auth, saveProduct);

export default router; 
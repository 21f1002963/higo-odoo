import { Router } from 'express';
import { register, verifyPhone, verifyEmail, login } from '../controllers/authController';
import { resendOTP, resendEmailVerification } from '../controllers/resendController';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();



router.post('/register', register);
router.post('/verify-phone', verifyPhone);
router.get('/verify-email', verifyEmail);
router.post('/login', login);

// Auth required for resending
router.post('/resend-otp', requireAuth, resendOTP);
router.post('/resend-email', requireAuth, resendEmailVerification);

export default router;

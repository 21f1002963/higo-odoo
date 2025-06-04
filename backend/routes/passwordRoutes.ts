import { Router } from 'express';
import { requestPasswordReset, resetPassword } from '../controllers/passwordController';

const router = Router();

router.post('/request-password-reset', (req, res) => { requestPasswordReset(req, res); });
router.post('/reset-password', (req, res) => { resetPassword(req, res); });

export default router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const resendController_1 = require("../controllers/resendController");
const requireAuth_1 = require("../middleware/requireAuth");
const router = (0, express_1.Router)();
router.post('/register', authController_1.register);
router.post('/verify-phone', authController_1.verifyPhone);
router.get('/verify-email', authController_1.verifyEmail);
router.post('/login', authController_1.login);
// Auth required for resending
router.post('/resend-otp', requireAuth_1.requireAuth, resendController_1.resendOTP);
router.post('/resend-email', requireAuth_1.requireAuth, resendController_1.resendEmailVerification);
exports.default = router;

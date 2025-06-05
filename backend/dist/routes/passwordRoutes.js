"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passwordController_1 = require("../controllers/passwordController");
const router = (0, express_1.Router)();
router.post('/request-password-reset', (req, res) => { (0, passwordController_1.requestPasswordReset)(req, res); });
router.post('/reset-password', (req, res) => { (0, passwordController_1.resetPassword)(req, res); });
exports.default = router;

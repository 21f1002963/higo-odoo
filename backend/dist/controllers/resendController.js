"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendEmailVerification = exports.resendOTP = void 0;
const User_1 = __importDefault(require("../models/User"));
const email_1 = require("../lib/email");
const sms_1 = require("../lib/sms");
const resendOTP = async (req, res) => {
    try {
        const userId = res.locals.userId || req.body.userId; // userId from auth middleware or body
        const user = await User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }
        if (user.phoneVerified) {
            res.status(400).json({ message: 'Phone already verified.' });
            return;
        }
        // Generate new OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();
        await (0, sms_1.sendSMS)({
            to: user.phone,
            message: `Your EcoFinds OTP is: ${otp}`
        });
        res.json({ message: 'OTP resent.' });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};
exports.resendOTP = resendOTP;
const resendEmailVerification = async (req, res) => {
    try {
        const userId = res.locals.userId || req.body.userId; // userId from auth middleware or body
        const user = await User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }
        if (user.emailVerified) {
            res.status(400).json({ message: 'Email already verified.' });
            return;
        }
        const emailVerificationLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?userId=${user._id}`;
        await (0, email_1.sendEmail)({
            to: user.email,
            subject: 'EcoFinds Email Verification',
            html: `<p>Hi ${user.name},</p><p>Click <a href="${emailVerificationLink}">here</a> to verify your email for EcoFinds.</p>`
        });
        res.json({ message: 'Verification email resent.' });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};
exports.resendEmailVerification = resendEmailVerification;

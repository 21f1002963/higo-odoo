"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.requestPasswordReset = void 0;
const User_1 = __importDefault(require("../models/User"));
const email_1 = require("../lib/email");
const sms_1 = require("../lib/sms");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Helper to generate OTP
function generateOTP(length = 6) {
    return Math.floor(100000 + Math.random() * 900000).toString().substring(0, length);
}
// 1. Request password reset (send OTP to email and phone if user exists)
const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email)
            return res.status(400).json({ message: 'Email is required.' });
        const user = await User_1.default.findOne({ email });
        if (!user) {
            // For security, do not reveal if user exists
            return res.json({ message: 'If an account exists for this email, an OTP has been sent.' });
        }
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();
        // Send OTP to email
        await (0, email_1.sendEmail)({
            to: user.email,
            subject: 'EcoFinds Password Reset OTP',
            html: `<p>Your OTP for password reset is: <b>${otp}</b></p>`
        });
        // Optionally, send OTP to phone as well
        if (user.phone) {
            await (0, sms_1.sendSMS)({
                to: user.phone,
                message: `Your EcoFinds password reset OTP is: ${otp}`
            });
        }
        return res.json({ message: 'If an account exists for this email, an OTP has been sent.' });
    }
    catch (err) {
        return res.status(500).json({ message: 'Server error', error: err });
    }
};
exports.requestPasswordReset = requestPasswordReset;
// 2. Reset password (verify OTP and set new password)
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        const user = await User_1.default.findOne({ email });
        if (!user || !user.otp || !user.otpExpires) {
            return res.status(400).json({ message: 'Invalid request.' });
        }
        if (user.otp !== otp || user.otpExpires < new Date()) {
            return res.status(400).json({ message: 'Invalid or expired OTP.' });
        }
        user.password = await bcryptjs_1.default.hash(newPassword, 10);
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();
        return res.json({ message: 'Password reset successful.' });
    }
    catch (err) {
        return res.status(500).json({ message: 'Server error', error: err });
    }
};
exports.resetPassword = resetPassword;

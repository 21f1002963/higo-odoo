"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.verifyEmail = exports.verifyPhone = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const email_1 = require("../lib/email");
const sms_1 = require("../lib/sms");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Helper to generate OTP
function generateOTP(length = 6) {
    return Math.floor(100000 + Math.random() * 900000).toString().substring(0, length);
}
const register = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        if (!name || !email || !phone || !password) {
            res.status(400).json({ message: 'All fields are required.' });
            return;
        }
        const existingUser = await User_1.default.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            res.status(409).json({ message: 'User already exists.' });
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
        const user = await User_1.default.create({
            name,
            email,
            phone,
            password: hashedPassword,
            otp,
            otpExpires,
            isVerified: false,
            emailVerified: false,
            phoneVerified: false,
        });
        // Send OTP to phone (production: real SMS)
        await (0, sms_1.sendSMS)({
            to: phone,
            message: `Your EcoFinds OTP is: ${otp}`
        });
        // Send confirmation link to email (production: real email)
        const emailVerificationLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?userId=${user._id}`;
        await (0, email_1.sendEmail)({
            to: email,
            subject: 'EcoFinds Email Verification',
            html: `<p>Hi ${name},</p><p>Click <a href="${emailVerificationLink}">here</a> to verify your email for EcoFinds.</p>`
        });
        res.status(201).json({ message: 'User registered. Please verify your phone and email.', userId: user._id });
        return;
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
        return;
    }
};
exports.register = register;
const verifyPhone = async (req, res) => {
    try {
        const { userId, otp } = req.body;
        const user = await User_1.default.findById(userId);
        if (!user || !user.otp || !user.otpExpires) {
            res.status(400).json({ message: 'Invalid request.' });
            return;
        }
        if (user.otp !== otp || user.otpExpires < new Date()) {
            res.status(400).json({ message: 'Invalid or expired OTP.' });
            return;
        }
        user.phoneVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        if (user.emailVerified)
            user.isVerified = true;
        await user.save();
        res.json({ message: 'Phone verified successfully.' });
        return;
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
        return;
    }
};
exports.verifyPhone = verifyPhone;
const verifyEmail = async (req, res) => {
    try {
        const { userId } = req.query;
        const user = await User_1.default.findById(userId);
        if (!user) {
            res.status(400).json({ message: 'Invalid link.' });
            return;
        }
        user.emailVerified = true;
        if (user.phoneVerified)
            user.isVerified = true;
        await user.save();
        res.json({ message: 'Email verified successfully.' });
        return;
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
        return;
    }
};
exports.verifyEmail = verifyEmail;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials.' });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid credentials.' });
            return;
        }
        if (!user.isVerified) {
            res.status(403).json({ message: 'Please verify your phone and email.' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone } });
        return;
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
        return;
    }
};
exports.login = login;

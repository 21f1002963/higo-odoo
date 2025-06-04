"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.verifyEmail = exports.verifyPhone = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
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
            return res.status(400).json({ message: 'All fields are required.' });
        }
        const existingUser = await User_1.default.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists.' });
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
        // TODO: Send OTP to phone and confirmation link to email
        return res.status(201).json({ message: 'User registered. Please verify your phone and email.', userId: user._id });
    }
    catch (err) {
        return res.status(500).json({ message: 'Server error', error: err });
    }
};
exports.register = register;
const verifyPhone = async (req, res) => {
    try {
        const { userId, otp } = req.body;
        const user = await User_1.default.findById(userId);
        if (!user || !user.otp || !user.otpExpires) {
            return res.status(400).json({ message: 'Invalid request.' });
        }
        if (user.otp !== otp || user.otpExpires < new Date()) {
            return res.status(400).json({ message: 'Invalid or expired OTP.' });
        }
        user.phoneVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        if (user.emailVerified)
            user.isVerified = true;
        await user.save();
        return res.json({ message: 'Phone verified successfully.' });
    }
    catch (err) {
        return res.status(500).json({ message: 'Server error', error: err });
    }
};
exports.verifyPhone = verifyPhone;
const verifyEmail = async (req, res) => {
    try {
        const { userId } = req.query;
        const user = await User_1.default.findById(userId);
        if (!user)
            return res.status(400).json({ message: 'Invalid link.' });
        user.emailVerified = true;
        if (user.phoneVerified)
            user.isVerified = true;
        await user.save();
        return res.json({ message: 'Email verified successfully.' });
    }
    catch (err) {
        return res.status(500).json({ message: 'Server error', error: err });
    }
};
exports.verifyEmail = verifyEmail;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user)
            return res.status(401).json({ message: 'Invalid credentials.' });
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ message: 'Invalid credentials.' });
        if (!user.isVerified)
            return res.status(403).json({ message: 'Please verify your phone and email.' });
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
        return res.json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone } });
    }
    catch (err) {
        return res.status(500).json({ message: 'Server error', error: err });
    }
};
exports.login = login;

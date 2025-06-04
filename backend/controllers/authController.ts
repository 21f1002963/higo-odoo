import { RequestHandler } from 'express';
import User from '../models/User';
import { sendEmail } from '../lib/email';
import { sendSMS } from '../lib/sms';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// Helper to generate OTP
function generateOTP(length = 6) {
  return Math.floor(100000 + Math.random() * 900000).toString().substring(0, length);
}

export const register: RequestHandler = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) {
      res.status(400).json({ message: 'All fields are required.' });
      return;
    }
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      res.status(409).json({ message: 'User already exists.' });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    const user = await User.create({
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
    await sendSMS({
      to: phone,
      message: `Your EcoFinds OTP is: ${otp}`
    });

    // Send confirmation link to email (production: real email)
    const emailVerificationLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?userId=${user._id}`;
    await sendEmail({
      to: email,
      subject: 'EcoFinds Email Verification',
      html: `<p>Hi ${name},</p><p>Click <a href="${emailVerificationLink}">here</a> to verify your email for EcoFinds.</p>`
    });
    res.status(201).json({ message: 'User registered. Please verify your phone and email.', userId: user._id });
    return;
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
    return;
  }
};

export const verifyPhone: RequestHandler = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const user = await User.findById(userId);
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
    if (user.emailVerified) user.isVerified = true;
    await user.save();
    res.json({ message: 'Phone verified successfully.' });
    return;
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
    return;
  }
};

export const verifyEmail: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.query;
    const user = await User.findById(userId);
    if (!user) {
      res.status(400).json({ message: 'Invalid link.' });
      return;
    }
    user.emailVerified = true;
    if (user.phoneVerified) user.isVerified = true;
    await user.save();
    res.json({ message: 'Email verified successfully.' });
    return;
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
    return;
  }
};

export const login: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials.' });
      return;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials.' });
      return;
    }
    if (!user.isVerified) {
      res.status(403).json({ message: 'Please verify your phone and email.' });
      return;
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone } });
    return;
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
    return;
  }
};

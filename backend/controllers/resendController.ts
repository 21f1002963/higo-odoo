import { RequestHandler } from 'express';
import User from '../models/User';
import { sendEmail } from '../lib/email';
import { sendSMS } from '../lib/sms';

export const resendOTP: RequestHandler = async (req, res) => {
  try {
    const userId = res.locals.userId || req.body.userId; // userId from auth middleware or body
    const user = await User.findById(userId);
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
    await sendSMS({
      to: user.phone,
      message: `Your EcoFinds OTP is: ${otp}`
    });
    res.json({ message: 'OTP resent.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

export const resendEmailVerification: RequestHandler = async (req, res) => {
  try {
    const userId = res.locals.userId || req.body.userId; // userId from auth middleware or body
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }
    if (user.emailVerified) {
      res.status(400).json({ message: 'Email already verified.' });
      return;
    }
    const emailVerificationLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?userId=${user._id}`;
    await sendEmail({
      to: user.email,
      subject: 'EcoFinds Email Verification',
      html: `<p>Hi ${user.name},</p><p>Click <a href="${emailVerificationLink}">here</a> to verify your email for EcoFinds.</p>`
    });
    res.json({ message: 'Verification email resent.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

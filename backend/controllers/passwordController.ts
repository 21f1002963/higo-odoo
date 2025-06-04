import { Request, Response } from 'express';
import User from '../models/User';
import { sendEmail } from '../lib/email';
import { sendSMS } from '../lib/sms';
import bcrypt from 'bcryptjs';

// Helper to generate OTP
function generateOTP(length = 6) {
  return Math.floor(100000 + Math.random() * 900000).toString().substring(0, length);
}

// 1. Request password reset (send OTP to email and phone if user exists)
export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required.' });
    const user = await User.findOne({ email });
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
    await sendEmail({
      to: user.email,
      subject: 'EcoFinds Password Reset OTP',
      html: `<p>Your OTP for password reset is: <b>${otp}</b></p>`
    });
    // Optionally, send OTP to phone as well
    if (user.phone) {
      await sendSMS({
        to: user.phone,
        message: `Your EcoFinds password reset OTP is: ${otp}`
      });
    }
    return res.json({ message: 'If an account exists for this email, an OTP has been sent.' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err });
  }
};

// 2. Reset password (verify OTP and set new password)
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const user = await User.findOne({ email });
    if (!user || !user.otp || !user.otpExpires) {
      return res.status(400).json({ message: 'Invalid request.' });
    }
    if (user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    return res.json({ message: 'Password reset successful.' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err });
  }
};

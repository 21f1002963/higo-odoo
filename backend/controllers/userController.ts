import { Request, Response } from 'express';
import User from '../models/User';
import Product from '../models/Product';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    const user = new User({
      username,
      email,
      password
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, username, email } });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('savedProducts');
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const updates = req.body;
    delete updates.password; // Prevent password update through this route

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    Object.assign(user, updates);
    await user.save();

    res.json({ message: 'Profile updated successfully', user });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getUserProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({ seller: req.params.userId })
      .populate('seller', 'username rating');
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserReviews = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('reviews')
      .populate('reviews.reviewer', 'username');
    res.json(user?.reviews || []);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addReview = async (req: Request, res: Response) => {
  try {
    const { rating, comment } = req.body;
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has already reviewed
    const existingReview = user.reviews.find(
      review => review.reviewer.toString() === req.user._id.toString()
    );

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this user' });
    }

    user.reviews.push({
      reviewer: req.user._id,
      rating,
      comment,
      timestamp: new Date()
    });

    // Update average rating
    const totalRating = user.reviews.reduce((sum, review) => sum + review.rating, 0);
    user.rating = totalRating / user.reviews.length;

    await user.save();
    res.json(user.reviews);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}; 
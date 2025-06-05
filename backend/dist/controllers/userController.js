"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addReview = exports.getUserReviews = exports.getUserProducts = exports.updateProfile = exports.getProfile = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const Product_1 = __importDefault(require("../models/Product"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User_1.default.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }
        const user = new User_1.default({
            username,
            email,
            password
        });
        await user.save();
        const token = jsonwebtoken_1.default.sign({ id: user._id }, config_1.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user: { id: user._id, username, email } });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, config_1.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.login = login;
const getProfile = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.user._id)
            .select('-password')
            .populate('savedProducts');
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res) => {
    try {
        const updates = req.body;
        delete updates.password; // Prevent password update through this route
        const user = await User_1.default.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        Object.assign(user, updates);
        await user.save();
        res.json({ message: 'Profile updated successfully', user });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.updateProfile = updateProfile;
const getUserProducts = async (req, res) => {
    try {
        const products = await Product_1.default.find({ seller: req.params.userId })
            .populate('seller', 'username rating');
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getUserProducts = getUserProducts;
const getUserReviews = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.params.userId)
            .select('reviews')
            .populate('reviews.reviewer', 'username');
        res.json((user === null || user === void 0 ? void 0 : user.reviews) || []);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getUserReviews = getUserReviews;
const addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const user = await User_1.default.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Check if user has already reviewed
        const existingReview = user.reviews.find(review => review.reviewer.toString() === req.user._id.toString());
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
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.addReview = addReview;

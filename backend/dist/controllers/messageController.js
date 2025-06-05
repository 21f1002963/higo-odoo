"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAsRead = exports.getMessages = exports.getConversations = exports.sendMessage = void 0;
const Message_1 = __importDefault(require("../models/Message"));
const Product_1 = __importDefault(require("../models/Product"));
const sendMessage = async (req, res) => {
    try {
        const { receiverId, productId, content } = req.body;
        // Verify product exists and is active
        const product = await Product_1.default.findById(productId);
        if (!product || product.status !== 'active') {
            return res.status(400).json({ message: 'Product not available' });
        }
        const message = new Message_1.default({
            sender: req.user._id,
            receiver: receiverId,
            product: productId,
            content
        });
        await message.save();
        res.status(201).json(message);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.sendMessage = sendMessage;
const getConversations = async (req, res) => {
    try {
        const messages = await Message_1.default.find({
            $or: [
                { sender: req.user._id },
                { receiver: req.user._id }
            ]
        })
            .sort({ createdAt: -1 })
            .populate('sender', 'username')
            .populate('receiver', 'username')
            .populate('product', 'title images');
        // Group messages by conversation (product + other user)
        const conversations = messages.reduce((acc, message) => {
            const otherUser = message.sender._id.toString() === req.user._id.toString()
                ? message.receiver
                : message.sender;
            const key = `${message.product._id}-${otherUser._id}`;
            if (!acc[key]) {
                acc[key] = {
                    product: message.product,
                    otherUser,
                    lastMessage: message,
                    unreadCount: 0
                };
            }
            if (!message.isRead && message.receiver._id.toString() === req.user._id.toString()) {
                acc[key].unreadCount++;
            }
            return acc;
        }, {});
        res.json(Object.values(conversations));
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getConversations = getConversations;
const getMessages = async (req, res) => {
    try {
        const { productId, userId } = req.params;
        const messages = await Message_1.default.find({
            product: productId,
            $or: [
                { sender: req.user._id, receiver: userId },
                { sender: userId, receiver: req.user._id }
            ]
        })
            .sort({ createdAt: 1 })
            .populate('sender', 'username')
            .populate('receiver', 'username');
        // Mark messages as read
        await Message_1.default.updateMany({
            product: productId,
            sender: userId,
            receiver: req.user._id,
            isRead: false
        }, { isRead: true });
        res.json(messages);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getMessages = getMessages;
const markAsRead = async (req, res) => {
    try {
        const { messageId } = req.params;
        const message = await Message_1.default.findById(messageId);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }
        if (message.receiver.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        message.isRead = true;
        await message.save();
        res.json(message);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.markAsRead = markAsRead;

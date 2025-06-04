import { Request, Response } from 'express';
import Message from '../models/Message';
import Product from '../models/Product';

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { receiverId, productId, content } = req.body;

    // Verify product exists and is active
    const product = await Product.findById(productId);
    if (!product || product.status !== 'active') {
      return res.status(400).json({ message: 'Product not available' });
    }

    const message = new Message({
      sender: req.user._id,
      receiver: receiverId,
      product: productId,
      content
    });

    await message.save();
    res.status(201).json(message);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getConversations = async (req: Request, res: Response) => {
  try {
    const messages = await Message.find({
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
    const conversations = messages.reduce((acc: any, message) => {
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
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { productId, userId } = req.params;

    const messages = await Message.find({
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
    await Message.updateMany(
      {
        product: productId,
        sender: userId,
        receiver: req.user._id,
        isRead: false
      },
      { isRead: true }
    );

    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    message.isRead = true;
    await message.save();

    res.json(message);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}; 
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveProduct = exports.placeBid = exports.deleteProduct = exports.updateProduct = exports.getProduct = exports.getProducts = exports.createProduct = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const createProduct = async (req, res) => {
    try {
        const product = new Product_1.default({
            ...req.body,
            seller: req.user._id
        });
        await product.save();
        res.status(201).json(product);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.createProduct = createProduct;
const getProducts = async (req, res) => {
    try {
        const { category, minPrice, maxPrice, condition, search, sort, page = 1, limit = 10, location, radius } = req.query;
        const query = { status: 'active' };
        if (category)
            query.category = category;
        if (condition)
            query.condition = condition;
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice)
                query.price.$gte = Number(minPrice);
            if (maxPrice)
                query.price.$lte = Number(maxPrice);
        }
        if (search) {
            query.$text = { $search: search };
        }
        if (location && radius) {
            const [lng, lat] = location.split(',').map(Number);
            query.location = {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [lng, lat]
                    },
                    $maxDistance: Number(radius) * 1000 // Convert km to meters
                }
            };
        }
        const sortOptions = {};
        if (sort === 'price_asc')
            sortOptions.price = 1;
        else if (sort === 'price_desc')
            sortOptions.price = -1;
        else if (sort === 'newest')
            sortOptions.createdAt = -1;
        else
            sortOptions.createdAt = -1;
        const products = await Product_1.default.find(query)
            .sort(sortOptions)
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))
            .populate('seller', 'username rating');
        const total = await Product_1.default.countDocuments(query);
        res.json({
            products,
            totalPages: Math.ceil(total / Number(limit)),
            currentPage: Number(page)
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getProducts = getProducts;
const getProduct = async (req, res) => {
    try {
        const product = await Product_1.default.findById(req.params.id)
            .populate('seller', 'username rating')
            .populate('auctionDetails.currentBidder', 'username');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // Increment view count
        product.views += 1;
        await product.save();
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getProduct = getProduct;
const updateProduct = async (req, res) => {
    try {
        const product = await Product_1.default.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (product.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        Object.assign(product, req.body);
        await product.save();
        res.json(product);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const product = await Product_1.default.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (product.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        await product.remove();
        res.json({ message: 'Product deleted' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteProduct = deleteProduct;
const placeBid = async (req, res) => {
    try {
        const { amount } = req.body;
        const product = await Product_1.default.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (!product.isAuction) {
            return res.status(400).json({ message: 'This product is not an auction' });
        }
        if (product.seller.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'You cannot bid on your own product' });
        }
        if (product.status !== 'active') {
            return res.status(400).json({ message: 'Auction has ended' });
        }
        if (new Date() > product.auctionDetails.endTime) {
            product.status = 'inactive';
            await product.save();
            return res.status(400).json({ message: 'Auction has ended' });
        }
        if (amount <= (product.auctionDetails.currentBid || product.auctionDetails.minimumBid)) {
            return res.status(400).json({ message: 'Bid must be higher than current bid' });
        }
        product.auctionDetails.bids.push({
            bidder: req.user._id,
            amount,
            timestamp: new Date()
        });
        product.auctionDetails.currentBid = amount;
        product.auctionDetails.currentBidder = req.user._id;
        await product.save();
        res.json(product);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.placeBid = placeBid;
const saveProduct = async (req, res) => {
    try {
        const product = await Product_1.default.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const user = req.user;
        const index = user.savedProducts.indexOf(product._id);
        if (index === -1) {
            user.savedProducts.push(product._id);
        }
        else {
            user.savedProducts.splice(index, 1);
        }
        await user.save();
        res.json({ saved: index === -1 });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.saveProduct = saveProduct;

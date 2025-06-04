import { Request, Response } from 'express';
import Product, { IProduct } from '../models/Product';
import { isValidObjectId } from 'mongoose';

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = new Product({
      ...req.body,
      seller: req.user._id
    });
    await product.save();
    res.status(201).json(product);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      condition,
      search,
      sort,
      page = 1,
      limit = 10,
      location,
      radius
    } = req.query;

    const query: any = { status: 'active' };

    if (category) query.category = category;
    if (condition) query.condition = condition;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.$text = { $search: search as string };
    }

    if (location && radius) {
      const [lng, lat] = (location as string).split(',').map(Number);
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

    const sortOptions: any = {};
    if (sort === 'price_asc') sortOptions.price = 1;
    else if (sort === 'price_desc') sortOptions.price = -1;
    else if (sort === 'newest') sortOptions.createdAt = -1;
    else sortOptions.createdAt = -1;

    const products = await Product.find(query)
      .sort(sortOptions)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate('seller', 'username rating');

    const total = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page)
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'username rating')
      .populate('auctionDetails.currentBidder', 'username');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Increment view count
    product.views += 1;
    await product.save();

    res.json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(product, req.body);
    await product.save();
    res.json(product);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await product.remove();
    res.json({ message: 'Product deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const placeBid = async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;
    const product = await Product.findById(req.params.id);

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

    if (new Date() > product.auctionDetails!.endTime) {
      product.status = 'inactive';
      await product.save();
      return res.status(400).json({ message: 'Auction has ended' });
    }

    if (amount <= (product.auctionDetails!.currentBid || product.auctionDetails!.minimumBid)) {
      return res.status(400).json({ message: 'Bid must be higher than current bid' });
    }

    product.auctionDetails!.bids.push({
      bidder: req.user._id,
      amount,
      timestamp: new Date()
    });

    product.auctionDetails!.currentBid = amount;
    product.auctionDetails!.currentBidder = req.user._id;

    await product.save();
    res.json(product);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const saveProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const user = req.user;
    const index = user.savedProducts.indexOf(product._id);

    if (index === -1) {
      user.savedProducts.push(product._id);
    } else {
      user.savedProducts.splice(index, 1);
    }

    await user.save();
    res.json({ saved: index === -1 });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}; 
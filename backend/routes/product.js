const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all products with filters
router.get('/', async (req, res) => {
  try {
    const {
      category,
      condition,
      minPrice,
      maxPrice,
      location,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20
    } = req.query;

    // Build filter object
    const filter = { status: 'active' };

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (condition) {
      filter.condition = condition;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('seller.id', 'name rating reviews');

    // Get total count for pagination
    const total = await Product.countDocuments(filter);

    res.json({
      products,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        hasNext: skip + products.length < total,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller.id', 'name rating reviews')
      .populate('reviews.user', 'name');

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Increment view count
    product.views += 1;
    await product.save();

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new product
router.post('/', async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      price,
      originalPrice,
      condition,
      location,
      photos,
      tags
    } = req.body;

    // TODO: Get seller info from authenticated user
    const seller = {
      id: req.body.sellerId || '507f1f77bcf86cd799439011', // Mock user ID
      name: req.body.sellerName || 'Test Seller',
      phone: req.body.sellerPhone || '+44 7911 123456',
      email: req.body.sellerEmail || 'seller@example.com',
      rating: 0,
      reviews: 0
    };

    const product = new Product({
      title,
      category,
      description,
      price,
      originalPrice,
      condition,
      location,
      seller,
      photos: photos || ['🧱'], // Default emoji if no photos
      tags: tags || []
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // TODO: Check if user is the seller
    // if (product.seller.id.toString() !== req.user.id) {
    //   return res.status(403).json({ error: 'Not authorized' });
    // }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // TODO: Check if user is the seller
    // if (product.seller.id.toString() !== req.user.id) {
    //   return res.status(403).json({ error: 'Not authorized' });
    // }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add review to product
router.post('/:id/reviews', async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // TODO: Get user ID from authenticated user
    const userId = req.body.userId || '507f1f77bcf86cd799439011';

    // Check if user already reviewed this product
    const existingReview = product.reviews.find(review => 
      review.user.toString() === userId
    );

    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this product' });
    }

    // Add review
    product.reviews.push({
      user: userId,
      rating,
      comment
    });

    // Calculate new average rating
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    product.rating = totalRating / product.reviews.length;

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Toggle favorite status
router.post('/:id/favorite', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // TODO: Get user ID from authenticated user
    const userId = req.body.userId || '507f1f77bcf86cd799439011';

    const isFavorited = product.favorites.includes(userId);

    if (isFavorited) {
      product.favorites = product.favorites.filter(id => id.toString() !== userId);
    } else {
      product.favorites.push(userId);
    }

    await product.save();
    res.json({ 
      isFavorited: !isFavorited,
      favoritesCount: product.favorites.length 
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get user's favorite products
router.get('/user/favorites', async (req, res) => {
  try {
    // TODO: Get user ID from authenticated user
    const userId = req.query.userId || '507f1f77bcf86cd799439011';

    const products = await Product.find({
      favorites: userId,
      status: 'active'
    }).populate('seller.id', 'name rating reviews');

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's products
router.get('/user/products', async (req, res) => {
  try {
    // TODO: Get user ID from authenticated user
    const userId = req.query.userId || '507f1f77bcf86cd799439011';

    const products = await Product.find({
      'seller.id': userId
    }).populate('seller.id', 'name rating reviews');

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 
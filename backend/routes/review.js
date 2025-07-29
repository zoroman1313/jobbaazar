const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');

// Get all reviews with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      reviewedUser,
      reviewer,
      product,
      rating,
      status = 'approved',
      reviewType,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { status };
    
    if (reviewedUser) filter.reviewedUser = reviewedUser;
    if (reviewer) filter.reviewer = reviewer;
    if (product) filter.product = product;
    if (rating) filter.rating = parseInt(rating);
    if (reviewType) filter.reviewType = reviewType;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await Review.find(filter)
      .populate('reviewer', 'name avatar')
      .populate('reviewedUser', 'name avatar')
      .populate('product', 'title photos')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Review.countDocuments(filter);

    res.json({
      reviews,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        hasNext: skip + reviews.length < total,
        hasPrev: parseInt(page) > 1,
        totalItems: total
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single review by ID
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('reviewer', 'name avatar rating totalReviews')
      .populate('reviewedUser', 'name avatar rating totalReviews')
      .populate('product', 'title photos price')
      .populate('replies.user', 'name avatar')
      .populate('helpful.user', 'name')
      .populate('notHelpful.user', 'name');

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new review
router.post('/', async (req, res) => {
  try {
    const {
      reviewedUser,
      product,
      job,
      rating,
      title,
      content,
      categoryRatings,
      reviewType,
      photos,
      videos,
      userId
    } = req.body;

    // Validate required fields
    if (!reviewedUser || !rating || !title || !content || !reviewType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user has already reviewed this user/product
    const existingReview = await Review.findOne({
      reviewer: userId || '507f1f77bcf86cd799439011',
      reviewedUser,
      product,
      status: { $ne: 'rejected' }
    });

    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this user/product' });
    }

    // Create new review
    const review = new Review({
      reviewer: userId || '507f1f77bcf86cd799439011',
      reviewedUser,
      product,
      job,
      rating: parseInt(rating),
      title,
      content,
      categoryRatings,
      reviewType,
      photos: photos || [],
      videos: videos || [],
      status: 'approved' // Auto-approve for now, can be changed to 'pending' for moderation
    });

    await review.save();

    // Update product rating if applicable
    if (product) {
      const productReviews = await Review.find({ 
        product, 
        status: 'approved' 
      });
      
      const averageRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
      
      await Product.findByIdAndUpdate(product, {
        rating: Math.round(averageRating * 10) / 10,
        'reviews.count': productReviews.length
      });
    }

    // Populate and return the review
    const populatedReview = await Review.findById(review._id)
      .populate('reviewer', 'name avatar')
      .populate('reviewedUser', 'name avatar')
      .populate('product', 'title photos');

    res.status(201).json(populatedReview);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update review
router.put('/:id', async (req, res) => {
  try {
    const {
      rating,
      title,
      content,
      categoryRatings,
      photos,
      videos,
      userId
    } = req.body;

    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Check if user is the reviewer
    if (review.reviewer.toString() !== (userId || '507f1f77bcf86cd799439011')) {
      return res.status(403).json({ error: 'You can only edit your own reviews' });
    }

    // Update fields
    if (rating !== undefined) review.rating = parseInt(rating);
    if (title) review.title = title;
    if (content) review.content = content;
    if (categoryRatings) review.categoryRatings = categoryRatings;
    if (photos) review.photos = photos;
    if (videos) review.videos = videos;

    await review.save();

    // Update product rating if applicable
    if (review.product) {
      const productReviews = await Review.find({ 
        product: review.product, 
        status: 'approved' 
      });
      
      const averageRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
      
      await Product.findByIdAndUpdate(review.product, {
        rating: Math.round(averageRating * 10) / 10,
        'reviews.count': productReviews.length
      });
    }

    const updatedReview = await Review.findById(review._id)
      .populate('reviewer', 'name avatar')
      .populate('reviewedUser', 'name avatar')
      .populate('product', 'title photos');

    res.json(updatedReview);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete review (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const { userId } = req.body;

    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Check if user is the reviewer or admin
    if (review.reviewer.toString() !== (userId || '507f1f77bcf86cd799439011')) {
      return res.status(403).json({ error: 'You can only delete your own reviews' });
    }

    review.deletedAt = new Date();
    review.status = 'hidden';
    await review.save();

    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Vote on review (helpful/not helpful)
router.post('/:id/vote', async (req, res) => {
  try {
    const { voteType, userId } = req.body;

    if (!['helpful', 'notHelpful'].includes(voteType)) {
      return res.status(400).json({ error: 'Invalid vote type' });
    }

    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    await review.addVote(userId || '507f1f77bcf86cd799439011', voteType);

    res.json({
      message: 'Vote recorded successfully',
      helpfulCount: review.helpfulCount,
      notHelpfulCount: review.notHelpfulCount
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Report review
router.post('/:id/report', async (req, res) => {
  try {
    const { reason, description, userId } = req.body;

    if (!['spam', 'inappropriate', 'fake', 'harassment', 'other'].includes(reason)) {
      return res.status(400).json({ error: 'Invalid report reason' });
    }

    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    await review.addReport(userId || '507f1f77bcf86cd799439011', reason, description);

    res.json({ message: 'Review reported successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add reply to review
router.post('/:id/reply', async (req, res) => {
  try {
    const { content, userId } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Reply content is required' });
    }

    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Check if user is the reviewed user or admin
    if (review.reviewedUser.toString() !== (userId || '507f1f77bcf86cd799439011')) {
      return res.status(403).json({ error: 'You can only reply to reviews about you' });
    }

    review.replies.push({
      user: userId || '507f1f77bcf86cd799439011',
      content: content.trim()
    });

    await review.save();

    const updatedReview = await Review.findById(review._id)
      .populate('replies.user', 'name avatar');

    res.json(updatedReview.replies[updatedReview.replies.length - 1]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get user's review statistics
router.get('/user/:userId/stats', async (req, res) => {
  try {
    const { userId } = req.params;

    const reviews = await Review.find({
      reviewedUser: userId,
      status: 'approved'
    });

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? Math.round(reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews * 10) / 10 
      : 0;

    const ratingDistribution = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length
    };

    const categoryStats = {
      communication: reviews.filter(r => r.categoryRatings?.communication).length > 0 
        ? Math.round(reviews.reduce((sum, r) => sum + (r.categoryRatings?.communication || 0), 0) / reviews.filter(r => r.categoryRatings?.communication).length * 10) / 10 
        : 0,
      quality: reviews.filter(r => r.categoryRatings?.quality).length > 0 
        ? Math.round(reviews.reduce((sum, r) => sum + (r.categoryRatings?.quality || 0), 0) / reviews.filter(r => r.categoryRatings?.quality).length * 10) / 10 
        : 0,
      timeliness: reviews.filter(r => r.categoryRatings?.timeliness).length > 0 
        ? Math.round(reviews.reduce((sum, r) => sum + (r.categoryRatings?.timeliness || 0), 0) / reviews.filter(r => r.categoryRatings?.timeliness).length * 10) / 10 
        : 0,
      professionalism: reviews.filter(r => r.categoryRatings?.professionalism).length > 0 
        ? Math.round(reviews.reduce((sum, r) => sum + (r.categoryRatings?.professionalism || 0), 0) / reviews.filter(r => r.categoryRatings?.professionalism).length * 10) / 10 
        : 0,
      value: reviews.filter(r => r.categoryRatings?.value).length > 0 
        ? Math.round(reviews.reduce((sum, r) => sum + (r.categoryRatings?.value || 0), 0) / reviews.filter(r => r.categoryRatings?.value).length * 10) / 10 
        : 0
    };

    res.json({
      totalReviews,
      averageRating,
      ratingDistribution,
      categoryStats
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get reviews by user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20, type = 'received' } = req.query;

    const filter = { status: 'approved' };
    
    if (type === 'received') {
      filter.reviewedUser = userId;
    } else if (type === 'given') {
      filter.reviewer = userId;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await Review.find(filter)
      .populate('reviewer', 'name avatar')
      .populate('reviewedUser', 'name avatar')
      .populate('product', 'title photos')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Review.countDocuments(filter);

    res.json({
      reviews,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        hasNext: skip + reviews.length < total,
        hasPrev: parseInt(page) > 1,
        totalItems: total
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Moderation endpoints (for admin use)
router.put('/:id/moderate', async (req, res) => {
  try {
    const { status, moderationNotes, userId } = req.body;

    if (!['pending', 'approved', 'rejected', 'flagged', 'hidden'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // TODO: Check if user is admin
    // if (!isAdmin(userId)) {
    //   return res.status(403).json({ error: 'Admin access required' });
    // }

    review.status = status;
    if (moderationNotes) review.moderationNotes = moderationNotes;

    await review.save();

    res.json({ message: 'Review moderated successfully', status: review.status });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get reported reviews (for admin use)
router.get('/reports/pending', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const filter = { 'reports.status': 'pending' };
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await Review.find(filter)
      .populate('reviewer', 'name avatar')
      .populate('reviewedUser', 'name avatar')
      .populate('reports.reporter', 'name')
      .sort({ 'reports.reportedAt': -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Review.countDocuments(filter);

    res.json({
      reviews,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        hasNext: skip + reviews.length < total,
        hasPrev: parseInt(page) > 1,
        totalItems: total
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 
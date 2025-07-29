const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  // Basic review info
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  },
  
  // Rating details
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    validate: {
      validator: Number.isInteger,
      message: 'Rating must be a whole number'
    }
  },
  
  // Review content
  title: {
    type: String,
    required: true,
    maxlength: 100,
    trim: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000,
    trim: true
  },
  
  // Media attachments
  photos: [{
    url: {
      type: String,
      required: true
    },
    caption: {
      type: String,
      maxlength: 200
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  videos: [{
    url: {
      type: String,
      required: true
    },
    thumbnail: String,
    duration: Number, // in seconds
    caption: {
      type: String,
      maxlength: 200
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Category ratings (for detailed feedback)
  categoryRatings: {
    communication: {
      type: Number,
      min: 1,
      max: 5
    },
    quality: {
      type: Number,
      min: 1,
      max: 5
    },
    timeliness: {
      type: Number,
      min: 1,
      max: 5
    },
    professionalism: {
      type: Number,
      min: 1,
      max: 5
    },
    value: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  
  // Review metadata
  reviewType: {
    type: String,
    required: true,
    enum: ['buyer_to_seller', 'seller_to_buyer', 'worker_to_employer', 'employer_to_worker', 'general']
  },
  
  // Moderation and status
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'approved', 'rejected', 'flagged', 'hidden']
  },
  
  moderationNotes: {
    type: String,
    maxlength: 500
  },
  
  // Engagement metrics
  helpful: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    votedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  notHelpful: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    votedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Reports
  reports: [{
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    reason: {
      type: String,
      required: true,
      enum: ['spam', 'inappropriate', 'fake', 'harassment', 'other']
    },
    description: {
      type: String,
      maxlength: 500
    },
    reportedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      default: 'pending',
      enum: ['pending', 'investigating', 'resolved', 'dismissed']
    }
  }],
  
  // Replies
  replies: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: 500
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Verification
  verified: {
    type: Boolean,
    default: false
  },
  
  verifiedPurchase: {
    type: Boolean,
    default: false
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  // Soft delete
  deletedAt: {
    type: Date
  }
});

// Update timestamps
ReviewSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate average category rating
ReviewSchema.virtual('averageCategoryRating').get(function() {
  if (!this.categoryRatings) return this.rating;
  
  const ratings = Object.values(this.categoryRatings).filter(r => r !== undefined);
  if (ratings.length === 0) return this.rating;
  
  return Math.round(ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length);
});

// Get helpful count
ReviewSchema.virtual('helpfulCount').get(function() {
  return this.helpful ? this.helpful.length : 0;
});

// Get not helpful count
ReviewSchema.virtual('notHelpfulCount').get(function() {
  return this.notHelpful ? this.notHelpful.length : 0;
});

// Get reports count
ReviewSchema.virtual('reportsCount').get(function() {
  return this.reports ? this.reports.length : 0;
});

// Check if user has already voted
ReviewSchema.methods.hasUserVoted = function(userId) {
  const helpfulVote = this.helpful.find(vote => vote.user.toString() === userId.toString());
  const notHelpfulVote = this.notHelpful.find(vote => vote.user.toString() === userId.toString());
  return {
    hasVoted: !!(helpfulVote || notHelpfulVote),
    voteType: helpfulVote ? 'helpful' : notHelpfulVote ? 'notHelpful' : null
  };
};

// Check if user has already reported
ReviewSchema.methods.hasUserReported = function(userId) {
  return this.reports.some(report => report.reporter.toString() === userId.toString());
};

// Add vote
ReviewSchema.methods.addVote = function(userId, voteType) {
  const existingVote = this.hasUserVoted(userId);
  
  if (existingVote.hasVoted) {
    // Remove existing vote
    this.helpful = this.helpful.filter(vote => vote.user.toString() !== userId.toString());
    this.notHelpful = this.notHelpful.filter(vote => vote.user.toString() !== userId.toString());
  }
  
  // Add new vote
  if (voteType === 'helpful') {
    this.helpful.push({ user: userId });
  } else if (voteType === 'notHelpful') {
    this.notHelpful.push({ user: userId });
  }
  
  return this.save();
};

// Add report
ReviewSchema.methods.addReport = function(userId, reason, description) {
  if (this.hasUserReported(userId)) {
    throw new Error('User has already reported this review');
  }
  
  this.reports.push({
    reporter: userId,
    reason,
    description
  });
  
  return this.save();
};

// Create indexes for better performance
ReviewSchema.index({ reviewer: 1, createdAt: -1 });
ReviewSchema.index({ reviewedUser: 1, createdAt: -1 });
ReviewSchema.index({ product: 1, createdAt: -1 });
ReviewSchema.index({ rating: 1 });
ReviewSchema.index({ status: 1 });
ReviewSchema.index({ reviewType: 1 });
ReviewSchema.index({ verified: 1 });
ReviewSchema.index({ 'reports.status': 1 });

// Ensure virtuals are included in JSON output
ReviewSchema.set('toJSON', { virtuals: true });
ReviewSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Review', ReviewSchema); 
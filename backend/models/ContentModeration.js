const mongoose = require('mongoose');

const ContentModerationSchema = new mongoose.Schema({
  contentType: {
    type: String,
    enum: ['job', 'product', 'review', 'message', 'user_profile'],
    required: true
  },
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  contentRef: {
    type: String,
    enum: ['Worker', 'Product', 'Review', 'Message', 'Admin'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'flagged', 'under_review'],
    default: 'pending'
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
  },
  moderationDate: {
    type: Date,
    default: null
  },
  reason: {
    type: String,
    enum: [
      'inappropriate_content',
      'spam',
      'fake_information',
      'duplicate_content',
      'violation_of_terms',
      'safety_concern',
      'quality_issue',
      'other'
    ],
    default: null
  },
  details: {
    type: String,
    maxlength: 1000,
    default: null
  },
  flags: [{
    flaggedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    flagType: {
      type: String,
      enum: [
        'inappropriate',
        'spam',
        'fake',
        'offensive',
        'dangerous',
        'copyright',
        'other'
      ],
      required: true
    },
    description: {
      type: String,
      maxlength: 500
    },
    evidence: [{
      type: String,
      description: String,
      url: String
    }],
    createdAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
      default: 'pending'
    }
  }],
  autoModeration: {
    enabled: {
      type: Boolean,
      default: true
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    factors: [{
      factor: String,
      score: Number,
      weight: Number
    }],
    action: {
      type: String,
      enum: ['approve', 'flag', 'reject', 'manual_review'],
      default: 'manual_review'
    }
  },
  history: [{
    action: {
      type: String,
      enum: ['submitted', 'approved', 'rejected', 'flagged', 'reviewed', 'appealed'],
      required: true
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null
    },
    reason: String,
    details: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  appeal: {
    submitted: {
      type: Boolean,
      default: false
    },
    submittedAt: {
      type: Date,
      default: null
    },
    reason: {
      type: String,
      maxlength: 1000
    },
    evidence: [{
      type: String,
      description: String,
      url: String
    }],
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null
    },
    reviewedAt: {
      type: Date,
      default: null
    },
    outcome: {
      type: String,
      enum: ['upheld', 'overturned', 'pending'],
      default: 'pending'
    }
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  tags: [{
    type: String,
    enum: [
      'urgent',
      'sensitive',
      'bulk',
      'repeat_offender',
      'verified_user',
      'new_user',
      'high_value'
    ]
  }],
  metadata: {
    originalContent: mongoose.Schema.Types.Mixed,
    moderationNotes: String,
    externalReferences: [String],
    relatedContent: [{
      contentType: String,
      contentId: mongoose.Schema.Types.ObjectId
    }]
  }
}, {
  timestamps: true
});

// Indexes for performance
ContentModerationSchema.index({ contentType: 1, contentId: 1 });
ContentModerationSchema.index({ status: 1 });
ContentModerationSchema.index({ submittedBy: 1 });
ContentModerationSchema.index({ moderatedBy: 1 });
ContentModerationSchema.index({ priority: 1 });
ContentModerationSchema.index({ createdAt: -1 });
ContentModerationSchema.index({ 'flags.status': 1 });
ContentModerationSchema.index({ 'appeal.submitted': 1 });

// Virtual for flag count
ContentModerationSchema.virtual('flagCount').get(function() {
  return this.flags.length;
});

// Virtual for pending flags
ContentModerationSchema.virtual('pendingFlags').get(function() {
  return this.flags.filter(flag => flag.status === 'pending').length;
});

// Pre-save middleware to update history
ContentModerationSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status !== 'pending') {
    this.history.push({
      action: this.status === 'approved' ? 'approved' : 'rejected',
      performedBy: this.moderatedBy,
      reason: this.reason,
      details: this.details,
      timestamp: new Date()
    });
  }
  next();
});

// Instance method to add flag
ContentModerationSchema.methods.addFlag = function(flagData) {
  this.flags.push(flagData);
  this.status = 'flagged';
  return this.save();
};

// Instance method to approve content
ContentModerationSchema.methods.approve = function(adminId, reason = null, details = null) {
  this.status = 'approved';
  this.moderatedBy = adminId;
  this.moderationDate = new Date();
  this.reason = reason;
  this.details = details;
  return this.save();
};

// Instance method to reject content
ContentModerationSchema.methods.reject = function(adminId, reason, details = null) {
  this.status = 'rejected';
  this.moderatedBy = adminId;
  this.moderationDate = new Date();
  this.reason = reason;
  this.details = details;
  return this.save();
};

// Instance method to submit appeal
ContentModerationSchema.methods.submitAppeal = function(reason, evidence = []) {
  this.appeal.submitted = true;
  this.appeal.submittedAt = new Date();
  this.appeal.reason = reason;
  this.appeal.evidence = evidence;
  this.appeal.outcome = 'pending';
  return this.save();
};

// Instance method to review appeal
ContentModerationSchema.methods.reviewAppeal = function(adminId, outcome, notes = null) {
  this.appeal.reviewedBy = adminId;
  this.appeal.reviewedAt = new Date();
  this.appeal.outcome = outcome;
  if (notes) {
    this.metadata.moderationNotes = notes;
  }
  return this.save();
};

// Static method to get pending content
ContentModerationSchema.statics.getPending = function(contentType = null, limit = 50) {
  const query = { status: 'pending' };
  if (contentType) {
    query.contentType = contentType;
  }
  
  return this.find(query)
    .sort({ priority: -1, createdAt: 1 })
    .limit(limit)
    .populate('submittedBy', 'name email')
    .populate('moderatedBy', 'firstName lastName');
};

// Static method to get flagged content
ContentModerationSchema.statics.getFlagged = function(limit = 50) {
  return this.find({ 'flags.status': 'pending' })
    .sort({ 'flags.length': -1, createdAt: 1 })
    .limit(limit)
    .populate('submittedBy', 'name email')
    .populate('flags.flaggedBy', 'name email');
};

// Static method to get content by status
ContentModerationSchema.statics.getByStatus = function(status, contentType = null) {
  const query = { status };
  if (contentType) {
    query.contentType = contentType;
  }
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .populate('submittedBy', 'name email')
    .populate('moderatedBy', 'firstName lastName');
};

// Static method to get moderation stats
ContentModerationSchema.statics.getStats = function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: {
          contentType: '$contentType',
          status: '$status'
        },
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: '$_id.contentType',
        statuses: {
          $push: {
            status: '$_id.status',
            count: '$count'
          }
        },
        total: { $sum: '$count' }
      }
    }
  ]);
};

// Static method to create moderation record
ContentModerationSchema.statics.createModeration = async function(contentData) {
  const moderation = new this(contentData);
  await moderation.save();
  return moderation;
};

const ContentModeration = mongoose.model('ContentModeration', ContentModerationSchema);

module.exports = ContentModeration; 
const mongoose = require('mongoose');

// Analytics Event Schema
const AnalyticsEventSchema = new mongoose.Schema({
  eventType: {
    type: String,
    required: true,
    enum: [
      'page_view',
      'user_register',
      'user_login',
      'job_post',
      'job_apply',
      'product_view',
      'product_purchase',
      'wallet_transaction',
      'review_post',
      'message_sent',
      'notification_sent',
      'search_performed',
      'filter_applied',
      'favorite_added',
      'contact_made'
    ]
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  sessionId: {
    type: String,
    required: true
  },
  page: {
    type: String,
    required: false
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  userAgent: {
    type: String,
    required: false
  },
  ipAddress: {
    type: String,
    required: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Platform Statistics Schema
const PlatformStatsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true
  },
  users: {
    total: { type: Number, default: 0 },
    new: { type: Number, default: 0 },
    active: { type: Number, default: 0 },
    workers: { type: Number, default: 0 },
    employers: { type: Number, default: 0 }
  },
  jobs: {
    total: { type: Number, default: 0 },
    posted: { type: Number, default: 0 },
    completed: { type: Number, default: 0 },
    active: { type: Number, default: 0 },
    byCategory: { type: Map, of: Number, default: new Map() }
  },
  marketplace: {
    products: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    byCategory: { type: Map, of: Number, default: new Map() }
  },
  wallet: {
    transactions: { type: Number, default: 0 },
    volume: { type: Number, default: 0 },
    deposits: { type: Number, default: 0 },
    withdrawals: { type: Number, default: 0 }
  },
  reviews: {
    total: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    byCategory: { type: Map, of: Number, default: new Map() }
  },
  engagement: {
    pageViews: { type: Number, default: 0 },
    searches: { type: Number, default: 0 },
    messages: { type: Number, default: 0 },
    notifications: { type: Number, default: 0 }
  }
});

// User Analytics Schema
const UserAnalyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  profile: {
    views: { type: Number, default: 0 },
    contacts: { type: Number, default: 0 },
    favorites: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now }
  },
  jobs: {
    posted: { type: Number, default: 0 },
    applied: { type: Number, default: 0 },
    completed: { type: Number, default: 0 },
    earnings: { type: Number, default: 0 }
  },
  marketplace: {
    products: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    purchased: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 }
  },
  wallet: {
    balance: { type: Number, default: 0 },
    transactions: { type: Number, default: 0 },
    totalDeposits: { type: Number, default: 0 },
    totalWithdrawals: { type: Number, default: 0 }
  },
  reviews: {
    given: { type: Number, default: 0 },
    received: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 }
  },
  activity: {
    loginCount: { type: Number, default: 0 },
    lastLogin: { type: Date, default: Date.now },
    sessionDuration: { type: Number, default: 0 },
    pagesVisited: { type: Number, default: 0 }
  }
});

// Search Analytics Schema
const SearchAnalyticsSchema = new mongoose.Schema({
  query: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    default: 1
  },
  results: {
    type: Number,
    default: 0
  },
  filters: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: new Map()
  },
  category: {
    type: String,
    enum: ['jobs', 'workers', 'products'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for performance
AnalyticsEventSchema.index({ eventType: 1, timestamp: -1 });
AnalyticsEventSchema.index({ userId: 1, timestamp: -1 });
AnalyticsEventSchema.index({ sessionId: 1, timestamp: -1 });

PlatformStatsSchema.index({ date: -1 });
PlatformStatsSchema.index({ 'users.total': -1 });
PlatformStatsSchema.index({ 'jobs.total': -1 });

UserAnalyticsSchema.index({ userId: 1 });
UserAnalyticsSchema.index({ 'profile.lastActive': -1 });
UserAnalyticsSchema.index({ 'jobs.earnings': -1 });
UserAnalyticsSchema.index({ 'marketplace.revenue': -1 });

SearchAnalyticsSchema.index({ query: 1, category: 1 });
SearchAnalyticsSchema.index({ count: -1 });
SearchAnalyticsSchema.index({ timestamp: -1 });

// Static methods for AnalyticsEvent
AnalyticsEventSchema.statics.trackEvent = function(eventData) {
  return this.create(eventData);
};

AnalyticsEventSchema.statics.getEventStats = function(startDate, endDate, eventType) {
  const match = {
    timestamp: { $gte: startDate, $lte: endDate }
  };
  
  if (eventType) {
    match.eventType = eventType;
  }
  
  return this.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          eventType: "$eventType"
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id.date": 1 } }
  ]);
};

// Static methods for PlatformStats
PlatformStatsSchema.statics.updateDailyStats = function(date, stats) {
  return this.findOneAndUpdate(
    { date: date },
    { $set: stats },
    { upsert: true, new: true }
  );
};

PlatformStatsSchema.statics.getStatsRange = function(startDate, endDate) {
  return this.find({
    date: { $gte: startDate, $lte: endDate }
  }).sort({ date: 1 });
};

// Static methods for UserAnalytics
UserAnalyticsSchema.statics.updateUserStats = function(userId, updates) {
  return this.findOneAndUpdate(
    { userId: userId },
    { $set: updates },
    { upsert: true, new: true }
  );
};

UserAnalyticsSchema.statics.getTopUsers = function(category, limit = 10) {
  const sortField = {};
  sortField[category] = -1;
  
  return this.find().sort(sortField).limit(limit);
};

// Static methods for SearchAnalytics
SearchAnalyticsSchema.statics.trackSearch = function(searchData) {
  return this.findOneAndUpdate(
    { 
      query: searchData.query, 
      category: searchData.category 
    },
    { 
      $inc: { count: 1 },
      $set: { 
        results: searchData.results,
        filters: searchData.filters,
        timestamp: new Date()
      }
    },
    { upsert: true, new: true }
  );
};

SearchAnalyticsSchema.statics.getPopularSearches = function(category, limit = 10) {
  return this.find({ category: category })
    .sort({ count: -1 })
    .limit(limit);
};

const AnalyticsEvent = mongoose.model('AnalyticsEvent', AnalyticsEventSchema);
const PlatformStats = mongoose.model('PlatformStats', PlatformStatsSchema);
const UserAnalytics = mongoose.model('UserAnalytics', UserAnalyticsSchema);
const SearchAnalytics = mongoose.model('SearchAnalytics', SearchAnalyticsSchema);

module.exports = {
  AnalyticsEvent,
  PlatformStats,
  UserAnalytics,
  SearchAnalytics
}; 
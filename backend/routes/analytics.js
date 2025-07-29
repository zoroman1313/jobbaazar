const express = require('express');
const router = express.Router();
const { 
  AnalyticsEvent, 
  PlatformStats, 
  UserAnalytics, 
  SearchAnalytics 
} = require('../models/Analytics');

// Mock user ID for testing
const mockUserId = '507f1f77bcf86cd799439011';

// Track analytics event
router.post('/track', async (req, res) => {
  try {
    const { eventType, page, data, sessionId, userAgent, ipAddress } = req.body;
    
    const eventData = {
      eventType,
      userId: mockUserId, // In real app, get from auth middleware
      sessionId: sessionId || 'mock-session-' + Date.now(),
      page,
      data,
      userAgent,
      ipAddress
    };
    
    const event = await AnalyticsEvent.trackEvent(eventData);
    
    res.status(201).json({
      success: true,
      message: 'Event tracked successfully',
      data: event
    });
  } catch (error) {
    console.error('Error tracking event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track event',
      error: error.message
    });
  }
});

// Get platform statistics
router.get('/platform', async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    
    let startDate = new Date();
    switch (period) {
      case '1d':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7);
    }
    
    const endDate = new Date();
    
    // Get daily stats
    const dailyStats = await PlatformStats.getStatsRange(startDate, endDate);
    
    // Get current totals
    const currentStats = await PlatformStats.findOne().sort({ date: -1 });
    
    // Get event counts
    const eventStats = await AnalyticsEvent.getEventStats(startDate, endDate);
    
    res.json({
      success: true,
      data: {
        period,
        startDate,
        endDate,
        currentStats,
        dailyStats,
        eventStats
      }
    });
  } catch (error) {
    console.error('Error getting platform stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get platform statistics',
      error: error.message
    });
  }
});

// Get user analytics
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { period = '30d' } = req.query;
    
    let startDate = new Date();
    switch (period) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }
    
    // Get user analytics
    const userAnalytics = await UserAnalytics.findOne({ userId });
    
    // Get user events
    const userEvents = await AnalyticsEvent.find({
      userId,
      timestamp: { $gte: startDate }
    }).sort({ timestamp: -1 });
    
    // Get user activity by day
    const activityByDay = await AnalyticsEvent.aggregate([
      {
        $match: {
          userId: userId,
          timestamp: { $gte: startDate }
        }
      },
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
    
    res.json({
      success: true,
      data: {
        userAnalytics,
        userEvents,
        activityByDay,
        period
      }
    });
  } catch (error) {
    console.error('Error getting user analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user analytics',
      error: error.message
    });
  }
});

// Get top users
router.get('/users/top', async (req, res) => {
  try {
    const { category = 'jobs.earnings', limit = 10 } = req.query;
    
    const topUsers = await UserAnalytics.getTopUsers(category, parseInt(limit));
    
    res.json({
      success: true,
      data: {
        category,
        limit: parseInt(limit),
        users: topUsers
      }
    });
  } catch (error) {
    console.error('Error getting top users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get top users',
      error: error.message
    });
  }
});

// Get search analytics
router.get('/search', async (req, res) => {
  try {
    const { category, limit = 10 } = req.query;
    
    let query = {};
    if (category) {
      query.category = category;
    }
    
    const popularSearches = await SearchAnalytics.find(query)
      .sort({ count: -1 })
      .limit(parseInt(limit));
    
    // Get search trends
    const searchTrends = await SearchAnalytics.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
            category: "$category"
          },
          searches: { $sum: "$count" },
          uniqueQueries: { $sum: 1 }
        }
      },
      { $sort: { "_id.date": 1 } }
    ]);
    
    res.json({
      success: true,
      data: {
        popularSearches,
        searchTrends,
        category,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error getting search analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get search analytics',
      error: error.message
    });
  }
});

// Track search
router.post('/search', async (req, res) => {
  try {
    const { query, category, results, filters } = req.body;
    
    const searchData = {
      query,
      category,
      results,
      filters
    };
    
    const searchAnalytics = await SearchAnalytics.trackSearch(searchData);
    
    res.status(201).json({
      success: true,
      message: 'Search tracked successfully',
      data: searchAnalytics
    });
  } catch (error) {
    console.error('Error tracking search:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track search',
      error: error.message
    });
  }
});

// Get dashboard summary
router.get('/dashboard', async (req, res) => {
  try {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    // Get current stats
    const currentStats = await PlatformStats.findOne().sort({ date: -1 });
    
    // Get today's events
    const todayEvents = await AnalyticsEvent.aggregate([
      {
        $match: {
          timestamp: {
            $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate())
          }
        }
      },
      {
        $group: {
          _id: "$eventType",
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get yesterday's events for comparison
    const yesterdayEvents = await AnalyticsEvent.aggregate([
      {
        $match: {
          timestamp: {
            $gte: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate()),
            $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate())
          }
        }
      },
      {
        $group: {
          _id: "$eventType",
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get top performing categories
    const topCategories = await SearchAnalytics.aggregate([
      {
        $group: {
          _id: "$category",
          totalSearches: { $sum: "$count" },
          uniqueQueries: { $sum: 1 }
        }
      },
      { $sort: { totalSearches: -1 } },
      { $limit: 5 }
    ]);
    
    // Get recent activity
    const recentActivity = await AnalyticsEvent.find()
      .sort({ timestamp: -1 })
      .limit(20)
      .populate('userId', 'name email');
    
    res.json({
      success: true,
      data: {
        currentStats,
        todayEvents,
        yesterdayEvents,
        topCategories,
        recentActivity,
        summary: {
          totalUsers: currentStats?.users?.total || 0,
          totalJobs: currentStats?.jobs?.total || 0,
          totalProducts: currentStats?.marketplace?.products || 0,
          totalRevenue: currentStats?.marketplace?.revenue || 0
        }
      }
    });
  } catch (error) {
    console.error('Error getting dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard data',
      error: error.message
    });
  }
});

// Generate custom report
router.post('/report', async (req, res) => {
  try {
    const { 
      type, 
      startDate, 
      endDate, 
      filters = {}, 
      groupBy = 'day' 
    } = req.body;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    let reportData;
    
    switch (type) {
      case 'user_activity':
        reportData = await AnalyticsEvent.aggregate([
          {
            $match: {
              timestamp: { $gte: start, $lte: end },
              eventType: { $in: ['user_login', 'page_view', 'search_performed'] }
            }
          },
          {
            $group: {
              _id: {
                date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                eventType: "$eventType"
              },
              count: { $sum: 1 },
              uniqueUsers: { $addToSet: "$userId" }
            }
          },
          {
            $project: {
              date: "$_id.date",
              eventType: "$_id.eventType",
              count: 1,
              uniqueUsers: { $size: "$uniqueUsers" }
            }
          },
          { $sort: { date: 1 } }
        ]);
        break;
        
      case 'revenue':
        reportData = await PlatformStats.aggregate([
          {
            $match: {
              date: { $gte: start, $lte: end }
            }
          },
          {
            $group: {
              _id: {
                date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }
              },
              totalRevenue: { $sum: "$marketplace.revenue" },
              totalTransactions: { $sum: "$wallet.transactions" },
              totalProducts: { $sum: "$marketplace.products" }
            }
          },
          { $sort: { "_id.date": 1 } }
        ]);
        break;
        
      case 'job_performance':
        reportData = await PlatformStats.aggregate([
          {
            $match: {
              date: { $gte: start, $lte: end }
            }
          },
          {
            $group: {
              _id: {
                date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }
              },
              jobsPosted: { $sum: "$jobs.posted" },
              jobsCompleted: { $sum: "$jobs.completed" },
              activeJobs: { $sum: "$jobs.active" }
            }
          },
          { $sort: { "_id.date": 1 } }
        ]);
        break;
        
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid report type'
        });
    }
    
    res.json({
      success: true,
      data: {
        type,
        startDate: start,
        endDate: end,
        filters,
        groupBy,
        reportData
      }
    });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate report',
      error: error.message
    });
  }
});

// Update platform stats (admin only)
router.post('/update-stats', async (req, res) => {
  try {
    const { date, stats } = req.body;
    
    const updatedStats = await PlatformStats.updateDailyStats(
      new Date(date), 
      stats
    );
    
    res.json({
      success: true,
      message: 'Platform stats updated successfully',
      data: updatedStats
    });
  } catch (error) {
    console.error('Error updating platform stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update platform stats',
      error: error.message
    });
  }
});

// Update user analytics
router.post('/user/:userId/update', async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;
    
    const updatedAnalytics = await UserAnalytics.updateUserStats(userId, updates);
    
    res.json({
      success: true,
      message: 'User analytics updated successfully',
      data: updatedAnalytics
    });
  } catch (error) {
    console.error('Error updating user analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user analytics',
      error: error.message
    });
  }
});

module.exports = router; 
const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// GET /api/notification - دریافت همه اعلان‌های کاربر
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      type, 
      priority,
      unreadOnly = false 
    } = req.query;
    
    const userId = req.user?.id || '507f1f77bcf86cd799439011'; // Mock user ID
    
    const filter = { user: userId };
    
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (priority) filter.priority = priority;
    if (unreadOnly === 'true') filter.status = 'unread';
    
    const skip = (page - 1) * limit;
    
    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    const total = await Notification.countDocuments(filter);
    
    res.json({
      notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/notification/unread-count - دریافت تعداد اعلان‌های خوانده نشده
router.get('/unread-count', async (req, res) => {
  try {
    const userId = req.user?.id || '507f1f77bcf86cd799439011';
    
    const count = await Notification.getUnreadCount(userId);
    
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/notification/:id - دریافت اعلان خاص
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || '507f1f77bcf86cd799439011';
    
    const notification = await Notification.findOne({
      _id: id,
      user: userId
    }).lean();
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/notification - ایجاد اعلان جدید
router.post('/', async (req, res) => {
  try {
    const {
      type,
      title,
      content,
      data = {},
      priority = 'normal',
      channels = {},
      settings = {},
      scheduledAt
    } = req.body;
    
    const userId = req.user?.id || '507f1f77bcf86cd799439011';
    
    const notification = await Notification.createNotification(
      userId,
      type,
      title,
      content,
      {
        data,
        priority,
        channels,
        settings,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined
      }
    );
    
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/notification/:id/read - علامت‌گذاری به عنوان خوانده شده
router.put('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || '507f1f77bcf86cd799439011';
    
    const notification = await Notification.markAsRead(id, userId);
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/notification/read-all - علامت‌گذاری همه به عنوان خوانده شده
router.put('/read-all', async (req, res) => {
  try {
    const userId = req.user?.id || '507f1f77bcf86cd799439011';
    
    const result = await Notification.markAllAsRead(userId);
    
    res.json({ 
      message: 'All notifications marked as read',
      updatedCount: result.modifiedCount 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/notification/:id/archive - آرشیو کردن اعلان
router.put('/:id/archive', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || '507f1f77bcf86cd799439011';
    
    const notification = await Notification.findOne({
      _id: id,
      user: userId
    });
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    await notification.archive();
    
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/notification/:id - حذف اعلان
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || '507f1f77bcf86cd799439011';
    
    const notification = await Notification.findOne({
      _id: id,
      user: userId
    });
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    await notification.softDelete();
    
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/notification/:id/click - ثبت کلیک روی اعلان
router.post('/:id/click', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || '507f1f77bcf86cd799439011';
    
    const notification = await Notification.findOne({
      _id: id,
      user: userId
    });
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    await notification.incrementClickCount();
    
    res.json({ message: 'Click registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/notification/stats - آمار اعلان‌ها
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user?.id || '507f1f77bcf86cd799439011';
    const { period = '30d' } = req.query;
    
    const now = new Date();
    let startDate;
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    
    const stats = await Notification.aggregate([
      {
        $match: {
          user: userId,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            type: '$type',
            status: '$status'
          },
          count: { $sum: 1 },
          totalClicks: { $sum: '$stats.clickCount' },
          totalViews: { $sum: '$stats.openCount' }
        }
      }
    ]);
    
    const totalNotifications = await Notification.countDocuments({
      user: userId,
      createdAt: { $gte: startDate }
    });
    
    const unreadCount = await Notification.getUnreadCount(userId);
    
    res.json({
      period,
      totalNotifications,
      unreadCount,
      breakdown: stats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/notification/bulk - ایجاد اعلان‌های گروهی
router.post('/bulk', async (req, res) => {
  try {
    const { notifications, userIds } = req.body;
    
    if (!notifications || !userIds || !Array.isArray(userIds)) {
      return res.status(400).json({ error: 'Invalid request data' });
    }
    
    const createdNotifications = [];
    
    for (const userId of userIds) {
      for (const notificationData of notifications) {
        const notification = await Notification.createNotification(
          userId,
          notificationData.type,
          notificationData.title,
          notificationData.content,
          notificationData.options || {}
        );
        createdNotifications.push(notification);
      }
    }
    
    res.status(201).json({
      message: 'Bulk notifications created successfully',
      count: createdNotifications.length,
      notifications: createdNotifications
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/notification/settings - به‌روزرسانی تنظیمات اعلان‌ها
router.put('/settings', async (req, res) => {
  try {
    const {
      inApp = true,
      push = false,
      email = false,
      sms = false,
      sound = true,
      vibration = true,
      silent = false
    } = req.body;
    
    const userId = req.user?.id || '507f1f77bcf86cd799439011';
    
    // در اینجا می‌توانید تنظیمات کاربر را در دیتابیس ذخیره کنید
    // فعلاً فقط پاسخ موفق برمی‌گردانیم
    
    res.json({
      message: 'Notification settings updated successfully',
      settings: {
        channels: { inApp, push, email, sms },
        sound,
        vibration,
        silent
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 
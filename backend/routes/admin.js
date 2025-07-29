const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const ContentModeration = require('../models/ContentModeration');
const SystemSettings = require('../models/SystemSettings');
const Worker = require('../models/Worker');
const Product = require('../models/Product');

// Mock admin ID for testing (in real app, get from JWT token)
const mockAdminId = '507f1f77bcf86cd799439011';

// Admin Authentication
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }
    
    const admin = await Admin.findByCredentials(username, password);
    
    // Update last login
    admin.activity.lastLogin = new Date();
    admin.activity.loginCount += 1;
    await admin.save();
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        admin: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          firstName: admin.firstName,
          lastName: admin.lastName,
          role: admin.role,
          permissions: admin.permissions,
          profile: admin.profile
        }
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(401).json({
      success: false,
      message: error.message || 'Invalid credentials'
    });
  }
});

// Admin Registration (Super Admin only)
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, role } = req.body;
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      $or: [{ username }, { email }]
    });
    
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this username or email already exists'
      });
    }
    
    const adminData = {
      username,
      email,
      password,
      firstName,
      lastName,
      role: role || 'admin'
    };
    
    const admin = await Admin.createAdmin(adminData);
    
    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      data: {
        admin: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          firstName: admin.firstName,
          lastName: admin.lastName,
          role: admin.role
        }
      }
    });
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create admin',
      error: error.message
    });
  }
});

// Get Admin Profile
router.get('/profile', async (req, res) => {
  try {
    const admin = await Admin.findById(mockAdminId).select('-password');
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }
    
    res.json({
      success: true,
      data: { admin }
    });
  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get admin profile',
      error: error.message
    });
  }
});

// Update Admin Profile
router.put('/profile', async (req, res) => {
  try {
    const { firstName, lastName, phone, department, bio } = req.body;
    
    const admin = await Admin.findById(mockAdminId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }
    
    if (firstName) admin.firstName = firstName;
    if (lastName) admin.lastName = lastName;
    if (phone) admin.profile.phone = phone;
    if (department) admin.profile.department = department;
    if (bio) admin.profile.bio = bio;
    
    await admin.save();
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { admin }
    });
  } catch (error) {
    console.error('Update admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
});

// Change Password
router.put('/change-password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const admin = await Admin.findById(mockAdminId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }
    
    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    
    admin.password = newPassword;
    await admin.save();
    
    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: error.message
    });
  }
});

// Get All Admins
router.get('/admins', async (req, res) => {
  try {
    const { role, status, limit = 50, page = 1 } = req.query;
    
    const query = {};
    if (role) query.role = role;
    if (status) query.status = status;
    
    const admins = await Admin.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await Admin.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        admins,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get admins',
      error: error.message
    });
  }
});

// Content Moderation

// Get Pending Content
router.get('/moderation/pending', async (req, res) => {
  try {
    const { contentType, limit = 50, page = 1 } = req.query;
    
    const content = await ContentModeration.getPending(contentType, parseInt(limit));
    const total = await ContentModeration.countDocuments({ status: 'pending' });
    
    res.json({
      success: true,
      data: {
        content,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get pending content error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get pending content',
      error: error.message
    });
  }
});

// Get Flagged Content
router.get('/moderation/flagged', async (req, res) => {
  try {
    const { limit = 50, page = 1 } = req.query;
    
    const content = await ContentModeration.getFlagged(parseInt(limit));
    const total = await ContentModeration.countDocuments({ 'flags.status': 'pending' });
    
    res.json({
      success: true,
      data: {
        content,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get flagged content error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get flagged content',
      error: error.message
    });
  }
});

// Approve Content
router.post('/moderation/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, details } = req.body;
    
    const moderation = await ContentModeration.findById(id);
    if (!moderation) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }
    
    await moderation.approve(mockAdminId, reason, details);
    
    res.json({
      success: true,
      message: 'Content approved successfully',
      data: { moderation }
    });
  } catch (error) {
    console.error('Approve content error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve content',
      error: error.message
    });
  }
});

// Reject Content
router.post('/moderation/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, details } = req.body;
    
    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }
    
    const moderation = await ContentModeration.findById(id);
    if (!moderation) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }
    
    await moderation.reject(mockAdminId, reason, details);
    
    res.json({
      success: true,
      message: 'Content rejected successfully',
      data: { moderation }
    });
  } catch (error) {
    console.error('Reject content error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject content',
      error: error.message
    });
  }
});

// Get Moderation Stats
router.get('/moderation/stats', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();
    
    const stats = await ContentModeration.getStats(start, end);
    
    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    console.error('Get moderation stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get moderation stats',
      error: error.message
    });
  }
});

// System Settings

// Get Settings
router.get('/settings', async (req, res) => {
  try {
    const { category, includePrivate = false } = req.query;
    
    let settings;
    if (category) {
      settings = await SystemSettings.getByCategory(category, includePrivate === 'true');
    } else {
      settings = await SystemSettings.getPublic();
    }
    
    res.json({
      success: true,
      data: { settings }
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get settings',
      error: error.message
    });
  }
});

// Update Setting
router.put('/settings/:category/:key', async (req, res) => {
  try {
    const { category, key } = req.params;
    const { value } = req.body;
    
    const setting = await SystemSettings.getByKey(key, category);
    if (!setting) {
      return res.status(404).json({
        success: false,
        message: 'Setting not found'
      });
    }
    
    if (!setting.isEditable) {
      return res.status(403).json({
        success: false,
        message: 'Setting is not editable'
      });
    }
    
    await setting.updateValue(value, mockAdminId);
    
    res.json({
      success: true,
      message: 'Setting updated successfully',
      data: { setting }
    });
  } catch (error) {
    console.error('Update setting error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update setting',
      error: error.message
    });
  }
});

// Initialize Default Settings
router.post('/settings/initialize', async (req, res) => {
  try {
    await SystemSettings.initializeDefaults();
    
    res.json({
      success: true,
      message: 'Default settings initialized successfully'
    });
  } catch (error) {
    console.error('Initialize settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initialize settings',
      error: error.message
    });
  }
});

// User Management

// Get Users
router.get('/users', async (req, res) => {
  try {
    const { role, status, search, limit = 50, page = 1 } = req.query;
    
    const query = {};
    if (role) query.role = role;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const users = await Worker.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await Worker.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users',
      error: error.message
    });
  }
});

// Ban User
router.post('/users/:id/ban', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const user = await Worker.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    user.status = 'banned';
    user.banReason = reason;
    user.bannedAt = new Date();
    user.bannedBy = mockAdminId;
    
    await user.save();
    
    res.json({
      success: true,
      message: 'User banned successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Ban user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to ban user',
      error: error.message
    });
  }
});

// Unban User
router.post('/users/:id/unban', async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await Worker.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    user.status = 'active';
    user.banReason = null;
    user.bannedAt = null;
    user.bannedBy = null;
    
    await user.save();
    
    res.json({
      success: true,
      message: 'User unbanned successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Unban user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unban user',
      error: error.message
    });
  }
});

// Dashboard Stats
router.get('/dashboard', async (req, res) => {
  try {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Get counts
    const totalUsers = await Worker.countDocuments();
    const totalProducts = await Product.countDocuments();
    const pendingModeration = await ContentModeration.countDocuments({ status: 'pending' });
    const flaggedContent = await ContentModeration.countDocuments({ 'flags.status': 'pending' });
    
    // Get today's stats
    const todayUsers = await Worker.countDocuments({
      createdAt: { $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()) }
    });
    
    const todayProducts = await Product.countDocuments({
      createdAt: { $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()) }
    });
    
    // Get moderation stats
    const moderationStats = await ContentModeration.aggregate([
      {
        $match: {
          createdAt: { $gte: yesterday }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalProducts,
          pendingModeration,
          flaggedContent
        },
        today: {
          newUsers: todayUsers,
          newProducts: todayProducts
        },
        moderation: moderationStats
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard stats',
      error: error.message
    });
  }
});

module.exports = router; 
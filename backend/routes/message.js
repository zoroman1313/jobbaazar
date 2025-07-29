const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Chat = require('../models/Chat');

// GET /api/message/chats - دریافت چت‌های کاربر
router.get('/chats', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const userId = req.user?.id || '507f1f77bcf86cd799439011';
    
    const skip = (page - 1) * limit;
    
    const chats = await Chat.getUserChats(userId, parseInt(limit), skip);
    
    // اضافه کردن تعداد پیام‌های خوانده نشده
    for (let chat of chats) {
      chat.unreadCount = await Message.getUnreadCount(chat._id, userId);
    }
    
    const total = await Chat.countDocuments({
      'participants.user': userId,
      isArchived: false
    });
    
    res.json({
      chats,
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

// GET /api/message/chat/:chatId - دریافت پیام‌های چت
router.get('/chat/:chatId', async (req, res) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const userId = req.user?.id || '507f1f77bcf86cd799439011';
    
    // بررسی عضویت کاربر در چت
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.isParticipant(userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const offset = (page - 1) * limit;
    const messages = await Message.getChatMessages(chatId, parseInt(limit), offset);
    
    const total = await Message.countDocuments({ chatId });
    
    res.json({
      messages: messages.reverse(), // نمایش از قدیم به جدید
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

// POST /api/message/chat/:chatId - ارسال پیام جدید
router.post('/chat/:chatId', async (req, res) => {
  try {
    const { chatId } = req.params;
    const {
      messageType = 'text',
      content,
      replyTo,
      quote
    } = req.body;
    
    const userId = req.user?.id || '507f1f77bcf86cd799439011';
    
    // بررسی عضویت کاربر در چت
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.isParticipant(userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // دریافت گیرندگان (همه اعضای چت به جز فرستنده)
    const recipients = chat.participants
      .filter(p => p.user.toString() !== userId)
      .map(p => p.user);
    
    const message = await Message.createMessage(
      chatId,
      userId,
      recipients,
      messageType,
      content,
      { replyTo, quote }
    );
    
    // به‌روزرسانی آخرین پیام چت
    await Chat.updateLastMessage(chatId, {
      messageId: message._id,
      sender: userId,
      content: content.text || content.file?.name || 'Message',
      messageType,
      timestamp: new Date()
    });
    
    // علامت‌گذاری پیام‌های قبلی به عنوان تحویل شده
    await Message.updateMany(
      {
        chatId,
        'recipients.user': userId,
        'recipients.status': 'sent'
      },
      {
        'recipients.$.deliveredAt': new Date(),
        'recipients.$.status': 'delivered'
      }
    );
    
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/message/chat - ایجاد چت جدید
router.post('/chat', async (req, res) => {
  try {
    const {
      type = 'private',
      name,
      participants = [],
      jobInfo,
      projectInfo
    } = req.body;
    
    const userId = req.user?.id || '507f1f77bcf86cd799439011';
    
    let chat;
    
    switch (type) {
      case 'private':
        if (participants.length !== 1) {
          return res.status(400).json({ error: 'Private chat requires exactly one participant' });
        }
        chat = await Chat.createPrivateChat(userId, participants[0]);
        break;
        
      case 'group':
        if (!name) {
          return res.status(400).json({ error: 'Group name is required' });
        }
        chat = await Chat.createGroupChat(name, userId, participants);
        break;
        
      case 'job':
        if (!jobInfo) {
          return res.status(400).json({ error: 'Job information is required' });
        }
        chat = await Chat.createJobChat(jobInfo);
        break;
        
      case 'project':
        if (!projectInfo) {
          return res.status(400).json({ error: 'Project information is required' });
        }
        chat = await Chat.createGroupChat(projectInfo.name, userId, projectInfo.members);
        chat.projectInfo = projectInfo;
        await chat.save();
        break;
        
      default:
        return res.status(400).json({ error: 'Invalid chat type' });
    }
    
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/message/:messageId/read - علامت‌گذاری پیام به عنوان خوانده شده
router.put('/:messageId/read', async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user?.id || '507f1f77bcf86cd799439011';
    
    const message = await Message.markAsRead(messageId, userId);
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/message/chat/:chatId/read-all - علامت‌گذاری همه پیام‌های چت به عنوان خوانده شده
router.put('/chat/:chatId/read-all', async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user?.id || '507f1f77bcf86cd799439011';
    
    const result = await Message.updateMany(
      {
        chatId,
        'recipients.user': userId,
        'recipients.status': { $ne: 'read' }
      },
      {
        'recipients.$.readAt': new Date(),
        'recipients.$.status': 'read'
      }
    );
    
    res.json({
      message: 'All messages marked as read',
      updatedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/message/:messageId/reaction - اضافه کردن واکنش به پیام
router.post('/:messageId/reaction', async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user?.id || '507f1f77bcf86cd799439011';
    
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    await message.addReaction(userId, emoji);
    
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/message/:messageId/reaction - حذف واکنش از پیام
router.delete('/:messageId/reaction', async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user?.id || '507f1f77bcf86cd799439011';
    
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    await message.removeReaction(userId);
    
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/message/chat/:chatId/participants - مدیریت اعضای چت
router.put('/chat/:chatId/participants', async (req, res) => {
  try {
    const { chatId } = req.params;
    const { action, userId, role = 'member' } = req.body;
    const currentUserId = req.user?.id || '507f1f77bcf86cd799439011';
    
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.isModerator(currentUserId)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    let result;
    
    switch (action) {
      case 'add':
        result = await Chat.addParticipant(chatId, userId, role);
        break;
        
      case 'remove':
        result = await Chat.removeParticipant(chatId, userId);
        break;
        
      case 'changeRole':
        result = await chat.changeUserRole(userId, role);
        break;
        
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/message/chat/:chatId/archive - آرشیو کردن چت
router.put('/chat/:chatId/archive', async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user?.id || '507f1f77bcf86cd799439011';
    
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.isParticipant(userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    await chat.archive();
    
    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/message/unread-count - دریافت تعداد پیام‌های خوانده نشده
router.get('/unread-count', async (req, res) => {
  try {
    const userId = req.user?.id || '507f1f77bcf86cd799439011';
    
    const chats = await Chat.find({
      'participants.user': userId,
      isArchived: false
    });
    
    let totalUnread = 0;
    const chatUnreadCounts = {};
    
    for (const chat of chats) {
      const unreadCount = await Message.getUnreadCount(chat._id, userId);
      totalUnread += unreadCount;
      chatUnreadCounts[chat._id] = unreadCount;
    }
    
    res.json({
      totalUnread,
      chatUnreadCounts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/message/stats - آمار پیام‌ها
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
    
    const stats = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: userId },
            { 'recipients.user': userId }
          ],
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            messageType: '$messageType',
            isSender: { $eq: ['$sender', userId] }
          },
          count: { $sum: 1 },
          totalViews: { $sum: '$stats.viewCount' },
          totalReactions: { $sum: '$stats.reactionCount' }
        }
      }
    ]);
    
    const totalMessages = await Message.countDocuments({
      $or: [
        { sender: userId },
        { 'recipients.user': userId }
      ],
      createdAt: { $gte: startDate }
    });
    
    const totalChats = await Chat.countDocuments({
      'participants.user': userId,
      isArchived: false
    });
    
    res.json({
      period,
      totalMessages,
      totalChats,
      breakdown: stats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 
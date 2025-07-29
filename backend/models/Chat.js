const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  // نوع چت
  type: {
    type: String,
    enum: ['private', 'group', 'job', 'project'],
    required: true,
    index: true
  },
  
  // نام چت
  name: {
    type: String,
    maxlength: 100
  },
  
  // توضیحات چت
  description: {
    type: String,
    maxlength: 500
  },
  
  // عکس چت
  avatar: {
    url: String,
    thumbnail: String
  },
  
  // اعضای چت
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['admin', 'moderator', 'member', 'viewer'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    lastSeen: Date,
    isOnline: {
      type: Boolean,
      default: false
    },
    isMuted: {
      type: Boolean,
      default: false
    },
    isBlocked: {
      type: Boolean,
      default: false
    },
    settings: {
      notifications: {
        type: Boolean,
        default: true
      },
      sound: {
        type: Boolean,
        default: true
      },
      vibration: {
        type: Boolean,
        default: true
      }
    }
  }],
  
  // اطلاعات مربوط به کار (برای چت‌های کاری)
  jobInfo: {
    jobId: mongoose.Schema.Types.ObjectId,
    title: String,
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled', 'disputed'],
      default: 'active'
    },
    employer: mongoose.Schema.Types.ObjectId,
    worker: mongoose.Schema.Types.ObjectId,
    amount: Number,
    currency: String,
    deadline: Date
  },
  
  // اطلاعات مربوط به پروژه (برای چت‌های پروژه)
  projectInfo: {
    projectId: mongoose.Schema.Types.ObjectId,
    name: String,
    description: String,
    status: {
      type: String,
      enum: ['planning', 'active', 'completed', 'cancelled'],
      default: 'planning'
    },
    owner: mongoose.Schema.Types.ObjectId,
    members: [mongoose.Schema.Types.ObjectId],
    startDate: Date,
    endDate: Date
  },
  
  // آخرین پیام
  lastMessage: {
    messageId: mongoose.Schema.Types.ObjectId,
    sender: mongoose.Schema.Types.ObjectId,
    content: String,
    messageType: String,
    timestamp: Date
  },
  
  // آمار چت
  stats: {
    messageCount: { type: Number, default: 0 },
    participantCount: { type: Number, default: 0 },
    activeParticipantCount: { type: Number, default: 0 },
    unreadCount: { type: Number, default: 0 }
  },
  
  // تنظیمات چت
  settings: {
    isPublic: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    isPinned: { type: Boolean, default: false },
    allowInvites: { type: Boolean, default: true },
    allowFileSharing: { type: Boolean, default: true },
    allowVoiceMessages: { type: Boolean, default: true },
    allowVideoCalls: { type: Boolean, default: true },
    maxParticipants: { type: Number, default: 100 },
    messageRetention: { type: Number, default: 365 }, // روز
    encryption: { type: Boolean, default: false }
  },
  
  // متادیتا
  metadata: {
    language: { type: String, default: 'en' },
    category: String,
    tags: [String],
    location: {
      country: String,
      city: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    industry: String,
    skills: [String]
  },
  
  // زمان‌بندی
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastActivityAt: {
    type: Date,
    default: Date.now
  },
  archivedAt: Date
}, {
  timestamps: true
});

// ایندکس‌ها برای عملکرد بهتر
ChatSchema.index({ type: 1, createdAt: -1 });
ChatSchema.index({ 'participants.user': 1, lastActivityAt: -1 });
ChatSchema.index({ 'jobInfo.jobId': 1 });
ChatSchema.index({ 'projectInfo.projectId': 1 });
ChatSchema.index({ isArchived: 1, lastActivityAt: -1 });

// متدهای استاتیک
ChatSchema.statics = {
  // ایجاد چت خصوصی
  async createPrivateChat(user1, user2) {
    const existingChat = await this.findOne({
      type: 'private',
      'participants.user': { $all: [user1, user2] },
      'participants.1.user': { $exists: true }
    });
    
    if (existingChat) {
      return existingChat;
    }
    
    const chat = new this({
      type: 'private',
      participants: [
        { user: user1, role: 'member' },
        { user: user2, role: 'member' }
      ]
    });
    
    return await chat.save();
  },
  
  // ایجاد چت گروهی
  async createGroupChat(name, creator, participants = []) {
    const chat = new this({
      type: 'group',
      name,
      participants: [
        { user: creator, role: 'admin' },
        ...participants.map(user => ({ user, role: 'member' }))
      ]
    });
    
    return await chat.save();
  },
  
  // ایجاد چت کاری
  async createJobChat(jobInfo) {
    const chat = new this({
      type: 'job',
      name: `Job: ${jobInfo.title}`,
      jobInfo,
      participants: [
        { user: jobInfo.employer, role: 'admin' },
        { user: jobInfo.worker, role: 'member' }
      ]
    });
    
    return await chat.save();
  },
  
  // دریافت چت‌های کاربر
  async getUserChats(userId, limit = 20, offset = 0) {
    return await this.find({
      'participants.user': userId,
      isArchived: false
    })
    .sort({ lastActivityAt: -1 })
    .skip(offset)
    .limit(limit)
    .populate('participants.user', 'name avatar isOnline lastSeen')
    .populate('lastMessage.sender', 'name avatar')
    .lean();
  },
  
  // اضافه کردن عضو به چت
  async addParticipant(chatId, userId, role = 'member') {
    return await this.findOneAndUpdate(
      { _id: chatId },
      {
        $addToSet: {
          participants: {
            user: userId,
            role,
            joinedAt: new Date()
          }
        }
      },
      { new: true }
    );
  },
  
  // حذف عضو از چت
  async removeParticipant(chatId, userId) {
    return await this.findOneAndUpdate(
      { _id: chatId },
      {
        $pull: {
          participants: { user: userId }
        }
      },
      { new: true }
    );
  },
  
  // به‌روزرسانی آخرین پیام
  async updateLastMessage(chatId, messageData) {
    return await this.findOneAndUpdate(
      { _id: chatId },
      {
        lastMessage: messageData,
        lastActivityAt: new Date(),
        $inc: { 'stats.messageCount': 1 }
      },
      { new: true }
    );
  }
};

// متدهای نمونه
ChatSchema.methods = {
  // بررسی عضویت کاربر
  isParticipant(userId) {
    return this.participants.some(
      participant => participant.user.toString() === userId.toString()
    );
  },
  
  // بررسی نقش کاربر
  getUserRole(userId) {
    const participant = this.participants.find(
      p => p.user.toString() === userId.toString()
    );
    return participant ? participant.role : null;
  },
  
  // بررسی دسترسی ادمین
  isAdmin(userId) {
    const role = this.getUserRole(userId);
    return role === 'admin';
  },
  
  // بررسی دسترسی مدیر
  isModerator(userId) {
    const role = this.getUserRole(userId);
    return role === 'admin' || role === 'moderator';
  },
  
  // تغییر نقش کاربر
  async changeUserRole(userId, newRole) {
    const participant = this.participants.find(
      p => p.user.toString() === userId.toString()
    );
    
    if (participant) {
      participant.role = newRole;
      return await this.save();
    }
    
    return null;
  },
  
  // آرشیو کردن چت
  async archive() {
    this.isArchived = true;
    this.archivedAt = new Date();
    return await this.save();
  },
  
  // بازگردانی چت
  async unarchive() {
    this.isArchived = false;
    this.archivedAt = undefined;
    return await this.save();
  },
  
  // به‌روزرسانی آخرین بازدید
  async updateLastSeen(userId) {
    const participant = this.participants.find(
      p => p.user.toString() === userId.toString()
    );
    
    if (participant) {
      participant.lastSeen = new Date();
      return await this.save();
    }
    
    return null;
  }
};

// هوک‌ها
ChatSchema.pre('save', function(next) {
  // به‌روزرسانی تعداد اعضا
  this.stats.participantCount = this.participants.length;
  
  // به‌روزرسانی زمان
  this.updatedAt = new Date();
  
  // تنظیم نام پیش‌فرض برای چت‌های خصوصی
  if (this.type === 'private' && !this.name) {
    this.name = 'Private Chat';
  }
  
  next();
});

module.exports = mongoose.model('Chat', ChatSchema); 
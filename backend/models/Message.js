const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  // نوع چت
  chatType: {
    type: String,
    enum: ['private', 'group', 'job', 'project'],
    required: true,
    index: true
  },
  
  // شناسه چت
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  
  // فرستنده
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // گیرندگان
  recipients: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    readAt: Date,
    deliveredAt: Date,
    status: {
      type: String,
      enum: ['sent', 'delivered', 'read', 'failed'],
      default: 'sent'
    }
  }],
  
  // نوع پیام
  messageType: {
    type: String,
    enum: [
      'text',           // متن
      'image',          // عکس
      'video',          // ویدیو
      'audio',          // صوت
      'file',           // فایل
      'location',       // موقعیت
      'contact',        // مخاطب
      'sticker',        // استیکر
      'system',         // سیستم
      'job_offer',      // پیشنهاد کار
      'payment',        // پرداخت
      'review'          // نظر
    ],
    default: 'text',
    index: true
  },
  
  // محتوای پیام
  content: {
    text: String,
    image: {
      url: String,
      thumbnail: String,
      size: Number,
      width: Number,
      height: Number,
      format: String
    },
    video: {
      url: String,
      thumbnail: String,
      size: Number,
      duration: Number,
      format: String
    },
    audio: {
      url: String,
      size: Number,
      duration: Number,
      format: String
    },
    file: {
      url: String,
      name: String,
      size: Number,
      type: String,
      extension: String
    },
    location: {
      latitude: Number,
      longitude: Number,
      address: String,
      name: String
    },
    contact: {
      name: String,
      phone: String,
      email: String,
      userId: mongoose.Schema.Types.ObjectId
    },
    sticker: {
      url: String,
      pack: String,
      id: String
    },
    system: {
      action: String,
      data: mongoose.Schema.Types.Mixed
    },
    jobOffer: {
      jobId: mongoose.Schema.Types.ObjectId,
      title: String,
      amount: Number,
      currency: String,
      deadline: Date
    },
    payment: {
      amount: Number,
      currency: String,
      transactionId: mongoose.Schema.Types.ObjectId,
      status: String
    },
    review: {
      rating: Number,
      title: String,
      content: String,
      reviewId: mongoose.Schema.Types.ObjectId
    }
  },
  
  // وضعیت پیام
  status: {
    type: String,
    enum: ['sending', 'sent', 'delivered', 'read', 'failed', 'deleted'],
    default: 'sending',
    index: true
  },
  
  // پاسخ به پیام
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  
  // نقل قول
  quote: {
    messageId: mongoose.Schema.Types.ObjectId,
    text: String,
    sender: String
  },
  
  // تنظیمات پیام
  settings: {
    encrypted: { type: Boolean, default: false },
    selfDestruct: { type: Boolean, default: false },
    selfDestructTime: Date,
    priority: {
      type: String,
      enum: ['low', 'normal', 'high', 'urgent'],
      default: 'normal'
    }
  },
  
  // متادیتا
  metadata: {
    language: { type: String, default: 'en' },
    platform: String,
    appVersion: String,
    deviceInfo: {
      type: String,
      os: String,
      browser: String
    },
    ipAddress: String,
    userAgent: String
  },
  
  // آمار
  stats: {
    viewCount: { type: Number, default: 0 },
    forwardCount: { type: Number, default: 0 },
    replyCount: { type: Number, default: 0 },
    reactionCount: { type: Number, default: 0 }
  },
  
  // واکنش‌ها
  reactions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    emoji: String,
    createdAt: { type: Date, default: Date.now }
  }],
  
  // برچسب‌ها
  tags: [String],
  
  // زمان‌بندی
  scheduledAt: Date,
  deliveredAt: Date,
  readAt: Date
}, {
  timestamps: true
});

// ایندکس‌ها برای عملکرد بهتر
MessageSchema.index({ chatId: 1, createdAt: -1 });
MessageSchema.index({ sender: 1, createdAt: -1 });
MessageSchema.index({ 'recipients.user': 1, createdAt: -1 });
MessageSchema.index({ status: 1, createdAt: -1 });
MessageSchema.index({ messageType: 1, createdAt: -1 });

// متدهای استاتیک
MessageSchema.statics = {
  // ایجاد پیام جدید
  async createMessage(chatId, sender, recipients, messageType, content, options = {}) {
    const message = new this({
      chatId,
      sender,
      recipients: recipients.map(recipient => ({
        user: recipient,
        status: 'sent'
      })),
      messageType,
      content,
      ...options
    });
    
    return await message.save();
  },
  
  // دریافت پیام‌های چت
  async getChatMessages(chatId, limit = 50, offset = 0) {
    return await this.find({ chatId })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .populate('sender', 'name avatar')
      .populate('recipients.user', 'name avatar')
      .populate('replyTo', 'content sender')
      .lean();
  },
  
  // علامت‌گذاری به عنوان خوانده شده
  async markAsRead(messageId, userId) {
    return await this.findOneAndUpdate(
      { 
        _id: messageId,
        'recipients.user': userId
      },
      {
        'recipients.$.readAt': new Date(),
        'recipients.$.status': 'read'
      },
      { new: true }
    );
  },
  
  // علامت‌گذاری به عنوان تحویل شده
  async markAsDelivered(messageId, userId) {
    return await this.findOneAndUpdate(
      { 
        _id: messageId,
        'recipients.user': userId
      },
      {
        'recipients.$.deliveredAt': new Date(),
        'recipients.$.status': 'delivered'
      },
      { new: true }
    );
  },
  
  // دریافت تعداد پیام‌های خوانده نشده
  async getUnreadCount(chatId, userId) {
    return await this.countDocuments({
      chatId,
      'recipients.user': userId,
      'recipients.status': { $ne: 'read' },
      sender: { $ne: userId }
    });
  }
};

// متدهای نمونه
MessageSchema.methods = {
  // اضافه کردن واکنش
  async addReaction(userId, emoji) {
    const existingReaction = this.reactions.find(
      reaction => reaction.user.toString() === userId.toString()
    );
    
    if (existingReaction) {
      existingReaction.emoji = emoji;
    } else {
      this.reactions.push({ user: userId, emoji });
    }
    
    this.stats.reactionCount = this.reactions.length;
    return await this.save();
  },
  
  // حذف واکنش
  async removeReaction(userId) {
    this.reactions = this.reactions.filter(
      reaction => reaction.user.toString() !== userId.toString()
    );
    
    this.stats.reactionCount = this.reactions.length;
    return await this.save();
  },
  
  // افزایش شمارنده بازدید
  async incrementViewCount() {
    this.stats.viewCount += 1;
    return await this.save();
  },
  
  // افزایش شمارنده ارسال مجدد
  async incrementForwardCount() {
    this.stats.forwardCount += 1;
    return await this.save();
  },
  
  // افزایش شمارنده پاسخ
  async incrementReplyCount() {
    this.stats.replyCount += 1;
    return await this.save();
  },
  
  // حذف نرم
  async softDelete() {
    this.status = 'deleted';
    return await this.save();
  }
};

// هوک‌ها
MessageSchema.pre('save', function(next) {
  // تنظیم زمان تحویل
  if (this.isNew && this.status === 'sent') {
    this.deliveredAt = new Date();
  }
  
  // تنظیم زبان پیش‌فرض
  if (!this.metadata.language) {
    this.metadata.language = 'en';
  }
  
  next();
});

module.exports = mongoose.model('Message', MessageSchema); 
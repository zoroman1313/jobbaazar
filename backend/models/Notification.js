const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  // اطلاعات کاربر
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // نوع اعلان
  type: {
    type: String,
    enum: [
      'job_offer',           // پیشنهاد کار
      'job_accepted',        // پذیرش کار
      'job_rejected',        // رد کار
      'payment_received',    // دریافت پرداخت
      'payment_sent',        // ارسال پرداخت
      'review_received',     // دریافت نظر
      'review_replied',      // پاسخ به نظر
      'message_received',    // دریافت پیام
      'product_sold',        // فروش محصول
      'product_purchased',   // خرید محصول
      'system_alert',        // هشدار سیستم
      'security_alert',      // هشدار امنیتی
      'promotion',           // تبلیغات
      'reminder'             // یادآوری
    ],
    required: true,
    index: true
  },
  
  // عنوان اعلان
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  
  // محتوای اعلان
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  
  // داده‌های اضافی
  data: {
    jobId: mongoose.Schema.Types.ObjectId,
    productId: mongoose.Schema.Types.ObjectId,
    messageId: mongoose.Schema.Types.ObjectId,
    reviewId: mongoose.Schema.Types.ObjectId,
    transactionId: mongoose.Schema.Types.ObjectId,
    amount: Number,
    currency: String,
    url: String,
    image: String
  },
  
  // اولویت اعلان
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal',
    index: true
  },
  
  // وضعیت اعلان
  status: {
    type: String,
    enum: ['unread', 'read', 'archived', 'deleted'],
    default: 'unread',
    index: true
  },
  
  // کانال‌های ارسال
  channels: {
    inApp: {
      type: Boolean,
      default: true
    },
    push: {
      type: Boolean,
      default: false
    },
    email: {
      type: Boolean,
      default: false
    },
    sms: {
      type: Boolean,
      default: false
    }
  },
  
  // وضعیت ارسال
  delivery: {
    inApp: {
      sent: { type: Boolean, default: false },
      sentAt: Date,
      readAt: Date
    },
    push: {
      sent: { type: Boolean, default: false },
      sentAt: Date,
      deviceToken: String,
      error: String
    },
    email: {
      sent: { type: Boolean, default: false },
      sentAt: Date,
      emailAddress: String,
      error: String
    },
    sms: {
      sent: { type: Boolean, default: false },
      sentAt: Date,
      phoneNumber: String,
      error: String
    }
  },
  
  // تنظیمات اعلان
  settings: {
    silent: { type: Boolean, default: false },
    badge: { type: Boolean, default: true },
    sound: { type: Boolean, default: true },
    vibration: { type: Boolean, default: true }
  },
  
  // زمان‌بندی
  scheduledAt: Date,
  expiresAt: Date,
  
  // متادیتا
  metadata: {
    language: { type: String, default: 'en' },
    category: String,
    tags: [String],
    source: String,
    campaign: String
  },
  
  // آمار
  stats: {
    openCount: { type: Number, default: 0 },
    clickCount: { type: Number, default: 0 },
    shareCount: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// ایندکس‌ها برای عملکرد بهتر
NotificationSchema.index({ user: 1, status: 1, createdAt: -1 });
NotificationSchema.index({ type: 1, priority: 1, createdAt: -1 });
NotificationSchema.index({ scheduledAt: 1, status: 1 });
NotificationSchema.index({ expiresAt: 1, status: 1 });

// متدهای استاتیک
NotificationSchema.statics = {
  // ایجاد اعلان جدید
  async createNotification(userId, type, title, content, options = {}) {
    const notification = new this({
      user: userId,
      type,
      title,
      content,
      ...options
    });
    
    return await notification.save();
  },
  
  // دریافت اعلان‌های خوانده نشده
  async getUnreadCount(userId) {
    return await this.countDocuments({
      user: userId,
      status: 'unread'
    });
  },
  
  // علامت‌گذاری به عنوان خوانده شده
  async markAsRead(notificationId, userId) {
    return await this.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { 
        status: 'read',
        'delivery.inApp.readAt': new Date()
      },
      { new: true }
    );
  },
  
  // علامت‌گذاری همه به عنوان خوانده شده
  async markAllAsRead(userId) {
    return await this.updateMany(
      { user: userId, status: 'unread' },
      { 
        status: 'read',
        'delivery.inApp.readAt': new Date()
      }
    );
  }
};

// متدهای نمونه
NotificationSchema.methods = {
  // افزایش شمارنده باز کردن
  async incrementOpenCount() {
    this.stats.openCount += 1;
    return await this.save();
  },
  
  // افزایش شمارنده کلیک
  async incrementClickCount() {
    this.stats.clickCount += 1;
    return await this.save();
  },
  
  // آرشیو کردن
  async archive() {
    this.status = 'archived';
    return await this.save();
  },
  
  // حذف نرم
  async softDelete() {
    this.status = 'deleted';
    return await this.save();
  }
};

// هوک‌ها
NotificationSchema.pre('save', function(next) {
  // تنظیم زمان انقضا پیش‌فرض (30 روز)
  if (!this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }
  
  // تنظیم زبان پیش‌فرض
  if (!this.metadata.language) {
    this.metadata.language = 'en';
  }
  
  next();
});

module.exports = mongoose.model('Notification', NotificationSchema); 
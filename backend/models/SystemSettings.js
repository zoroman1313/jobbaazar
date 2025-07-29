const mongoose = require('mongoose');

const SystemSettingsSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: [
      'general',
      'security',
      'payment',
      'notification',
      'moderation',
      'analytics',
      'integration',
      'localization'
    ]
  },
  key: {
    type: String,
    required: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  type: {
    type: String,
    enum: ['string', 'number', 'boolean', 'array', 'object', 'json'],
    default: 'string'
  },
  description: {
    type: String,
    maxlength: 500,
    default: null
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  isEditable: {
    type: Boolean,
    default: true
  },
  validation: {
    required: {
      type: Boolean,
      default: false
    },
    min: {
      type: Number,
      default: null
    },
    max: {
      type: Number,
      default: null
    },
    pattern: {
      type: String,
      default: null
    },
    enum: [{
      type: mongoose.Schema.Types.Mixed
    }],
    custom: {
      type: String,
      default: null
    }
  },
  metadata: {
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null
    },
    lastModifiedAt: {
      type: Date,
      default: Date.now
    },
    version: {
      type: Number,
      default: 1
    },
    tags: [String],
    dependencies: [String]
  }
}, {
  timestamps: true
});

// Compound index for category and key
SystemSettingsSchema.index({ category: 1, key: 1 }, { unique: true });
SystemSettingsSchema.index({ category: 1 });
SystemSettingsSchema.index({ isPublic: 1 });
SystemSettingsSchema.index({ 'metadata.lastModifiedAt': -1 });

// Pre-save middleware to update metadata
SystemSettingsSchema.pre('save', function(next) {
  if (this.isModified('value')) {
    this.metadata.lastModifiedAt = new Date();
    this.metadata.version += 1;
  }
  next();
});

// Instance method to validate value
SystemSettingsSchema.methods.validateValue = function(value) {
  const validation = this.validation;
  
  if (validation.required && (value === null || value === undefined || value === '')) {
    throw new Error(`${this.key} is required`);
  }
  
  if (value !== null && value !== undefined) {
    if (validation.min !== null && value < validation.min) {
      throw new Error(`${this.key} must be at least ${validation.min}`);
    }
    
    if (validation.max !== null && value > validation.max) {
      throw new Error(`${this.key} must be at most ${validation.max}`);
    }
    
    if (validation.pattern && !new RegExp(validation.pattern).test(value)) {
      throw new Error(`${this.key} format is invalid`);
    }
    
    if (validation.enum && validation.enum.length > 0 && !validation.enum.includes(value)) {
      throw new Error(`${this.key} must be one of: ${validation.enum.join(', ')}`);
    }
  }
  
  return true;
};

// Instance method to update value
SystemSettingsSchema.methods.updateValue = function(newValue, adminId) {
  this.validateValue(newValue);
  this.value = newValue;
  this.metadata.lastModifiedBy = adminId;
  return this.save();
};

// Static method to get setting by key
SystemSettingsSchema.statics.getByKey = function(key, category = null) {
  const query = { key };
  if (category) {
    query.category = category;
  }
  return this.findOne(query);
};

// Static method to get settings by category
SystemSettingsSchema.statics.getByCategory = function(category, includePrivate = false) {
  const query = { category };
  if (!includePrivate) {
    query.isPublic = true;
  }
  return this.find(query).sort({ key: 1 });
};

// Static method to get all public settings
SystemSettingsSchema.statics.getPublic = function() {
  return this.find({ isPublic: true }).sort({ category: 1, key: 1 });
};

// Static method to create or update setting
SystemSettingsSchema.statics.setValue = async function(category, key, value, options = {}) {
  const setting = await this.findOne({ category, key });
  
  if (setting) {
    setting.value = value;
    if (options.adminId) {
      setting.metadata.lastModifiedBy = options.adminId;
    }
    return setting.save();
  } else {
    const newSetting = new this({
      category,
      key,
      value,
      type: options.type || 'string',
      description: options.description,
      isPublic: options.isPublic || false,
      isEditable: options.isEditable !== false,
      validation: options.validation || {},
      metadata: {
        lastModifiedBy: options.adminId,
        tags: options.tags || [],
        dependencies: options.dependencies || []
      }
    });
    return newSetting.save();
  }
};

// Static method to get settings as object
SystemSettingsSchema.statics.getAsObject = async function(category = null, includePrivate = false) {
  const query = {};
  if (category) {
    query.category = category;
  }
  if (!includePrivate) {
    query.isPublic = true;
  }
  
  const settings = await this.find(query);
  const result = {};
  
  settings.forEach(setting => {
    if (!result[setting.category]) {
      result[setting.category] = {};
    }
    result[setting.category][setting.key] = setting.value;
  });
  
  return result;
};

// Static method to initialize default settings
SystemSettingsSchema.statics.initializeDefaults = async function() {
  const defaults = [
    // General Settings
    {
      category: 'general',
      key: 'site_name',
      value: 'Jobbaazar',
      type: 'string',
      description: 'Platform name',
      isPublic: true
    },
    {
      category: 'general',
      key: 'site_description',
      value: 'Connecting workers and employers',
      type: 'string',
      description: 'Platform description',
      isPublic: true
    },
    {
      category: 'general',
      key: 'maintenance_mode',
      value: false,
      type: 'boolean',
      description: 'Enable maintenance mode',
      isPublic: true
    },
    {
      category: 'general',
      key: 'max_file_size',
      value: 5242880, // 5MB
      type: 'number',
      description: 'Maximum file upload size in bytes',
      validation: { min: 1024, max: 52428800 }
    },
    
    // Security Settings
    {
      category: 'security',
      key: 'password_min_length',
      value: 8,
      type: 'number',
      description: 'Minimum password length',
      validation: { min: 6, max: 50 }
    },
    {
      category: 'security',
      key: 'session_timeout',
      value: 3600, // 1 hour
      type: 'number',
      description: 'Session timeout in seconds',
      validation: { min: 300, max: 86400 }
    },
    {
      category: 'security',
      key: 'max_login_attempts',
      value: 5,
      type: 'number',
      description: 'Maximum login attempts before lockout',
      validation: { min: 3, max: 10 }
    },
    {
      category: 'security',
      key: 'lockout_duration',
      value: 7200, // 2 hours
      type: 'number',
      description: 'Account lockout duration in seconds',
      validation: { min: 300, max: 86400 }
    },
    
    // Payment Settings
    {
      category: 'payment',
      key: 'currency',
      value: 'GBP',
      type: 'string',
      description: 'Default currency',
      isPublic: true,
      validation: { enum: ['GBP', 'USD', 'EUR'] }
    },
    {
      category: 'payment',
      key: 'platform_fee_percentage',
      value: 5,
      type: 'number',
      description: 'Platform fee percentage',
      validation: { min: 0, max: 20 }
    },
    {
      category: 'payment',
      key: 'minimum_withdrawal',
      value: 10,
      type: 'number',
      description: 'Minimum withdrawal amount',
      validation: { min: 1 }
    },
    {
      category: 'payment',
      key: 'payment_methods',
      value: ['bank_transfer', 'paypal', 'stripe'],
      type: 'array',
      description: 'Available payment methods',
      isPublic: true
    },
    
    // Notification Settings
    {
      category: 'notification',
      key: 'email_enabled',
      value: true,
      type: 'boolean',
      description: 'Enable email notifications'
    },
    {
      category: 'notification',
      key: 'push_enabled',
      value: true,
      type: 'boolean',
      description: 'Enable push notifications'
    },
    {
      category: 'notification',
      key: 'sms_enabled',
      value: false,
      type: 'boolean',
      description: 'Enable SMS notifications'
    },
    {
      category: 'notification',
      key: 'default_notification_preferences',
      value: {
        job_offers: true,
        messages: true,
        payments: true,
        reviews: true,
        system: true,
        marketing: false
      },
      type: 'object',
      description: 'Default notification preferences'
    },
    
    // Moderation Settings
    {
      category: 'moderation',
      key: 'auto_moderation_enabled',
      value: true,
      type: 'boolean',
      description: 'Enable automatic content moderation'
    },
    {
      category: 'moderation',
      key: 'moderation_threshold',
      value: 70,
      type: 'number',
      description: 'Auto-moderation threshold score',
      validation: { min: 0, max: 100 }
    },
    {
      category: 'moderation',
      key: 'content_approval_required',
      value: true,
      type: 'boolean',
      description: 'Require approval for new content'
    },
    {
      category: 'moderation',
      key: 'flagged_content_review_time',
      value: 24, // hours
      type: 'number',
      description: 'Time to review flagged content in hours',
      validation: { min: 1, max: 168 }
    },
    
    // Analytics Settings
    {
      category: 'analytics',
      key: 'tracking_enabled',
      value: true,
      type: 'boolean',
      description: 'Enable analytics tracking'
    },
    {
      category: 'analytics',
      key: 'data_retention_days',
      value: 365,
      type: 'number',
      description: 'Analytics data retention period in days',
      validation: { min: 30, max: 2555 }
    },
    {
      category: 'analytics',
      key: 'privacy_mode',
      value: false,
      type: 'boolean',
      description: 'Enable privacy mode for analytics'
    },
    
    // Localization Settings
    {
      category: 'localization',
      key: 'default_language',
      value: 'en',
      type: 'string',
      description: 'Default platform language',
      isPublic: true,
      validation: { enum: ['en', 'fa', 'ar', 'tr'] }
    },
    {
      category: 'localization',
      key: 'supported_languages',
      value: ['en', 'fa', 'ar', 'tr'],
      type: 'array',
      description: 'Supported languages',
      isPublic: true
    },
    {
      category: 'localization',
      key: 'timezone',
      value: 'Europe/London',
      type: 'string',
      description: 'Default timezone',
      isPublic: true
    },
    {
      category: 'localization',
      key: 'date_format',
      value: 'DD/MM/YYYY',
      type: 'string',
      description: 'Default date format',
      isPublic: true
    }
  ];
  
  for (const setting of defaults) {
    await this.setValue(setting.category, setting.key, setting.value, {
      type: setting.type,
      description: setting.description,
      isPublic: setting.isPublic || false,
      validation: setting.validation || {}
    });
  }
};

const SystemSettings = mongoose.model('SystemSettings', SystemSettingsSchema);

module.exports = SystemSettings; 
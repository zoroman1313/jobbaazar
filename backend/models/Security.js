const mongoose = require('mongoose');
const crypto = require('crypto');

const SecuritySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userType: {
    type: String,
    enum: ['worker', 'employer', 'admin'],
    required: true
  },
  twoFactor: {
    enabled: {
      type: Boolean,
      default: false
    },
    secret: {
      type: String,
      default: null
    },
    backupCodes: [{
      code: String,
      used: { type: Boolean, default: false },
      usedAt: Date
    }],
    lastVerified: {
      type: Date,
      default: null
    }
  },
  sessions: [{
    sessionId: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    },
    device: {
      type: String,
      default: 'Unknown'
    },
    browser: {
      type: String,
      default: 'Unknown'
    },
    ipAddress: {
      type: String,
      required: true
    },
    userAgent: {
      type: String,
      default: null
    },
    location: {
      country: String,
      city: String,
      timezone: String
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastActivity: {
      type: Date,
      default: Date.now
    },
    expiresAt: {
      type: Date,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  loginHistory: [{
    timestamp: {
      type: Date,
      default: Date.now
    },
    ipAddress: String,
    userAgent: String,
    device: String,
    browser: String,
    location: {
      country: String,
      city: String,
      timezone: String
    },
    success: {
      type: Boolean,
      required: true
    },
    failureReason: String,
    sessionId: String
  }],
  securitySettings: {
    passwordPolicy: {
      minLength: { type: Number, default: 8 },
      requireUppercase: { type: Boolean, default: true },
      requireLowercase: { type: Boolean, default: true },
      requireNumbers: { type: Boolean, default: true },
      requireSpecialChars: { type: Boolean, default: true },
      preventCommonPasswords: { type: Boolean, default: true }
    },
    sessionPolicy: {
      maxSessions: { type: Number, default: 5 },
      sessionTimeout: { type: Number, default: 3600 }, // seconds
      rememberMeDuration: { type: Number, default: 2592000 }, // 30 days
      forceLogoutOnPasswordChange: { type: Boolean, default: true }
    },
    loginPolicy: {
      maxLoginAttempts: { type: Number, default: 5 },
      lockoutDuration: { type: Number, default: 900 }, // 15 minutes
      requireCaptchaAfter: { type: Number, default: 3 },
      suspiciousActivityThreshold: { type: Number, default: 10 }
    },
    notificationSettings: {
      loginAlerts: { type: Boolean, default: true },
      passwordChangeAlerts: { type: Boolean, default: true },
      suspiciousActivityAlerts: { type: Boolean, default: true },
      newDeviceAlerts: { type: Boolean, default: true }
    }
  },
  securityEvents: [{
    type: {
      type: String,
      enum: [
        'login_success',
        'login_failure',
        'password_change',
        'password_reset',
        'two_factor_enabled',
        'two_factor_disabled',
        'session_created',
        'session_expired',
        'suspicious_activity',
        'account_locked',
        'account_unlocked',
        'device_added',
        'device_removed'
      ],
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    ipAddress: String,
    userAgent: String,
    device: String,
    location: {
      country: String,
      city: String,
      timezone: String
    },
    details: mongoose.Schema.Types.Mixed,
    riskScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  }],
  deviceTrust: [{
    deviceId: {
      type: String,
      required: true
    },
    deviceName: String,
    deviceType: String,
    browser: String,
    os: String,
    ipAddress: String,
    location: {
      country: String,
      city: String,
      timezone: String
    },
    isTrusted: {
      type: Boolean,
      default: false
    },
    trustLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low'
    },
    lastUsed: {
      type: Date,
      default: Date.now
    },
    firstSeen: {
      type: Date,
      default: Date.now
    },
    usageCount: {
      type: Number,
      default: 1
    }
  }],
  privacySettings: {
    dataSharing: {
      profileVisibility: {
        type: String,
        enum: ['public', 'contacts', 'private'],
        default: 'public'
      },
      allowSearch: { type: Boolean, default: true },
      allowContact: { type: Boolean, default: true },
      allowAnalytics: { type: Boolean, default: true },
      allowMarketing: { type: Boolean, default: false }
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    },
    dataRetention: {
      accountDeletion: {
        type: String,
        enum: ['immediate', '30_days', '90_days'],
        default: '30_days'
      },
      dataExport: { type: Boolean, default: true }
    }
  },
  compliance: {
    gdprConsent: {
      given: { type: Boolean, default: false },
      timestamp: Date,
      version: String,
      ipAddress: String
    },
    termsAccepted: {
      accepted: { type: Boolean, default: false },
      timestamp: Date,
      version: String,
      ipAddress: String
    },
    privacyPolicyAccepted: {
      accepted: { type: Boolean, default: false },
      timestamp: Date,
      version: String,
      ipAddress: String
    },
    cookieConsent: {
      given: { type: Boolean, default: false },
      timestamp: Date,
      preferences: {
        necessary: { type: Boolean, default: true },
        analytics: { type: Boolean, default: false },
        marketing: { type: Boolean, default: false }
      }
    }
  }
}, {
  timestamps: true
});

// Indexes for performance
SecuritySchema.index({ userId: 1, userType: 1 });
SecuritySchema.index({ 'sessions.sessionId': 1 });
SecuritySchema.index({ 'sessions.token': 1 });
SecuritySchema.index({ 'sessions.expiresAt': 1 });
SecuritySchema.index({ 'loginHistory.timestamp': -1 });
SecuritySchema.index({ 'securityEvents.timestamp': -1 });
SecuritySchema.index({ 'deviceTrust.deviceId': 1 });

// Virtual for active sessions count
SecuritySchema.virtual('activeSessionsCount').get(function() {
  return this.sessions.filter(session => session.isActive && session.expiresAt > new Date()).length;
});

// Virtual for trusted devices count
SecuritySchema.virtual('trustedDevicesCount').get(function() {
  return this.deviceTrust.filter(device => device.isTrusted).length;
});

// Pre-save middleware to clean expired sessions
SecuritySchema.pre('save', function(next) {
  const now = new Date();
  this.sessions = this.sessions.filter(session => session.expiresAt > now);
  next();
});

// Instance method to generate 2FA secret
SecuritySchema.methods.generateTwoFactorSecret = function() {
  const secret = crypto.randomBytes(20).toString('hex');
  this.twoFactor.secret = secret;
  
  // Generate backup codes
  const backupCodes = [];
  for (let i = 0; i < 10; i++) {
    backupCodes.push({
      code: crypto.randomBytes(4).toString('hex').toUpperCase(),
      used: false
    });
  }
  this.twoFactor.backupCodes = backupCodes;
  
  return secret;
};

// Instance method to create new session
SecuritySchema.methods.createSession = function(sessionData) {
  const sessionId = crypto.randomBytes(32).toString('hex');
  const token = crypto.randomBytes(64).toString('hex');
  
  const session = {
    sessionId,
    token,
    device: sessionData.device || 'Unknown',
    browser: sessionData.browser || 'Unknown',
    ipAddress: sessionData.ipAddress,
    userAgent: sessionData.userAgent,
    location: sessionData.location,
    expiresAt: new Date(Date.now() + (this.securitySettings.sessionPolicy.sessionTimeout * 1000)),
    createdAt: new Date()
  };
  
  this.sessions.push(session);
  
  // Limit active sessions
  if (this.sessions.length > this.securitySettings.sessionPolicy.maxSessions) {
    this.sessions.sort((a, b) => b.lastActivity - a.lastActivity);
    this.sessions = this.sessions.slice(0, this.securitySettings.sessionPolicy.maxSessions);
  }
  
  return { sessionId, token };
};

// Instance method to validate session
SecuritySchema.methods.validateSession = function(sessionId, token) {
  const session = this.sessions.find(s => 
    s.sessionId === sessionId && 
    s.token === token && 
    s.isActive && 
    s.expiresAt > new Date()
  );
  
  if (session) {
    session.lastActivity = new Date();
    return true;
  }
  
  return false;
};

// Instance method to revoke session
SecuritySchema.methods.revokeSession = function(sessionId) {
  const session = this.sessions.find(s => s.sessionId === sessionId);
  if (session) {
    session.isActive = false;
    return true;
  }
  return false;
};

// Instance method to revoke all sessions
SecuritySchema.methods.revokeAllSessions = function() {
  this.sessions.forEach(session => {
    session.isActive = false;
  });
};

// Instance method to add login attempt
SecuritySchema.methods.addLoginAttempt = function(attemptData) {
  this.loginHistory.push({
    timestamp: new Date(),
    ipAddress: attemptData.ipAddress,
    userAgent: attemptData.userAgent,
    device: attemptData.device,
    browser: attemptData.browser,
    location: attemptData.location,
    success: attemptData.success,
    failureReason: attemptData.failureReason,
    sessionId: attemptData.sessionId
  });
  
  // Keep only last 100 login attempts
  if (this.loginHistory.length > 100) {
    this.loginHistory = this.loginHistory.slice(-100);
  }
};

// Instance method to add security event
SecuritySchema.methods.addSecurityEvent = function(eventData) {
  this.securityEvents.push({
    type: eventData.type,
    timestamp: new Date(),
    ipAddress: eventData.ipAddress,
    userAgent: eventData.userAgent,
    device: eventData.device,
    location: eventData.location,
    details: eventData.details,
    riskScore: eventData.riskScore || 0
  });
  
  // Keep only last 1000 security events
  if (this.securityEvents.length > 1000) {
    this.securityEvents = this.securityEvents.slice(-1000);
  }
};

// Instance method to trust device
SecuritySchema.methods.trustDevice = function(deviceData) {
  const existingDevice = this.deviceTrust.find(d => d.deviceId === deviceData.deviceId);
  
  if (existingDevice) {
    existingDevice.isTrusted = true;
    existingDevice.trustLevel = deviceData.trustLevel || 'high';
    existingDevice.lastUsed = new Date();
    existingDevice.usageCount += 1;
  } else {
    this.deviceTrust.push({
      deviceId: deviceData.deviceId,
      deviceName: deviceData.deviceName,
      deviceType: deviceData.deviceType,
      browser: deviceData.browser,
      os: deviceData.os,
      ipAddress: deviceData.ipAddress,
      location: deviceData.location,
      isTrusted: true,
      trustLevel: deviceData.trustLevel || 'medium',
      lastUsed: new Date(),
      firstSeen: new Date(),
      usageCount: 1
    });
  }
};

// Static method to get security by user
SecuritySchema.statics.getByUser = function(userId, userType) {
  return this.findOne({ userId, userType });
};

// Static method to create security record
SecuritySchema.statics.createSecurity = async function(userId, userType) {
  const security = new this({ userId, userType });
  await security.save();
  return security;
};

const Security = mongoose.model('Security', SecuritySchema);

module.exports = Security; 
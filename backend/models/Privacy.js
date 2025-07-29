const mongoose = require('mongoose');

const PrivacySchema = new mongoose.Schema({
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
  dataConsent: {
    personalData: {
      consent: { type: Boolean, default: false },
      timestamp: Date,
      version: String,
      ipAddress: String,
      userAgent: String,
      withdrawalTimestamp: Date
    },
    marketingData: {
      consent: { type: Boolean, default: false },
      timestamp: Date,
      version: String,
      ipAddress: String,
      userAgent: String,
      withdrawalTimestamp: Date,
      channels: {
        email: { type: Boolean, default: false },
        sms: { type: Boolean, default: false },
        push: { type: Boolean, default: false },
        phone: { type: Boolean, default: false }
      }
    },
    analyticsData: {
      consent: { type: Boolean, default: false },
      timestamp: Date,
      version: String,
      ipAddress: String,
      userAgent: String,
      withdrawalTimestamp: Date,
      providers: [{
        name: String,
        purpose: String,
        consent: { type: Boolean, default: false }
      }]
    },
    thirdPartyData: {
      consent: { type: Boolean, default: false },
      timestamp: Date,
      version: String,
      ipAddress: String,
      userAgent: String,
      withdrawalTimestamp: Date,
      partners: [{
        name: String,
        purpose: String,
        dataTypes: [String],
        consent: { type: Boolean, default: false }
      }]
    }
  },
  dataRights: {
    rightToAccess: {
      requested: { type: Boolean, default: false },
      requestDate: Date,
      fulfilledDate: Date,
      dataProvided: Boolean,
      notes: String
    },
    rightToRectification: {
      requested: { type: Boolean, default: false },
      requestDate: Date,
      fulfilledDate: Date,
      fieldsUpdated: [String],
      notes: String
    },
    rightToErasure: {
      requested: { type: Boolean, default: false },
      requestDate: Date,
      fulfilledDate: Date,
      dataDeleted: Boolean,
      notes: String
    },
    rightToPortability: {
      requested: { type: Boolean, default: false },
      requestDate: Date,
      fulfilledDate: Date,
      dataExported: Boolean,
      format: String,
      notes: String
    },
    rightToRestriction: {
      requested: { type: Boolean, default: false },
      requestDate: Date,
      fulfilledDate: Date,
      restrictionsApplied: [String],
      notes: String
    },
    rightToObject: {
      requested: { type: Boolean, default: false },
      requestDate: Date,
      fulfilledDate: Date,
      objectionsApplied: [String],
      notes: String
    }
  },
  dataProcessing: {
    purposes: [{
      purpose: {
        type: String,
        enum: [
          'account_management',
          'job_matching',
          'communication',
          'payment_processing',
          'analytics',
          'marketing',
          'security',
          'compliance',
          'customer_support',
          'research'
        ],
        required: true
      },
      legalBasis: {
        type: String,
        enum: ['consent', 'contract', 'legitimate_interest', 'legal_obligation', 'vital_interests'],
        required: true
      },
      consent: { type: Boolean, default: false },
      timestamp: Date,
      withdrawalTimestamp: Date
    }],
    dataCategories: [{
      category: {
        type: String,
        enum: [
          'personal_identifiers',
          'contact_information',
          'professional_data',
          'financial_data',
          'location_data',
          'usage_data',
          'technical_data',
          'preferences',
          'communications',
          'biometric_data'
        ],
        required: true
      },
      purpose: String,
      retentionPeriod: Number, // days
      consent: { type: Boolean, default: false },
      timestamp: Date
    }],
    dataRetention: {
      accountData: {
        retentionPeriod: { type: Number, default: 2555 }, // 7 years
        deletionDate: Date,
        autoDelete: { type: Boolean, default: true }
      },
      activityData: {
        retentionPeriod: { type: Number, default: 1095 }, // 3 years
        deletionDate: Date,
        autoDelete: { type: Boolean, default: true }
      },
      communicationData: {
        retentionPeriod: { type: Number, default: 730 }, // 2 years
        deletionDate: Date,
        autoDelete: { type: Boolean, default: true }
      },
      analyticsData: {
        retentionPeriod: { type: Number, default: 365 }, // 1 year
        deletionDate: Date,
        autoDelete: { type: Boolean, default: true }
      }
    }
  },
  privacySettings: {
    profileVisibility: {
      type: String,
      enum: ['public', 'contacts', 'private'],
      default: 'public'
    },
    searchVisibility: {
      type: String,
      enum: ['public', 'contacts', 'private'],
      default: 'public'
    },
    contactVisibility: {
      type: String,
      enum: ['public', 'contacts', 'private'],
      default: 'public'
    },
    activityVisibility: {
      type: String,
      enum: ['public', 'contacts', 'private'],
      default: 'public'
    },
    dataSharing: {
      allowProfileView: { type: Boolean, default: true },
      allowContact: { type: Boolean, default: true },
      allowSearch: { type: Boolean, default: true },
      allowAnalytics: { type: Boolean, default: true },
      allowMarketing: { type: Boolean, default: false },
      allowThirdParty: { type: Boolean, default: false }
    },
    notificationPreferences: {
      email: {
        account: { type: Boolean, default: true },
        jobs: { type: Boolean, default: true },
        messages: { type: Boolean, default: true },
        payments: { type: Boolean, default: true },
        marketing: { type: Boolean, default: false },
        security: { type: Boolean, default: true }
      },
      push: {
        account: { type: Boolean, default: true },
        jobs: { type: Boolean, default: true },
        messages: { type: Boolean, default: true },
        payments: { type: Boolean, default: true },
        marketing: { type: Boolean, default: false },
        security: { type: Boolean, default: true }
      },
      sms: {
        account: { type: Boolean, default: false },
        jobs: { type: Boolean, default: false },
        messages: { type: Boolean, default: false },
        payments: { type: Boolean, default: false },
        marketing: { type: Boolean, default: false },
        security: { type: Boolean, default: false }
      }
    }
  },
  cookiePreferences: {
    necessary: { type: Boolean, default: true },
    functional: { type: Boolean, default: false },
    analytics: { type: Boolean, default: false },
    marketing: { type: Boolean, default: false },
    timestamp: Date,
    ipAddress: String,
    userAgent: String
  },
  dataBreachNotifications: [{
    breachId: String,
    type: {
      type: String,
      enum: ['personal_data', 'financial_data', 'credentials', 'other'],
      required: true
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      required: true
    },
    description: String,
    affectedData: [String],
    notificationDate: { type: Date, default: Date.now },
    readDate: Date,
    actionRequired: { type: Boolean, default: false },
    actionTaken: { type: Boolean, default: false }
  }],
  privacyRequests: [{
    requestId: String,
    type: {
      type: String,
      enum: ['access', 'rectification', 'erasure', 'portability', 'restriction', 'objection'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'rejected'],
      default: 'pending'
    },
    requestDate: { type: Date, default: Date.now },
    dueDate: Date,
    completedDate: Date,
    description: String,
    requestedData: [String],
    response: String,
    notes: String,
    verificationMethod: String,
    verificationCompleted: { type: Boolean, default: false }
  }],
  dataExportHistory: [{
    exportId: String,
    requestDate: { type: Date, default: Date.now },
    completedDate: Date,
    format: {
      type: String,
      enum: ['json', 'csv', 'xml', 'pdf'],
      default: 'json'
    },
    dataCategories: [String],
    fileSize: Number,
    downloadUrl: String,
    expiresAt: Date,
    downloaded: { type: Boolean, default: false },
    downloadCount: { type: Number, default: 0 }
  }],
  complianceLog: [{
    action: {
      type: String,
      enum: [
        'consent_given',
        'consent_withdrawn',
        'data_requested',
        'data_exported',
        'data_deleted',
        'settings_updated',
        'breach_notified',
        'privacy_policy_accepted',
        'terms_accepted',
        'cookies_accepted'
      ],
      required: true
    },
    timestamp: { type: Date, default: Date.now },
    ipAddress: String,
    userAgent: String,
    details: mongoose.Schema.Types.Mixed,
    complianceStatus: {
      type: String,
      enum: ['compliant', 'non_compliant', 'pending'],
      default: 'compliant'
    }
  }]
}, {
  timestamps: true
});

// Indexes for performance
PrivacySchema.index({ userId: 1, userType: 1 });
PrivacySchema.index({ 'dataConsent.personalData.consent': 1 });
PrivacySchema.index({ 'dataConsent.marketingData.consent': 1 });
PrivacySchema.index({ 'dataRights.rightToErasure.requested': 1 });
PrivacySchema.index({ 'privacyRequests.status': 1 });
PrivacySchema.index({ 'complianceLog.timestamp': -1 });

// Virtual for active consent status
PrivacySchema.virtual('hasActiveConsent').get(function() {
  return this.dataConsent.personalData.consent && 
         !this.dataConsent.personalData.withdrawalTimestamp;
});

// Virtual for pending privacy requests
PrivacySchema.virtual('pendingRequests').get(function() {
  return this.privacyRequests.filter(req => req.status === 'pending').length;
});

// Pre-save middleware to update deletion dates
PrivacySchema.pre('save', function(next) {
  if (this.isModified('dataProcessing.dataRetention')) {
    const retention = this.dataProcessing.dataRetention;
    const now = new Date();
    
    if (retention.accountData.retentionPeriod) {
      retention.accountData.deletionDate = new Date(now.getTime() + (retention.accountData.retentionPeriod * 24 * 60 * 60 * 1000));
    }
    if (retention.activityData.retentionPeriod) {
      retention.activityData.deletionDate = new Date(now.getTime() + (retention.activityData.retentionPeriod * 24 * 60 * 60 * 1000));
    }
    if (retention.communicationData.retentionPeriod) {
      retention.communicationData.deletionDate = new Date(now.getTime() + (retention.communicationData.retentionPeriod * 24 * 60 * 60 * 1000));
    }
    if (retention.analyticsData.retentionPeriod) {
      retention.analyticsData.deletionDate = new Date(now.getTime() + (retention.analyticsData.retentionPeriod * 24 * 60 * 60 * 1000));
    }
  }
  next();
});

// Instance method to give consent
PrivacySchema.methods.giveConsent = function(consentType, consentData) {
  const consent = this.dataConsent[consentType];
  if (consent) {
    consent.consent = true;
    consent.timestamp = new Date();
    consent.version = consentData.version;
    consent.ipAddress = consentData.ipAddress;
    consent.userAgent = consentData.userAgent;
    
    if (consentData.channels) {
      consent.channels = { ...consent.channels, ...consentData.channels };
    }
    
    // Add to compliance log
    this.complianceLog.push({
      action: 'consent_given',
      timestamp: new Date(),
      ipAddress: consentData.ipAddress,
      userAgent: consentData.userAgent,
      details: { consentType, version: consentData.version }
    });
  }
};

// Instance method to withdraw consent
PrivacySchema.methods.withdrawConsent = function(consentType, withdrawalData) {
  const consent = this.dataConsent[consentType];
  if (consent && consent.consent) {
    consent.consent = false;
    consent.withdrawalTimestamp = new Date();
    
    // Add to compliance log
    this.complianceLog.push({
      action: 'consent_withdrawn',
      timestamp: new Date(),
      ipAddress: withdrawalData.ipAddress,
      userAgent: withdrawalData.userAgent,
      details: { consentType }
    });
  }
};

// Instance method to create privacy request
PrivacySchema.methods.createPrivacyRequest = function(requestData) {
  const request = {
    requestId: `PR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: requestData.type,
    description: requestData.description,
    requestedData: requestData.requestedData || [],
    verificationMethod: requestData.verificationMethod,
    dueDate: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)) // 30 days
  };
  
  this.privacyRequests.push(request);
  
  // Add to compliance log
  this.complianceLog.push({
    action: `data_${requestData.type}`,
    timestamp: new Date(),
    ipAddress: requestData.ipAddress,
    userAgent: requestData.userAgent,
    details: { requestId: request.requestId, type: requestData.type }
  });
  
  return request;
};

// Instance method to create data export
PrivacySchema.methods.createDataExport = function(exportData) {
  const exportRecord = {
    exportId: `EX-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    format: exportData.format || 'json',
    dataCategories: exportData.dataCategories || [],
    expiresAt: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)) // 7 days
  };
  
  this.dataExportHistory.push(exportRecord);
  
  // Add to compliance log
  this.complianceLog.push({
    action: 'data_exported',
    timestamp: new Date(),
    ipAddress: exportData.ipAddress,
    userAgent: exportData.userAgent,
    details: { exportId: exportRecord.exportId, format: exportData.format }
  });
  
  return exportRecord;
};

// Instance method to add data breach notification
PrivacySchema.methods.addBreachNotification = function(breachData) {
  const notification = {
    breachId: `BR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: breachData.type,
    severity: breachData.severity,
    description: breachData.description,
    affectedData: breachData.affectedData || [],
    actionRequired: breachData.actionRequired || false
  };
  
  this.dataBreachNotifications.push(notification);
  
  // Add to compliance log
  this.complianceLog.push({
    action: 'breach_notified',
    timestamp: new Date(),
    details: { breachId: notification.breachId, severity: breachData.severity }
  });
  
  return notification;
};

// Instance method to update privacy settings
PrivacySchema.methods.updatePrivacySettings = function(settingsData) {
  Object.assign(this.privacySettings, settingsData);
  
  // Add to compliance log
  this.complianceLog.push({
    action: 'settings_updated',
    timestamp: new Date(),
    ipAddress: settingsData.ipAddress,
    userAgent: settingsData.userAgent,
    details: { updatedFields: Object.keys(settingsData) }
  });
};

// Static method to get privacy by user
PrivacySchema.statics.getByUser = function(userId, userType) {
  return this.findOne({ userId, userType });
};

// Static method to create privacy record
PrivacySchema.statics.createPrivacy = async function(userId, userType) {
  const privacy = new this({ userId, userType });
  await privacy.save();
  return privacy;
};

// Static method to get users with expired data
PrivacySchema.statics.getExpiredDataUsers = function() {
  const now = new Date();
  return this.find({
    $or: [
      { 'dataProcessing.dataRetention.accountData.deletionDate': { $lte: now } },
      { 'dataProcessing.dataRetention.activityData.deletionDate': { $lte: now } },
      { 'dataProcessing.dataRetention.communicationData.deletionDate': { $lte: now } },
      { 'dataProcessing.dataRetention.analyticsData.deletionDate': { $lte: now } }
    ]
  });
};

const Privacy = mongoose.model('Privacy', PrivacySchema);

module.exports = Privacy; 
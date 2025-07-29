const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'moderator', 'support'],
    default: 'admin'
  },
  permissions: {
    users: {
      view: { type: Boolean, default: true },
      create: { type: Boolean, default: false },
      edit: { type: Boolean, default: false },
      delete: { type: Boolean, default: false },
      ban: { type: Boolean, default: false }
    },
    jobs: {
      view: { type: Boolean, default: true },
      approve: { type: Boolean, default: true },
      reject: { type: Boolean, default: true },
      delete: { type: Boolean, default: false }
    },
    products: {
      view: { type: Boolean, default: true },
      approve: { type: Boolean, default: true },
      reject: { type: Boolean, default: true },
      delete: { type: Boolean, default: false }
    },
    reviews: {
      view: { type: Boolean, default: true },
      moderate: { type: Boolean, default: true },
      delete: { type: Boolean, default: false }
    },
    analytics: {
      view: { type: Boolean, default: true },
      export: { type: Boolean, default: false }
    },
    settings: {
      view: { type: Boolean, default: false },
      edit: { type: Boolean, default: false }
    }
  },
  profile: {
    avatar: {
      type: String,
      default: null
    },
    phone: {
      type: String,
      default: null
    },
    department: {
      type: String,
      default: 'General'
    },
    bio: {
      type: String,
      maxlength: 500,
      default: null
    }
  },
  security: {
    twoFactorEnabled: {
      type: Boolean,
      default: false
    },
    twoFactorSecret: {
      type: String,
      default: null
    },
    lastPasswordChange: {
      type: Date,
      default: Date.now
    },
    passwordResetToken: {
      type: String,
      default: null
    },
    passwordResetExpires: {
      type: Date,
      default: null
    },
    loginAttempts: {
      type: Number,
      default: 0
    },
    lockUntil: {
      type: Date,
      default: null
    }
  },
  activity: {
    lastLogin: {
      type: Date,
      default: null
    },
    lastActivity: {
      type: Date,
      default: Date.now
    },
    loginCount: {
      type: Number,
      default: 0
    },
    sessions: [{
      sessionId: String,
      ipAddress: String,
      userAgent: String,
      createdAt: { type: Date, default: Date.now },
      lastActivity: { type: Date, default: Date.now }
    }]
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  preferences: {
    language: {
      type: String,
      default: 'en'
    },
    timezone: {
      type: String,
      default: 'UTC'
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    },
    dashboard: {
      layout: { type: String, default: 'default' },
      widgets: [{ type: String }]
    }
  }
}, {
  timestamps: true
});

// Indexes for performance
AdminSchema.index({ username: 1 });
AdminSchema.index({ email: 1 });
AdminSchema.index({ role: 1 });
AdminSchema.index({ status: 1 });
AdminSchema.index({ 'activity.lastLogin': -1 });
AdminSchema.index({ createdAt: -1 });

// Virtual for full name
AdminSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for isLocked
AdminSchema.virtual('isLocked').get(function() {
  return !!(this.security.lockUntil && this.security.lockUntil > Date.now());
});

// Pre-save middleware to hash password
AdminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware to update lastPasswordChange
AdminSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    this.security.lastPasswordChange = new Date();
  }
  next();
});

// Instance method to compare password
AdminSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Instance method to increment login attempts
AdminSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.security.lockUntil && this.security.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { 'security.lockUntil': 1 },
      $set: { 'security.loginAttempts': 1 }
    });
  }
  
  const updates = { $inc: { 'security.loginAttempts': 1 } };
  
  // Lock account after 5 failed attempts
  if (this.security.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { 'security.lockUntil': Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  return this.updateOne(updates);
};

// Instance method to reset login attempts
AdminSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { 'security.loginAttempts': 1, 'security.lockUntil': 1 }
  });
};

// Instance method to check permissions
AdminSchema.methods.hasPermission = function(resource, action) {
  if (this.role === 'super_admin') return true;
  
  const resourcePermissions = this.permissions[resource];
  if (!resourcePermissions) return false;
  
  return resourcePermissions[action] || false;
};

// Instance method to check role
AdminSchema.methods.hasRole = function(role) {
  if (this.role === 'super_admin') return true;
  return this.role === role;
};

// Static method to find by credentials
AdminSchema.statics.findByCredentials = async function(username, password) {
  const admin = await this.findOne({
    $or: [{ username }, { email: username }],
    status: 'active'
  });
  
  if (!admin) {
    throw new Error('Invalid credentials');
  }
  
  if (admin.isLocked) {
    throw new Error('Account is locked. Please try again later.');
  }
  
  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    await admin.incLoginAttempts();
    throw new Error('Invalid credentials');
  }
  
  // Reset login attempts on successful login
  await admin.resetLoginAttempts();
  
  return admin;
};

// Static method to create admin
AdminSchema.statics.createAdmin = async function(adminData) {
  const admin = new this(adminData);
  await admin.save();
  return admin;
};

// Static method to get admins by role
AdminSchema.statics.getByRole = function(role) {
  return this.find({ role, status: 'active' }).select('-password');
};

// Static method to get active admins
AdminSchema.statics.getActive = function() {
  return this.find({ status: 'active' }).select('-password');
};

const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin; 
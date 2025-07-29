const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['deposit', 'withdrawal', 'payment', 'refund', 'transfer']
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'GBP',
    enum: ['GBP', 'USD', 'EUR']
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  description: {
    type: String,
    required: true
  },
  reference: {
    type: String,
    unique: true
  },
  relatedProduct: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  relatedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'bank_transfer', 'paypal', 'wallet_balance']
  },
  fees: {
    type: Number,
    default: 0
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
});

const WalletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  balance: {
    type: Number,
    default: 0,
    min: 0
  },
  currency: {
    type: String,
    default: 'GBP',
    enum: ['GBP', 'USD', 'EUR']
  },
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'suspended', 'closed']
  },
  transactions: [TransactionSchema],
  settings: {
    autoRecharge: {
      enabled: { type: Boolean, default: false },
      threshold: { type: Number, default: 10 },
      amount: { type: Number, default: 50 }
    },
    notifications: {
      lowBalance: { type: Boolean, default: true },
      transactionComplete: { type: Boolean, default: true },
      paymentReceived: { type: Boolean, default: true }
    },
    limits: {
      dailySpend: { type: Number, default: 1000 },
      monthlySpend: { type: Number, default: 5000 },
      maxBalance: { type: Number, default: 10000 }
    }
  },
  security: {
    pin: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 6
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false
    },
    lastLogin: {
      type: Date
    },
    loginAttempts: {
      type: Number,
      default: 0
    },
    lockedUntil: {
      type: Date
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
WalletSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Generate unique reference for transactions
TransactionSchema.pre('save', function(next) {
  if (!this.reference) {
    this.reference = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
  }
  next();
});

// Update wallet balance when transaction is completed
TransactionSchema.post('save', async function(doc) {
  if (doc.status === 'completed') {
    const wallet = await mongoose.model('Wallet').findOne({ user: doc.relatedUser });
    if (wallet) {
      if (doc.type === 'deposit' || doc.type === 'payment') {
        wallet.balance += doc.amount;
      } else if (doc.type === 'withdrawal' || doc.type === 'transfer') {
        wallet.balance -= doc.amount;
      }
      await wallet.save();
    }
  }
});

// Create indexes for better performance
WalletSchema.index({ user: 1 });
WalletSchema.index({ 'transactions.reference': 1 });
WalletSchema.index({ 'transactions.createdAt': -1 });
WalletSchema.index({ 'transactions.status': 1 });

module.exports = mongoose.model('Wallet', WalletSchema); 
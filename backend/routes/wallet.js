const express = require('express');
const router = express.Router();
const Wallet = require('../models/Wallet');
const Product = require('../models/Product');

// Get wallet balance and basic info
router.get('/balance', async (req, res) => {
  try {
    // TODO: Get user ID from authenticated user
    const userId = req.query.userId || '507f1f77bcf86cd799439011';

    let wallet = await Wallet.findOne({ user: userId });
    
    if (!wallet) {
      // Create new wallet for user
      wallet = new Wallet({
        user: userId,
        pin: '1234', // Default PIN - should be set by user
        balance: 0
      });
      await wallet.save();
    }

    res.json({
      balance: wallet.balance,
      currency: wallet.currency,
      status: wallet.status,
      lastUpdated: wallet.updatedAt
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get transaction history
router.get('/transactions', async (req, res) => {
  try {
    const userId = req.query.userId || '507f1f77bcf86cd799439011';
    const { page = 1, limit = 20, type, status } = req.query;

    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    let transactions = wallet.transactions;

    // Apply filters
    if (type) {
      transactions = transactions.filter(t => t.type === type);
    }
    if (status) {
      transactions = transactions.filter(t => t.status === status);
    }

    // Sort by date (newest first)
    transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Apply pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginatedTransactions = transactions.slice(skip, skip + parseInt(limit));

    res.json({
      transactions: paginatedTransactions,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(transactions.length / parseInt(limit)),
        hasNext: skip + paginatedTransactions.length < transactions.length,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Deposit money to wallet
router.post('/deposit', async (req, res) => {
  try {
    const { amount, paymentMethod, userId } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const wallet = await Wallet.findOne({ user: userId || '507f1f77bcf86cd799439011' });
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    // Create deposit transaction
    const transaction = {
      type: 'deposit',
      amount: parseFloat(amount),
      currency: wallet.currency,
      status: 'pending',
      description: `Deposit of ${amount} ${wallet.currency}`,
      paymentMethod: paymentMethod || 'card',
      relatedUser: wallet.user
    };

    wallet.transactions.push(transaction);
    await wallet.save();

    // TODO: Integrate with payment gateway (Stripe, PayPal, etc.)
    // For now, simulate successful payment
    setTimeout(async () => {
      const latestTransaction = wallet.transactions[wallet.transactions.length - 1];
      latestTransaction.status = 'completed';
      latestTransaction.completedAt = new Date();
      wallet.balance += parseFloat(amount);
      await wallet.save();
    }, 2000);

    res.json({
      message: 'Deposit initiated successfully',
      transaction: transaction,
      newBalance: wallet.balance
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Withdraw money from wallet
router.post('/withdraw', async (req, res) => {
  try {
    const { amount, withdrawalMethod, accountDetails, userId } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const wallet = await Wallet.findOne({ user: userId || '507f1f77bcf86cd799439011' });
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    if (wallet.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Create withdrawal transaction
    const transaction = {
      type: 'withdrawal',
      amount: parseFloat(amount),
      currency: wallet.currency,
      status: 'pending',
      description: `Withdrawal of ${amount} ${wallet.currency}`,
      paymentMethod: withdrawalMethod || 'bank_transfer',
      relatedUser: wallet.user,
      metadata: { accountDetails }
    };

    wallet.transactions.push(transaction);
    await wallet.save();

    // TODO: Integrate with bank transfer service
    // For now, simulate successful withdrawal
    setTimeout(async () => {
      const latestTransaction = wallet.transactions[wallet.transactions.length - 1];
      latestTransaction.status = 'completed';
      latestTransaction.completedAt = new Date();
      wallet.balance -= parseFloat(amount);
      await wallet.save();
    }, 3000);

    res.json({
      message: 'Withdrawal initiated successfully',
      transaction: transaction,
      newBalance: wallet.balance
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Make payment for a product
router.post('/pay', async (req, res) => {
  try {
    const { productId, amount, userId } = req.body;
    
    if (!productId || !amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid product or amount' });
    }

    const wallet = await Wallet.findOne({ user: userId || '507f1f77bcf86cd799439011' });
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (wallet.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Create payment transaction
    const transaction = {
      type: 'payment',
      amount: parseFloat(amount),
      currency: wallet.currency,
      status: 'pending',
      description: `Payment for ${product.title}`,
      paymentMethod: 'wallet_balance',
      relatedUser: wallet.user,
      relatedProduct: productId
    };

    wallet.transactions.push(transaction);
    await wallet.save();

    // TODO: Update product status and notify seller
    // For now, simulate successful payment
    setTimeout(async () => {
      const latestTransaction = wallet.transactions[wallet.transactions.length - 1];
      latestTransaction.status = 'completed';
      latestTransaction.completedAt = new Date();
      wallet.balance -= parseFloat(amount);
      await wallet.save();

      // Update product status
      product.status = 'sold';
      await product.save();
    }, 2000);

    res.json({
      message: 'Payment initiated successfully',
      transaction: transaction,
      newBalance: wallet.balance,
      product: {
        id: product._id,
        title: product.title,
        status: 'processing'
      }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get transaction by reference
router.get('/transaction/:reference', async (req, res) => {
  try {
    const { reference } = req.params;
    const userId = req.query.userId || '507f1f77bcf86cd799439011';

    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    const transaction = wallet.transactions.find(t => t.reference === reference);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update wallet settings
router.put('/settings', async (req, res) => {
  try {
    const { settings, userId } = req.body;

    const wallet = await Wallet.findOne({ user: userId || '507f1f77bcf86cd799439011' });
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    if (settings.autoRecharge) {
      wallet.settings.autoRecharge = { ...wallet.settings.autoRecharge, ...settings.autoRecharge };
    }
    if (settings.notifications) {
      wallet.settings.notifications = { ...wallet.settings.notifications, ...settings.notifications };
    }
    if (settings.limits) {
      wallet.settings.limits = { ...wallet.settings.limits, ...settings.limits };
    }

    await wallet.save();
    res.json({ message: 'Settings updated successfully', settings: wallet.settings });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update wallet PIN
router.put('/pin', async (req, res) => {
  try {
    const { currentPin, newPin, userId } = req.body;

    if (!currentPin || !newPin) {
      return res.status(400).json({ error: 'Current PIN and new PIN are required' });
    }

    if (newPin.length < 4 || newPin.length > 6) {
      return res.status(400).json({ error: 'PIN must be 4-6 digits' });
    }

    const wallet = await Wallet.findOne({ user: userId || '507f1f77bcf86cd799439011' });
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    if (wallet.security.pin !== currentPin) {
      return res.status(400).json({ error: 'Current PIN is incorrect' });
    }

    wallet.security.pin = newPin;
    await wallet.save();

    res.json({ message: 'PIN updated successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get wallet statistics
router.get('/stats', async (req, res) => {
  try {
    const userId = req.query.userId || '507f1f77bcf86cd799439011';

    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisYear = new Date(now.getFullYear(), 0, 1);

    const monthlyTransactions = wallet.transactions.filter(t => 
      new Date(t.createdAt) >= thisMonth
    );

    const yearlyTransactions = wallet.transactions.filter(t => 
      new Date(t.createdAt) >= thisYear
    );

    const stats = {
      totalBalance: wallet.balance,
      totalTransactions: wallet.transactions.length,
      monthlyTransactions: monthlyTransactions.length,
      yearlyTransactions: yearlyTransactions.length,
      monthlySpent: monthlyTransactions
        .filter(t => t.type === 'payment' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0),
      monthlyReceived: monthlyTransactions
        .filter(t => t.type === 'deposit' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0),
      pendingTransactions: wallet.transactions.filter(t => t.status === 'pending').length
    };

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 
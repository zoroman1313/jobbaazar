const express = require('express');
const router = express.Router();
const Security = require('../models/Security');
const Privacy = require('../models/Privacy');
const Worker = require('../models/Worker');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const { 
  authenticateToken, 
  deviceFingerprint, 
  generateToken,
  loginLimiter,
  apiLimiter 
} = require('../middleware/security');

// Mock user ID for testing (in real app, get from JWT token)
const mockUserId = '507f1f77bcf86cd799439011';

// Get Security Settings
router.get('/settings', authenticateToken, async (req, res) => {
  try {
    const security = await Security.getByUser(req.user.id, req.user.type);
    
    if (!security) {
      return res.status(404).json({
        success: false,
        message: 'Security settings not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        twoFactor: {
          enabled: security.twoFactor.enabled,
          lastVerified: security.twoFactor.lastVerified
        },
        securitySettings: security.securitySettings,
        activeSessions: security.activeSessionsCount,
        trustedDevices: security.trustedDevicesCount
      }
    });
  } catch (error) {
    console.error('Get security settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get security settings',
      error: error.message
    });
  }
});

// Update Security Settings
router.put('/settings', authenticateToken, async (req, res) => {
  try {
    const { securitySettings } = req.body;
    
    const security = await Security.getByUser(req.user.id, req.user.type);
    if (!security) {
      return res.status(404).json({
        success: false,
        message: 'Security settings not found'
      });
    }
    
    if (securitySettings) {
      Object.assign(security.securitySettings, securitySettings);
    }
    
    await security.save();
    
    res.json({
      success: true,
      message: 'Security settings updated successfully',
      data: { securitySettings: security.securitySettings }
    });
  } catch (error) {
    console.error('Update security settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update security settings',
      error: error.message
    });
  }
});

// Setup 2FA
router.post('/2fa/setup', authenticateToken, async (req, res) => {
  try {
    const security = await Security.getByUser(req.user.id, req.user.type);
    if (!security) {
      return res.status(404).json({
        success: false,
        message: 'Security settings not found'
      });
    }
    
    if (security.twoFactor.enabled) {
      return res.status(400).json({
        success: false,
        message: '2FA is already enabled'
      });
    }
    
    // Generate secret
    const secret = security.generateTwoFactorSecret();
    
    // Generate QR code
    const otpauthUrl = speakeasy.otpauthURL({
      secret: secret,
      label: 'Jobbaazar',
      issuer: 'Jobbaazar',
      algorithm: 'sha1'
    });
    
    const qrCode = await QRCode.toDataURL(otpauthUrl);
    
    await security.save();
    
    res.json({
      success: true,
      message: '2FA setup initiated',
      data: {
        secret,
        qrCode,
        backupCodes: security.twoFactor.backupCodes.map(code => code.code)
      }
    });
  } catch (error) {
    console.error('Setup 2FA error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to setup 2FA',
      error: error.message
    });
  }
});

// Verify 2FA Setup
router.post('/2fa/verify', authenticateToken, async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required'
      });
    }
    
    const security = await Security.getByUser(req.user.id, req.user.type);
    if (!security) {
      return res.status(404).json({
        success: false,
        message: 'Security settings not found'
      });
    }
    
    if (!security.twoFactor.secret) {
      return res.status(400).json({
        success: false,
        message: '2FA not set up'
      });
    }
    
    // Verify token
    const verified = speakeasy.totp.verify({
      secret: security.twoFactor.secret,
      encoding: 'hex',
      token: token,
      window: 2
    });
    
    if (!verified) {
      return res.status(400).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    // Enable 2FA
    security.twoFactor.enabled = true;
    security.twoFactor.lastVerified = new Date();
    
    await security.save();
    
    res.json({
      success: true,
      message: '2FA enabled successfully'
    });
  } catch (error) {
    console.error('Verify 2FA error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify 2FA',
      error: error.message
    });
  }
});

// Disable 2FA
router.post('/2fa/disable', authenticateToken, async (req, res) => {
  try {
    const { token } = req.body;
    
    const security = await Security.getByUser(req.user.id, req.user.type);
    if (!security) {
      return res.status(404).json({
        success: false,
        message: 'Security settings not found'
      });
    }
    
    if (!security.twoFactor.enabled) {
      return res.status(400).json({
        success: false,
        message: '2FA is not enabled'
      });
    }
    
    // Verify token before disabling
    const verified = speakeasy.totp.verify({
      secret: security.twoFactor.secret,
      encoding: 'hex',
      token: token,
      window: 2
    });
    
    if (!verified) {
      return res.status(400).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    // Disable 2FA
    security.twoFactor.enabled = false;
    security.twoFactor.secret = null;
    security.twoFactor.backupCodes = [];
    
    await security.save();
    
    res.json({
      success: true,
      message: '2FA disabled successfully'
    });
  } catch (error) {
    console.error('Disable 2FA error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to disable 2FA',
      error: error.message
    });
  }
});

// Get Active Sessions
router.get('/sessions', authenticateToken, async (req, res) => {
  try {
    const security = await Security.getByUser(req.user.id, req.user.type);
    if (!security) {
      return res.status(404).json({
        success: false,
        message: 'Security settings not found'
      });
    }
    
    const activeSessions = security.sessions.filter(session => 
      session.isActive && session.expiresAt > new Date()
    );
    
    res.json({
      success: true,
      data: {
        sessions: activeSessions.map(session => ({
          sessionId: session.sessionId,
          device: session.device,
          browser: session.browser,
          ipAddress: session.ipAddress,
          location: session.location,
          lastActivity: session.lastActivity,
          expiresAt: session.expiresAt,
          isCurrent: session.sessionId === req.user.sessionId
        }))
      }
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get sessions',
      error: error.message
    });
  }
});

// Revoke Session
router.delete('/sessions/:sessionId', authenticateToken, async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const security = await Security.getByUser(req.user.id, req.user.type);
    if (!security) {
      return res.status(404).json({
        success: false,
        message: 'Security settings not found'
      });
    }
    
    const revoked = security.revokeSession(sessionId);
    if (!revoked) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }
    
    await security.save();
    
    res.json({
      success: true,
      message: 'Session revoked successfully'
    });
  } catch (error) {
    console.error('Revoke session error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to revoke session',
      error: error.message
    });
  }
});

// Revoke All Sessions
router.delete('/sessions', authenticateToken, async (req, res) => {
  try {
    const security = await Security.getByUser(req.user.id, req.user.type);
    if (!security) {
      return res.status(404).json({
        success: false,
        message: 'Security settings not found'
      });
    }
    
    security.revokeAllSessions();
    await security.save();
    
    res.json({
      success: true,
      message: 'All sessions revoked successfully'
    });
  } catch (error) {
    console.error('Revoke all sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to revoke sessions',
      error: error.message
    });
  }
});

// Get Login History
router.get('/login-history', authenticateToken, async (req, res) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    
    const security = await Security.getByUser(req.user.id, req.user.type);
    if (!security) {
      return res.status(404).json({
        success: false,
        message: 'Security settings not found'
      });
    }
    
    const history = security.loginHistory
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice((page - 1) * limit, page * limit);
    
    res.json({
      success: true,
      data: {
        history,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: security.loginHistory.length
        }
      }
    });
  } catch (error) {
    console.error('Get login history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get login history',
      error: error.message
    });
  }
});

// Get Security Events
router.get('/events', authenticateToken, async (req, res) => {
  try {
    const { limit = 20, page = 1, type } = req.query;
    
    const security = await Security.getByUser(req.user.id, req.user.type);
    if (!security) {
      return res.status(404).json({
        success: false,
        message: 'Security settings not found'
      });
    }
    
    let events = security.securityEvents;
    if (type) {
      events = events.filter(event => event.type === type);
    }
    
    events = events
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice((page - 1) * limit, page * limit);
    
    res.json({
      success: true,
      data: {
        events,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: security.securityEvents.length
        }
      }
    });
  } catch (error) {
    console.error('Get security events error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get security events',
      error: error.message
    });
  }
});

// Get Trusted Devices
router.get('/devices', authenticateToken, async (req, res) => {
  try {
    const security = await Security.getByUser(req.user.id, req.user.type);
    if (!security) {
      return res.status(404).json({
        success: false,
        message: 'Security settings not found'
      });
    }
    
    const trustedDevices = security.deviceTrust.filter(device => device.isTrusted);
    
    res.json({
      success: true,
      data: { devices: trustedDevices }
    });
  } catch (error) {
    console.error('Get trusted devices error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get trusted devices',
      error: error.message
    });
  }
});

// Remove Trusted Device
router.delete('/devices/:deviceId', authenticateToken, async (req, res) => {
  try {
    const { deviceId } = req.params;
    
    const security = await Security.getByUser(req.user.id, req.user.type);
    if (!security) {
      return res.status(404).json({
        success: false,
        message: 'Security settings not found'
      });
    }
    
    const deviceIndex = security.deviceTrust.findIndex(device => device.deviceId === deviceId);
    if (deviceIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }
    
    security.deviceTrust[deviceIndex].isTrusted = false;
    await security.save();
    
    res.json({
      success: true,
      message: 'Device removed from trusted devices'
    });
  } catch (error) {
    console.error('Remove trusted device error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove trusted device',
      error: error.message
    });
  }
});

// Change Password
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }
    
    // Get user
    const user = await Worker.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    // Get security record
    const security = await Security.getByUser(req.user.id, req.user.type);
    if (security) {
      // Add security event
      security.addSecurityEvent({
        type: 'password_change',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        device: req.deviceInfo?.device,
        location: req.deviceInfo?.location
      });
      
      // Revoke all sessions if setting is enabled
      if (security.securitySettings.sessionPolicy.forceLogoutOnPasswordChange) {
        security.revokeAllSessions();
      }
      
      await security.save();
    }
    
    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: error.message
    });
  }
});

// Security Check
router.get('/check', authenticateToken, async (req, res) => {
  try {
    const security = await Security.getByUser(req.user.id, req.user.type);
    if (!security) {
      return res.status(404).json({
        success: false,
        message: 'Security settings not found'
      });
    }
    
    // Check for suspicious activity
    const recentEvents = security.securityEvents
      .filter(event => event.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000))
      .filter(event => event.riskScore > 50);
    
    // Check for multiple failed login attempts
    const recentLogins = security.loginHistory
      .filter(login => login.timestamp > new Date(Date.now() - 60 * 60 * 1000))
      .filter(login => !login.success);
    
    const securityStatus = {
      twoFactorEnabled: security.twoFactor.enabled,
      activeSessions: security.activeSessionsCount,
      trustedDevices: security.trustedDevicesCount,
      suspiciousActivity: recentEvents.length > 0,
      failedLogins: recentLogins.length,
      riskLevel: recentEvents.length > 5 ? 'high' : recentEvents.length > 2 ? 'medium' : 'low'
    };
    
    res.json({
      success: true,
      data: { securityStatus }
    });
  } catch (error) {
    console.error('Security check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to perform security check',
      error: error.message
    });
  }
});

module.exports = router; 
const express = require('express');
const router = express.Router();
const Privacy = require('../models/Privacy');
const Security = require('../models/Security');
const { authenticateToken, deviceFingerprint } = require('../middleware/security');

// Get Privacy Settings
router.get('/settings', authenticateToken, async (req, res) => {
  try {
    const privacy = await Privacy.getByUser(req.user.id, req.user.type);
    
    if (!privacy) {
      return res.status(404).json({
        success: false,
        message: 'Privacy settings not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        privacySettings: privacy.privacySettings,
        cookiePreferences: privacy.cookiePreferences,
        dataConsent: {
          personalData: privacy.dataConsent.personalData.consent,
          marketingData: privacy.dataConsent.marketingData.consent,
          analyticsData: privacy.dataConsent.analyticsData.consent,
          thirdPartyData: privacy.dataConsent.thirdPartyData.consent
        },
        dataRights: {
          hasActiveConsent: privacy.hasActiveConsent,
          pendingRequests: privacy.pendingRequests
        }
      }
    });
  } catch (error) {
    console.error('Get privacy settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get privacy settings',
      error: error.message
    });
  }
});

// Update Privacy Settings
router.put('/settings', authenticateToken, async (req, res) => {
  try {
    const { privacySettings } = req.body;
    
    const privacy = await Privacy.getByUser(req.user.id, req.user.type);
    if (!privacy) {
      return res.status(404).json({
        success: false,
        message: 'Privacy settings not found'
      });
    }
    
    if (privacySettings) {
      privacy.updatePrivacySettings({
        ...privacySettings,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      });
    }
    
    await privacy.save();
    
    res.json({
      success: true,
      message: 'Privacy settings updated successfully',
      data: { privacySettings: privacy.privacySettings }
    });
  } catch (error) {
    console.error('Update privacy settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update privacy settings',
      error: error.message
    });
  }
});

// Give Consent
router.post('/consent', authenticateToken, async (req, res) => {
  try {
    const { consentType, version, channels } = req.body;
    
    if (!consentType || !version) {
      return res.status(400).json({
        success: false,
        message: 'Consent type and version are required'
      });
    }
    
    const privacy = await Privacy.getByUser(req.user.id, req.user.type);
    if (!privacy) {
      return res.status(404).json({
        success: false,
        message: 'Privacy settings not found'
      });
    }
    
    const consentData = {
      version,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    };
    
    if (channels) {
      consentData.channels = channels;
    }
    
    privacy.giveConsent(consentType, consentData);
    await privacy.save();
    
    res.json({
      success: true,
      message: 'Consent given successfully',
      data: { consentType, timestamp: new Date() }
    });
  } catch (error) {
    console.error('Give consent error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to give consent',
      error: error.message
    });
  }
});

// Withdraw Consent
router.post('/consent/withdraw', authenticateToken, async (req, res) => {
  try {
    const { consentType } = req.body;
    
    if (!consentType) {
      return res.status(400).json({
        success: false,
        message: 'Consent type is required'
      });
    }
    
    const privacy = await Privacy.getByUser(req.user.id, req.user.type);
    if (!privacy) {
      return res.status(404).json({
        success: false,
        message: 'Privacy settings not found'
      });
    }
    
    const withdrawalData = {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    };
    
    privacy.withdrawConsent(consentType, withdrawalData);
    await privacy.save();
    
    res.json({
      success: true,
      message: 'Consent withdrawn successfully',
      data: { consentType, timestamp: new Date() }
    });
  } catch (error) {
    console.error('Withdraw consent error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to withdraw consent',
      error: error.message
    });
  }
});

// Update Cookie Preferences
router.put('/cookies', authenticateToken, async (req, res) => {
  try {
    const { necessary, functional, analytics, marketing } = req.body;
    
    const privacy = await Privacy.getByUser(req.user.id, req.user.type);
    if (!privacy) {
      return res.status(404).json({
        success: false,
        message: 'Privacy settings not found'
      });
    }
    
    privacy.cookiePreferences = {
      necessary: necessary !== undefined ? necessary : privacy.cookiePreferences.necessary,
      functional: functional !== undefined ? functional : privacy.cookiePreferences.functional,
      analytics: analytics !== undefined ? analytics : privacy.cookiePreferences.analytics,
      marketing: marketing !== undefined ? marketing : privacy.cookiePreferences.marketing,
      timestamp: new Date(),
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    };
    
    // Add to compliance log
    privacy.complianceLog.push({
      action: 'cookies_accepted',
      timestamp: new Date(),
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: { necessary, functional, analytics, marketing }
    });
    
    await privacy.save();
    
    res.json({
      success: true,
      message: 'Cookie preferences updated successfully',
      data: { cookiePreferences: privacy.cookiePreferences }
    });
  } catch (error) {
    console.error('Update cookie preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update cookie preferences',
      error: error.message
    });
  }
});

// Request Data Access
router.post('/request/access', authenticateToken, async (req, res) => {
  try {
    const { description, requestedData, verificationMethod } = req.body;
    
    if (!description) {
      return res.status(400).json({
        success: false,
        message: 'Description is required'
      });
    }
    
    const privacy = await Privacy.getByUser(req.user.id, req.user.type);
    if (!privacy) {
      return res.status(404).json({
        success: false,
        message: 'Privacy settings not found'
      });
    }
    
    const requestData = {
      type: 'access',
      description,
      requestedData: requestedData || [],
      verificationMethod: verificationMethod || 'email',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    };
    
    const request = privacy.createPrivacyRequest(requestData);
    await privacy.save();
    
    res.json({
      success: true,
      message: 'Data access request submitted successfully',
      data: { requestId: request.requestId, dueDate: request.dueDate }
    });
  } catch (error) {
    console.error('Request data access error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit data access request',
      error: error.message
    });
  }
});

// Request Data Deletion
router.post('/request/deletion', authenticateToken, async (req, res) => {
  try {
    const { description, verificationMethod } = req.body;
    
    if (!description) {
      return res.status(400).json({
        success: false,
        message: 'Description is required'
      });
    }
    
    const privacy = await Privacy.getByUser(req.user.id, req.user.type);
    if (!privacy) {
      return res.status(404).json({
        success: false,
        message: 'Privacy settings not found'
      });
    }
    
    const requestData = {
      type: 'erasure',
      description,
      verificationMethod: verificationMethod || 'email',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    };
    
    const request = privacy.createPrivacyRequest(requestData);
    await privacy.save();
    
    res.json({
      success: true,
      message: 'Data deletion request submitted successfully',
      data: { requestId: request.requestId, dueDate: request.dueDate }
    });
  } catch (error) {
    console.error('Request data deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit data deletion request',
      error: error.message
    });
  }
});

// Request Data Export
router.post('/request/export', authenticateToken, async (req, res) => {
  try {
    const { format, dataCategories } = req.body;
    
    const privacy = await Privacy.getByUser(req.user.id, req.user.type);
    if (!privacy) {
      return res.status(404).json({
        success: false,
        message: 'Privacy settings not found'
      });
    }
    
    const exportData = {
      format: format || 'json',
      dataCategories: dataCategories || ['personal_identifiers', 'contact_information'],
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    };
    
    const exportRecord = privacy.createDataExport(exportData);
    await privacy.save();
    
    res.json({
      success: true,
      message: 'Data export request submitted successfully',
      data: { 
        exportId: exportRecord.exportId, 
        format: exportRecord.format,
        expiresAt: exportRecord.expiresAt
      }
    });
  } catch (error) {
    console.error('Request data export error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit data export request',
      error: error.message
    });
  }
});

// Get Privacy Requests
router.get('/requests', authenticateToken, async (req, res) => {
  try {
    const { status, limit = 20, page = 1 } = req.query;
    
    const privacy = await Privacy.getByUser(req.user.id, req.user.type);
    if (!privacy) {
      return res.status(404).json({
        success: false,
        message: 'Privacy settings not found'
      });
    }
    
    let requests = privacy.privacyRequests;
    if (status) {
      requests = requests.filter(req => req.status === status);
    }
    
    requests = requests
      .sort((a, b) => b.requestDate - a.requestDate)
      .slice((page - 1) * limit, page * limit);
    
    res.json({
      success: true,
      data: {
        requests,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: privacy.privacyRequests.length
        }
      }
    });
  } catch (error) {
    console.error('Get privacy requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get privacy requests',
      error: error.message
    });
  }
});

// Get Data Export History
router.get('/exports', authenticateToken, async (req, res) => {
  try {
    const privacy = await Privacy.getByUser(req.user.id, req.user.type);
    if (!privacy) {
      return res.status(404).json({
        success: false,
        message: 'Privacy settings not found'
      });
    }
    
    const exports = privacy.dataExportHistory
      .sort((a, b) => b.requestDate - a.requestDate);
    
    res.json({
      success: true,
      data: { exports }
    });
  } catch (error) {
    console.error('Get data exports error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get data exports',
      error: error.message
    });
  }
});

// Get Data Breach Notifications
router.get('/breaches', authenticateToken, async (req, res) => {
  try {
    const privacy = await Privacy.getByUser(req.user.id, req.user.type);
    if (!privacy) {
      return res.status(404).json({
        success: false,
        message: 'Privacy settings not found'
      });
    }
    
    const breaches = privacy.dataBreachNotifications
      .sort((a, b) => b.notificationDate - a.notificationDate);
    
    res.json({
      success: true,
      data: { breaches }
    });
  } catch (error) {
    console.error('Get data breaches error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get data breaches',
      error: error.message
    });
  }
});

// Mark Breach as Read
router.put('/breaches/:breachId/read', authenticateToken, async (req, res) => {
  try {
    const { breachId } = req.params;
    
    const privacy = await Privacy.getByUser(req.user.id, req.user.type);
    if (!privacy) {
      return res.status(404).json({
        success: false,
        message: 'Privacy settings not found'
      });
    }
    
    const breach = privacy.dataBreachNotifications.find(b => b.breachId === breachId);
    if (!breach) {
      return res.status(404).json({
        success: false,
        message: 'Breach notification not found'
      });
    }
    
    breach.readDate = new Date();
    await privacy.save();
    
    res.json({
      success: true,
      message: 'Breach notification marked as read'
    });
  } catch (error) {
    console.error('Mark breach as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark breach as read',
      error: error.message
    });
  }
});

// Get Compliance Log
router.get('/compliance', authenticateToken, async (req, res) => {
  try {
    const { limit = 50, page = 1 } = req.query;
    
    const privacy = await Privacy.getByUser(req.user.id, req.user.type);
    if (!privacy) {
      return res.status(404).json({
        success: false,
        message: 'Privacy settings not found'
      });
    }
    
    const complianceLog = privacy.complianceLog
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice((page - 1) * limit, page * limit);
    
    res.json({
      success: true,
      data: {
        complianceLog,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: privacy.complianceLog.length
        }
      }
    });
  } catch (error) {
    console.error('Get compliance log error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get compliance log',
      error: error.message
    });
  }
});

// Accept Terms of Service
router.post('/terms/accept', authenticateToken, async (req, res) => {
  try {
    const { version } = req.body;
    
    if (!version) {
      return res.status(400).json({
        success: false,
        message: 'Terms version is required'
      });
    }
    
    const privacy = await Privacy.getByUser(req.user.id, req.user.type);
    if (!privacy) {
      return res.status(404).json({
        success: false,
        message: 'Privacy settings not found'
      });
    }
    
    privacy.compliance.termsAccepted = {
      accepted: true,
      timestamp: new Date(),
      version,
      ipAddress: req.ip
    };
    
    // Add to compliance log
    privacy.complianceLog.push({
      action: 'terms_accepted',
      timestamp: new Date(),
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: { version }
    });
    
    await privacy.save();
    
    res.json({
      success: true,
      message: 'Terms of Service accepted successfully'
    });
  } catch (error) {
    console.error('Accept terms error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to accept terms',
      error: error.message
    });
  }
});

// Accept Privacy Policy
router.post('/policy/accept', authenticateToken, async (req, res) => {
  try {
    const { version } = req.body;
    
    if (!version) {
      return res.status(400).json({
        success: false,
        message: 'Privacy policy version is required'
      });
    }
    
    const privacy = await Privacy.getByUser(req.user.id, req.user.type);
    if (!privacy) {
      return res.status(404).json({
        success: false,
        message: 'Privacy settings not found'
      });
    }
    
    privacy.compliance.privacyPolicyAccepted = {
      accepted: true,
      timestamp: new Date(),
      version,
      ipAddress: req.ip
    };
    
    // Add to compliance log
    privacy.complianceLog.push({
      action: 'privacy_policy_accepted',
      timestamp: new Date(),
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: { version }
    });
    
    await privacy.save();
    
    res.json({
      success: true,
      message: 'Privacy Policy accepted successfully'
    });
  } catch (error) {
    console.error('Accept privacy policy error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to accept privacy policy',
      error: error.message
    });
  }
});

// Privacy Dashboard
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const privacy = await Privacy.getByUser(req.user.id, req.user.type);
    if (!privacy) {
      return res.status(404).json({
        success: false,
        message: 'Privacy settings not found'
      });
    }
    
    const dashboard = {
      consentStatus: {
        personalData: privacy.dataConsent.personalData.consent,
        marketingData: privacy.dataConsent.marketingData.consent,
        analyticsData: privacy.dataConsent.analyticsData.consent,
        thirdPartyData: privacy.dataConsent.thirdPartyData.consent
      },
      dataRights: {
        pendingRequests: privacy.pendingRequests,
        totalRequests: privacy.privacyRequests.length,
        completedRequests: privacy.privacyRequests.filter(req => req.status === 'completed').length
      },
      dataExports: {
        total: privacy.dataExportHistory.length,
        recent: privacy.dataExportHistory.filter(exp => exp.requestDate > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length
      },
      breaches: {
        total: privacy.dataBreachNotifications.length,
        unread: privacy.dataBreachNotifications.filter(b => !b.readDate).length,
        critical: privacy.dataBreachNotifications.filter(b => b.severity === 'critical').length
      },
      compliance: {
        termsAccepted: privacy.compliance.termsAccepted.accepted,
        privacyPolicyAccepted: privacy.compliance.privacyPolicyAccepted.accepted,
        gdprConsent: privacy.compliance.gdprConsent.given,
        cookieConsent: privacy.compliance.cookieConsent.given
      }
    };
    
    res.json({
      success: true,
      data: { dashboard }
    });
  } catch (error) {
    console.error('Get privacy dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get privacy dashboard',
      error: error.message
    });
  }
});

module.exports = router; 
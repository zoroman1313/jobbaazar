const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const Security = require('../models/Security');

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Rate limiting middleware
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message: message || 'Too many requests, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Login rate limiter
const loginLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // 5 attempts
  'Too many login attempts, please try again in 15 minutes.'
);

// API rate limiter
const apiLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests
  'Too many API requests, please try again later.'
);

// Registration rate limiter
const registerLimiter = createRateLimiter(
  60 * 60 * 1000, // 1 hour
  3, // 3 attempts
  'Too many registration attempts, please try again in 1 hour.'
);

// JWT Authentication middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get user security record
    const security = await Security.getByUser(decoded.userId, decoded.userType);
    if (!security) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    // Validate session
    const sessionValid = security.validateSession(decoded.sessionId, decoded.sessionToken);
    if (!sessionValid) {
      return res.status(401).json({
        success: false,
        message: 'Session expired or invalid'
      });
    }

    req.user = {
      id: decoded.userId,
      type: decoded.userType,
      sessionId: decoded.sessionId
    };
    req.security = security;
    
    next();
  } catch (error) {
    console.error('JWT verification error:', error);
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// Admin authentication middleware
const authenticateAdmin = async (req, res, next) => {
  try {
    await authenticateToken(req, res, () => {
      if (req.user.type !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
      }
      next();
    });
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Admin authentication failed'
    });
  }
};

// Permission-based middleware
const requirePermission = (resource, action) => {
  return async (req, res, next) => {
    try {
      await authenticateToken(req, res, () => {
        if (req.user.type === 'admin') {
          // Admin has all permissions
          return next();
        }
        
        // Check user-specific permissions
        if (req.security && req.security.hasPermission) {
          const hasPermission = req.security.hasPermission(resource, action);
          if (!hasPermission) {
            return res.status(403).json({
              success: false,
              message: `Permission denied: ${action} on ${resource}`
            });
          }
        }
        
        next();
      });
    } catch (error) {
      return res.status(403).json({
        success: false,
        message: 'Permission check failed'
      });
    }
  };
};

// Device fingerprinting middleware
const deviceFingerprint = (req, res, next) => {
  const userAgent = req.headers['user-agent'] || '';
  const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] || 'unknown';
  
  // Simple device fingerprinting
  const deviceId = require('crypto')
    .createHash('sha256')
    .update(userAgent + ipAddress)
    .digest('hex');
  
  req.deviceInfo = {
    deviceId,
    userAgent,
    ipAddress,
    device: getDeviceType(userAgent),
    browser: getBrowserInfo(userAgent),
    os: getOSInfo(userAgent)
  };
  
  next();
};

// Security headers middleware
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true,
  frameguard: { action: 'deny' }
});

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003',
      'http://localhost:3004',
      'http://localhost:3005',
      'http://localhost:3006',
      'http://localhost:3007',
      'https://jobbaazar.com',
      'https://www.jobbaazar.com'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

// Input validation middleware
const validateInput = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

// SQL Injection protection middleware
const sqlInjectionProtection = (req, res, next) => {
  const sqlPattern = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i;
  
  const checkValue = (value) => {
    if (typeof value === 'string' && sqlPattern.test(value)) {
      return false;
    }
    return true;
  };
  
  const checkObject = (obj) => {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          if (!checkObject(obj[key])) return false;
        } else if (!checkValue(obj[key])) {
          return false;
        }
      }
    }
    return true;
  };
  
  if (!checkObject(req.body) || !checkObject(req.query) || !checkObject(req.params)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid input detected'
    });
  }
  
  next();
};

// XSS Protection middleware
const xssProtection = (req, res, next) => {
  const sanitizeValue = (value) => {
    if (typeof value === 'string') {
      return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
    }
    return value;
  };
  
  const sanitizeObject = (obj) => {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          sanitizeObject(obj[key]);
        } else {
          obj[key] = sanitizeValue(obj[key]);
        }
      }
    }
  };
  
  sanitizeObject(req.body);
  sanitizeObject(req.query);
  sanitizeObject(req.params);
  
  next();
};

// Helper functions
function getDeviceType(userAgent) {
  if (/mobile/i.test(userAgent)) return 'Mobile';
  if (/tablet/i.test(userAgent)) return 'Tablet';
  return 'Desktop';
}

function getBrowserInfo(userAgent) {
  if (/chrome/i.test(userAgent)) return 'Chrome';
  if (/firefox/i.test(userAgent)) return 'Firefox';
  if (/safari/i.test(userAgent)) return 'Safari';
  if (/edge/i.test(userAgent)) return 'Edge';
  if (/opera/i.test(userAgent)) return 'Opera';
  return 'Unknown';
}

function getOSInfo(userAgent) {
  if (/windows/i.test(userAgent)) return 'Windows';
  if (/macintosh/i.test(userAgent)) return 'macOS';
  if (/linux/i.test(userAgent)) return 'Linux';
  if (/android/i.test(userAgent)) return 'Android';
  if (/ios/i.test(userAgent)) return 'iOS';
  return 'Unknown';
}

// Generate JWT token
const generateToken = (userId, userType, sessionId, sessionToken) => {
  return jwt.sign(
    { userId, userType, sessionId, sessionToken },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  JWT_SECRET,
  loginLimiter,
  apiLimiter,
  registerLimiter,
  authenticateToken,
  authenticateAdmin,
  requirePermission,
  deviceFingerprint,
  securityHeaders,
  corsOptions,
  validateInput,
  sqlInjectionProtection,
  xssProtection,
  generateToken,
  verifyToken
}; 
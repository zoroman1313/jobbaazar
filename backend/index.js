const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('../database/connection');
const { securityHeaders, corsOptions, deviceFingerprint } = require('./middleware/security');
const testRoute = require('./routes/test');
const workerRoute = require('./routes/worker');
const productRoute = require('./routes/product');
const walletRoute = require('./routes/wallet');
const reviewRoute = require('./routes/review');
const notificationRoute = require('./routes/notification');
const messageRoute = require('./routes/message');
const analyticsRoute = require('./routes/analytics');
const adminRoute = require('./routes/admin');
const securityRoute = require('./routes/security');
const privacyRoute = require('./routes/privacy');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors(corsOptions));
app.use(securityHeaders);
app.use(deviceFingerprint);
app.use(express.json());

// Routes
app.use('/api/test', testRoute);
app.use('/api/worker', workerRoute);
app.use('/api/product', productRoute);
app.use('/api/wallet', walletRoute);
app.use('/api/review', reviewRoute);
app.use('/api/notification', notificationRoute);
app.use('/api/message', messageRoute);
  app.use('/api/analytics', analyticsRoute);
  app.use('/api/admin', adminRoute);
  app.use('/api/security', securityRoute);
  app.use('/api/privacy', privacyRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


const express = require('express');
const router = express.Router();
const Worker = require('../models/Worker');

router.post('/register', async (req, res) => {
  try {
    const worker = new Worker(req.body);
    await worker.save();
    res.status(201).json(worker);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
module.exports = router;
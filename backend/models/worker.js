const mongoose = require('mongoose');

const WorkerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nationality: { type: String, required: true },
  languages: [String],
  skill: { type: String, required: true },
  location: { type: String, required: true },
  availability: [String],
  rate: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Worker', WorkerSchema);
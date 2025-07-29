const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  category: { 
    type: String, 
    required: true,
    enum: ['cement', 'bricks', 'pipes', 'tools', 'electrical', 'plumbing', 'paint', 'wood', 'metal', 'other']
  },
  description: { 
    type: String, 
    required: true,
    trim: true
  },
  price: { 
    type: Number, 
    required: true,
    min: 0
  },
  originalPrice: { 
    type: Number,
    min: 0
  },
  condition: { 
    type: String, 
    required: true,
    enum: ['new', 'used', 'excellent', 'good', 'fair', 'poor']
  },
  location: { 
    type: String, 
    required: true,
    trim: true
  },
  seller: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 }
  },
  photos: [{ 
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return v.length > 0 && v.length <= 5;
      },
      message: 'Product must have at least 1 photo and maximum 5 photos'
    }
  }],
  rating: { 
    type: Number, 
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [{ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
    date: { type: Date, default: Date.now }
  }],
  status: { 
    type: String, 
    default: 'active',
    enum: ['active', 'sold', 'inactive', 'reported']
  },
  views: { 
    type: Number, 
    default: 0 
  },
  favorites: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  tags: [{ 
    type: String, 
    trim: true 
  }],
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
ProductSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create indexes for better search performance
ProductSchema.index({ title: 'text', description: 'text' });
ProductSchema.index({ category: 1 });
ProductSchema.index({ location: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ condition: 1 });
ProductSchema.index({ status: 1 });
ProductSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Product', ProductSchema); 
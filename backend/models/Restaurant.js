const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: String,
  category: String,
  isAvailable: { type: Boolean, default: true },
});

const restaurantSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: { type: String, required: true },
  description: String,
  cuisine: [String],
  image: String,
  rating: { type: Number, default: 0 },
  numRatings: { type: Number, default: 0 },
  menu: [menuItemSchema],
  status: { type: String, enum: ['open', 'closed', 'busy'], default: 'open' },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number] }, // [longitude, latitude]
    address: String,
  },
  deliveryTime: { type: Number, default: 30 }, // Estimated time in minutes
});

restaurantSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Restaurant', restaurantSchema);

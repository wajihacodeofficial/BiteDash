const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['customer', 'rider', 'admin', 'restaurant'],
      default: 'customer',
    },
    address: { type: String },
    phone: { type: String },
    profileImage: { type: String },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpires: { type: Date },
    otp: { type: String },
    otpExpires: { type: Date },

    // Rider specific fields
    employmentStatus: {
      type: String,
      enum: ['active', 'on_leave', 'terminated'],
      default: 'active',
    },
    salary: { type: Number, default: 0 },
    contractType: {
      type: String,
      enum: ['full-time', 'part-time', 'freelance'],
      default: 'freelance',
    },
    vehicleInfo: {
      vehicleType: { type: String }, // e.g., 'bike', 'car'
      plateNumber: { type: String },
      model: { type: String },
    },
    badges: [{ type: String }],
    riderRating: { type: Number, default: 5 },
    totalEarnings: { type: Number, default: 0 },

    // Customer specific fields
    paymentMethods: [
      {
        cardHolderName: { type: String },
        cardNumber: { type: String }, // Encrypted or masked in real life
        expiryDate: { type: String },
        cardType: { type: String }, // e.g., 'visa', 'mastercard'
        isDefault: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

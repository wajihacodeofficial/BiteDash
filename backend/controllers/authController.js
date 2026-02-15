const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, address } = req.body;

    if (role === 'admin') {
      return res.status(403).json({
        message: 'Admin role cannot be registered via public signup.',
      });
    }

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long and contain both letters and numbers.',
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists.' });

    const otp = generateOTP();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    const hashedOtp = await bcrypt.hash(otp, 10);

    const user = await User.create({
      name,
      email,
      password,
      role,
      phone,
      address,
      otp: hashedOtp,
      otpExpires,
      isVerified: false,
    });

    try {
      await sendEmail({
        email: user.email,
        subject: 'Email Verification OTP',
        message: `Your verification code is: ${otp}\nThis code will expire in 10 minutes.`,
      });
    } catch (emailError) {
      console.error('CRITICAL: Email sending failed!');
      console.error('Error details:', emailError);
      
      // Delete the unverified user if email fails so they can retry registration
      await User.findByIdAndDelete(user._id);
      
      return res.status(500).json({ 
        message: 'Failed to send verification email. Please check your email or try again later.',
        errorSnippet: emailError.message // Returning message snippet to help user
      });
    }

    res.status(201).json({
      message: 'Registration successful. Please verify your email with the OTP sent.',
      user: { id: user._id, name, email, role: user.role, isVerified: false },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ message: 'User already verified' });

    if (!user.otp || !user.otpExpires || Date.now() > user.otpExpires) {
      return res.status(400).json({ message: 'OTP expired or not found. Please resend.' });
    }

    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) return res.status(400).json({ message: 'Invalid OTP code' });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Email verified successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: true
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ message: 'User already verified' });

    const otp = generateOTP();
    const otpExpires = Date.now() + 10 * 60 * 1000;
    const hashedOtp = await bcrypt.hash(otp, 10);

    user.otp = hashedOtp;
    user.otpExpires = otpExpires;
    await user.save();

    await sendEmail({
      email: user.email,
      subject: 'Email Verification OTP',
      message: `Your NEW verification code is: ${otp}\nThis code will expire in 10 minutes.`,
    });

    res.json({ message: 'New OTP sent to your email.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ 
        message: 'Please verify your email before logging in.',
        unverified: true 
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, verifyOTP, resendOTP, login };

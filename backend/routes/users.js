const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP Email
async function sendOTPEmail(email, otp, name) {
  const mailOptions = {
    from: process.env.EMAIL_USER || 'deepakprajapatiproplus@gmail.com',
    to: email,
    subject: 'Email Verification - NeighborFit',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4F46E5; margin: 0;">NeighborFit</h1>
          <p style="color: #666; margin: 5px 0;">Find Your Perfect Neighborhood</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
          <h2 style="color: #333; margin-bottom: 20px;">Email Verification Required</h2>
          <p style="color: #666; margin-bottom: 30px;">Hi ${name},</p>
          <p style="color: #666; margin-bottom: 30px;">
            To complete your registration and secure your account, please verify your email address using the OTP below:
          </p>
          
          <div style="background: linear-gradient(135deg, #4F46E5, #7C3AED); 
                      color: white; 
                      font-size: 32px; 
                      font-weight: bold; 
                      padding: 20px 40px; 
                      border-radius: 10px; 
                      display: inline-block; 
                      letter-spacing: 5px; 
                      margin: 20px 0;">
            ${otp}
          </div>
          
          <p style="color: #666; margin-top: 30px; font-size: 14px;">
            <strong>This OTP will expire in 10 minutes.</strong>
          </p>
          <p style="color: #666; font-size: 14px;">
            If you didn't create an account with NeighborFit, please ignore this email.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
          <p>This email was sent by NeighborFit • Secure Email Verification</p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
}

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || 'deepakprajapatiproplus@gmail.com',
    pass: process.env.EMAIL_PASS || 'zueb ojdt busd klao'
  },
  tls: {
    rejectUnauthorized: false
  }
});

router.post('/register', async (req, res) => {
  try {
    console.log('Registration attempt with data:', req.body);
    
    const { email, password, name, age, gender } = req.body;
    
    console.log('Received fields:', { email, name, age, gender, hasPassword: !!password });
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const user = new User({
      email,
      password,
      name,
      age,
      gender
    });
    
    // Generate OTP for email verification
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    
    user.emailVerificationOTP = otp;
    user.emailVerificationOTPExpires = otpExpiry;
    user.isEmailVerified = false;
    
    console.log('Attempting to save user...');
    await user.save();
    console.log('User saved successfully');
    
    // Send OTP email
    try {
      await sendOTPEmail(email, otp, name);
      console.log('OTP email sent successfully to:', email);
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
      // Continue with registration even if email fails
    }
    
    res.status(201).json({
      message: 'Registration successful! Please check your email for OTP verification.',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        age: user.age,
        gender: user.gender,
        isEmailVerified: user.isEmailVerified
      },
      requiresEmailVerification: true
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ message: error.message || 'Registration failed. Please try again.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(403).json({ 
        message: 'Please verify your email before logging in',
        requiresEmailVerification: true,
        email: user.email
      });
    }
    
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        age: user.age,
        gender: user.gender,
        isEmailVerified: user.isEmailVerified,
        preferences: user.preferences,
        favoriteNeighborhoods: user.favoriteNeighborhoods || []
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/preferences', auth, async (req, res) => {
  try {
    const { userId } = req.user;
    const { preferences } = req.body;

    if (!preferences || typeof preferences !== 'object') {
      return res.status(400).json({ message: 'Invalid preferences format.' });
    }

    const cleanedPreferences = { ...preferences };
    for (const key in cleanedPreferences) {
      if (cleanedPreferences[key] === '') {
        cleanedPreferences[key] = undefined;
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { preferences: cleanedPreferences } },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }
    
    res.json({
      id: updatedUser._id,
      email: updatedUser.email,
      name: updatedUser.name,
      age: updatedUser.age,
      gender: updatedUser.gender,
      preferences: updatedUser.preferences,
      favoriteNeighborhoods: updatedUser.favoriteNeighborhoods || []
    });
  } catch (error) {
    console.error('Preferences update error:', error);
    res.status(400).json({ message: 'Failed to update preferences. Please try again.' });
  }
});

router.post('/favorites/:neighborhoodId', auth, async (req, res) => {
  try {
    const { userId } = req.user;
    const { neighborhoodId } = req.params;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { favoriteNeighborhoods: neighborhoodId } },
      { new: true }
    );
    
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/favorites/:neighborhoodId', auth, async (req, res) => {
  try {
    const { userId } = req.user;
    const { neighborhoodId } = req.params;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { favoriteNeighborhoods: neighborhoodId } },
      { new: true }
    );
    
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/check-email', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ exists: false, message: 'Email is required' });
    const user = await User.findOne({ email });
    res.json({ exists: !!user });
  } catch (error) {
    res.status(400).json({ exists: false, message: error.message });
  }
});

router.post('/change-password', auth, async (req, res) => {
  try {
    const { userId } = req.user;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Old and new password required.' });
    }
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) return res.status(401).json({ message: 'Old password incorrect.' });
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password changed successfully.' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    
    // Always return success message for security (don't reveal if email exists)
    if (!user) {
      return res.json({ message: 'If this email exists, a reset link has been sent.' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

    // Save reset token to user (you'll need to add these fields to User model)
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@neighborfit.com',
      to: email,
      subject: 'Password Reset Request - NeighborFit',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Password Reset Request</h2>
          <p>You requested a password reset for your NeighborFit account.</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: linear-gradient(135deg, #4F46E5, #7C3AED); 
                      color: white; 
                      padding: 12px 30px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          <p><strong>This link will expire in 1 hour.</strong></p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            This email was sent by NeighborFit. If you have any questions, please contact our support team.
          </p>
        </div>
      `
    };

    // Send email
    console.log('Attempting to send email to:', email);
    console.log('Email configuration:', {
      user: transporter.options.auth.user,
      host: transporter.options.host,
      port: transporter.options.port
    });
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);

    res.json({ message: 'If this email exists, a reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error details:', {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode
    });
    res.status(500).json({ message: 'Failed to send reset email. Please try again.' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(400).json({ message: 'Failed to reset password. Please try again.' });
  }
});

router.post('/verify-email', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    console.log('Email verification attempt:', { email, otp });
    
    if (!email || !otp) {
      console.log('Missing email or OTP');
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    // First, let's check if user exists and if already verified
    const userExists = await User.findOne({ email: email.toLowerCase() });
    console.log('User exists check:', { exists: !!userExists });
    
    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is already verified
    if (userExists.isEmailVerified) {
      console.log('User already verified, logging them in');
      
      // Generate JWT token for already verified user
      const token = jwt.sign(
        { userId: userExists._id },
        process.env.JWT_SECRET || 'fallback-secret-key',
        { expiresIn: '24h' }
      );

      return res.json({
        message: 'Email already verified! Logging you in...',
        token,
        user: {
          id: userExists._id,
          email: userExists.email,
          name: userExists.name,
          age: userExists.age,
          gender: userExists.gender,
          isEmailVerified: userExists.isEmailVerified,
          preferences: userExists.preferences,
          favoriteNeighborhoods: userExists.favoriteNeighborhoods || []
        }
      });
    }
    
    console.log('User details:', {
      email: userExists.email,
      hasOTP: !!userExists.emailVerificationOTP,
      storedOTP: userExists.emailVerificationOTP,
      providedOTP: otp,
      otpMatch: userExists.emailVerificationOTP === otp,
      isExpired: userExists.emailVerificationOTPExpires < Date.now(),
      expiryTime: userExists.emailVerificationOTPExpires,
      currentTime: new Date(Date.now()),
      isVerified: userExists.isEmailVerified
    });

    // Find user with valid OTP
    const user = await User.findOne({
      email: email.toLowerCase(),
      emailVerificationOTP: otp,
      emailVerificationOTPExpires: { $gt: Date.now() }
    });

    if (!user) {
      console.log('No user found with valid OTP and non-expired token');
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    console.log('Email verification successful for user:', user.email);

    // Verify email
    user.isEmailVerified = true;
    user.emailVerificationOTP = undefined;
    user.emailVerificationOTPExpires = undefined;
    await user.save();

    // Generate JWT token after successful verification
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Email verified successfully!',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        age: user.age,
        gender: user.gender,
        isEmailVerified: user.isEmailVerified,
        preferences: user.preferences,
        favoriteNeighborhoods: user.favoriteNeighborhoods || []
      }
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(400).json({ message: 'Email is Verified.' });
  }
});

router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Find user
    const user = await User.findOne({ 
      email: email.toLowerCase(),
      isEmailVerified: false 
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found or already verified' });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    
    user.emailVerificationOTP = otp;
    user.emailVerificationOTPExpires = otpExpiry;
    await user.save();

    // Send OTP email
    await sendOTPEmail(email, otp, user.name);

    res.json({ message: 'New OTP sent to your email' });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ message: 'Failed to resend OTP. Please try again.' });
  }
});

router.get('/export', auth, async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/delete', auth, async (req, res) => {
  try {
    const { userId } = req.user;
    await User.findByIdAndDelete(userId);
    res.json({ message: 'Account deleted successfully.' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 
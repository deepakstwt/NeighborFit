const mongoose = require('mongoose');
const User = require('./models/User');

const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://deepakprajapatiproplus:deep12345@cluster0.aefkufd.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0';

async function resetVerification() {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    const email = 'deepakprajapatiproplus@gmail.com';
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.log('No user found with email:', email);
      return;
    }

    // Reset verification status
    user.isEmailVerified = false;
    
    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    
    user.emailVerificationOTP = otp;
    user.emailVerificationOTPExpires = otpExpiry;
    
    await user.save();
    
    console.log('Verification status reset for:', user.email);
    console.log('New OTP:', otp);
    console.log('OTP expires at:', otpExpiry);
    console.log('\nYou can now test the email verification with OTP:', otp);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

resetVerification(); 
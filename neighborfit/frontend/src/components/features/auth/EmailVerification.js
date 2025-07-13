import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { userAPI } from '../../../lib/api';
import { useUser } from '../../../context/UserContext';

const EmailVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useUser();
  
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Get email from navigation state or localStorage
    const emailFromState = location.state?.email;
    const emailFromStorage = localStorage.getItem('pendingVerificationEmail');
    
    if (emailFromState) {
      setEmail(emailFromState);
      localStorage.setItem('pendingVerificationEmail', emailFromState);
    } else if (emailFromStorage) {
      setEmail(emailFromStorage);
    } else {
      // Check if user is already logged in
      const token = localStorage.getItem('token');
      if (token) {
        // User is already logged in, redirect to dashboard
        navigate('/dashboard');
        return;
      }
      // Redirect to signup if no email found
      navigate('/onboarding');
    }
  }, [location.state, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting verification with:', { email, otp });
      const response = await userAPI.verifyEmail(email, otp);
      console.log('Full verification response:', response);
      console.log('Response data:', response.data);
      console.log('Has token?', !!response.data?.token);
      console.log('Has user?', !!response.data?.user);

      // If token and user are present, treat as success
      if (response.data && response.data.token && response.data.user) {
        console.log('✅ Verification successful, logging in user');
        setError(''); // Clear any previous errors
        
        try {
        login(response.data.token, response.data.user);
          console.log('✅ Login function called successfully');
        } catch (loginError) {
          console.error('❌ Login function error:', loginError);
        }
        
        // Check if there are pending preferences to save
        const pendingPreferences = localStorage.getItem('pendingPreferences');
        if (pendingPreferences) {
          try {
            const preferences = JSON.parse(pendingPreferences);
            await userAPI.updatePreferences(preferences);
            localStorage.removeItem('pendingPreferences');
            console.log('✅ Pending preferences saved');
          } catch (error) {
            console.error('❌ Failed to save preferences:', error);
          }
        }
        
        localStorage.removeItem('pendingVerificationEmail');
        setSuccess(response.data.message || 'Email verified successfully! Redirecting...');
        
        console.log('🚀 Redirecting to dashboard in 1.5 seconds');
        // Redirect to dashboard after showing success message
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
        return;
      }

      console.log('❌ No token or user in response');
      // If no token/user, treat as error
      setError('Verification failed. Please try again.');
    } catch (error) {
      console.error('Email verification error:', error);
      
      // Handle specific error cases
      if (error.response?.status === 400) {
        setError(error.response.data.message || 'Invalid OTP. Please check and try again.');
      } else if (error.response?.status === 404) {
        setError('User not found. Please register first.');
      } else {
        setError('Failed to verify email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setSuccess('');
    setResendLoading(true);

    try {
      await userAPI.resendOTP(email);
      setSuccess('New OTP sent to your email!');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-xs sm:max-w-sm flex flex-col justify-center" style={{ maxWidth: '400px' }}>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Verify Your Email</h2>
          <p className="text-gray-600 text-sm">
            We've sent a 6-digit OTP to
          </p>
          <p className="text-blue-600 font-semibold text-sm">
            {email}
          </p>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter OTP
            </label>
            <input
              type="text"
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className={`input-field w-full text-center text-2xl tracking-widest ${
                otp.length === 6 ? 'border-green-500' : 
                otp.length > 0 ? 'border-blue-500' : 
                'border-gray-300'
              }`}
              placeholder="000000"
              maxLength={6}
              required
              disabled={loading}
              autoComplete="one-time-code"
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-500">
              Enter the 6-digit code sent to your email
            </p>
              <p className="text-xs text-gray-400">
                {otp.length}/6
              </p>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Didn't receive the code?
            </p>
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={resendLoading}
              className="text-blue-600 hover:text-blue-800 text-sm font-semibold disabled:opacity-50"
            >
              {resendLoading ? 'Sending...' : 'Resend OTP'}
            </button>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">
                Already verified your email?
              </p>
              <button
                type="button"
                onClick={() => navigate('/signin')}
                className="text-green-600 hover:text-green-800 text-sm font-semibold"
              >
                Go to Sign In →
              </button>
            </div>
          </div>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/onboarding')}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            ← Back to Registration
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification; 
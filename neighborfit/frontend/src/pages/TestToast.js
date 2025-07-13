import React from 'react';
import { useToast } from '../context/ToastContext';

function TestToast() {
  const { showSuccess, showError, showWarning, showInfo } = useToast();

  const handleSuccessToast = () => {
    showSuccess('🎉 Success! Your action was completed successfully.');
  };

  const handleErrorToast = () => {
    showError('❌ Error! Something went wrong. Please try again.');
  };

  const handleWarningToast = () => {
    showWarning('⚠️ Warning! Please check your input and try again.');
  };

  const handleInfoToast = () => {
    showInfo('ℹ️ Info! Here is some helpful information for you.');
  };

  const handleSignUpToast = () => {
    showSuccess('Welcome to NeighborFit, John Doe! 🎉 Your account has been created successfully.');
  };

  const handleSignInToast = () => {
    showSuccess('Welcome back, John Doe! 👋');
  };

  const handleLogoutToast = () => {
    showSuccess('You have been logged out successfully. See you soon! 👋');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Toast Notification Demo
          </h1>
          <p className="text-gray-600">
            Click the buttons below to test different types of toast notifications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Toast Types */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Toast Types</h2>
            <div className="space-y-3">
              <button
                onClick={handleSuccessToast}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Show Success Toast
              </button>
              <button
                onClick={handleErrorToast}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Show Error Toast
              </button>
              <button
                onClick={handleWarningToast}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Show Warning Toast
              </button>
              <button
                onClick={handleInfoToast}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Show Info Toast
              </button>
            </div>
          </div>

          {/* App-Specific Toasts */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">App-Specific Toasts</h2>
            <div className="space-y-3">
              <button
                onClick={handleSignUpToast}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Sign Up Success Toast
              </button>
              <button
                onClick={handleSignInToast}
                className="w-full bg-secondary-600 hover:bg-secondary-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Sign In Success Toast
              </button>
              <button
                onClick={handleLogoutToast}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Logout Success Toast
              </button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="card mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">How to Use Toasts in Your App</h2>
          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-medium text-gray-900">1. Import the useToast hook:</h3>
              <code className="block bg-gray-100 p-2 rounded mt-1 text-sm">
                import &#123; useToast &#125; from '../context/ToastContext';
              </code>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">2. Use the hook in your component:</h3>
              <code className="block bg-gray-100 p-2 rounded mt-1 text-sm">
                const &#123; showSuccess, showError, showWarning, showInfo &#125; = useToast();
              </code>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">3. Call the toast functions:</h3>
              <code className="block bg-gray-100 p-2 rounded mt-1 text-sm">
                showSuccess('Your message here');
                <br />
                showError('Error message here');
                <br />
                showWarning('Warning message here');
                <br />
                showInfo('Info message here');
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestToast; 
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import { ArrowLeft, ArrowRight, Check, Home } from 'lucide-react';
import { userAPI } from '../../../lib/api';

function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: '',
    workStyle: '',
    city: '',
    familyStatus: '',
    lifestyle: '',
    priceRange: [10000, 100000],
    amenities: []
  });
  const [error, setError] = useState(null);
  const [emailExists, setEmailExists] = useState(false);
  
  const { setUser, updatePreferences } = useUser();
  const navigate = useNavigate();
  const totalSteps = 3;



  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setError(null);
    
    // Debug: Log the form data
    console.log('Form data on submit:', formData);
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'password', 'age', 'gender'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      setError(`Missing required fields: ${missingFields.join(', ')}`);
      return;
    }
    
    // Validate email format
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      // Call backend registration API
      const registrationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        age: Number(formData.age),
        gender: formData.gender
      };
      
      console.log('Sending registration data:', registrationData);
      
      const response = await userAPI.register(registrationData);
      
      console.log('Registration response:', response.data);
      
      // Check if email verification is required
      if (response.data.requiresEmailVerification) {
        // Store preferences temporarily for after verification
        localStorage.setItem('pendingPreferences', JSON.stringify(formData));
        
        // Navigate to email verification page
        navigate('/verify-email', { 
          state: { email: formData.email }
        });
      } else if (response.data.token && response.data.user) {
        // Old flow - direct login (shouldn't happen with new system)
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        updatePreferences(formData);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Registration error:', err);
      console.error('Error response:', err.response?.data);
      
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
    }
  };

  // Check email existence on blur
  const checkEmailExists = async (email) => {
    if (!/^\S+@\S+\.\S+$/.test(email)) return;
    try {
      const res = await userAPI.checkEmail(email);
      setEmailExists(res.data.exists);
      if (res.data.exists) setError('User with this email already exists.');
      else setError(null);
    } catch (e) {
      setEmailExists(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome! Let's get to know you</h2>
              <p className="text-gray-600">Enter your details</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="input-field"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  handleInputChange('email', e.target.value);
                  setEmailExists(false);
                }}
                onBlur={(e) => checkEmailExists(e.target.value)}
                className="input-field"
                placeholder="Enter your email"
              />
              {emailExists && (
                <span className="text-red-500 text-sm">User with this email already exists.</span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="input-field"
                placeholder="Enter password"
                minLength={6}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className="input-field"
                placeholder="Confirm password"
                minLength={6}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
              <input
                type="number"
                min="10"
                max="120"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                className="input-field"
                placeholder="Enter your age"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="input-field"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Preferences</h2>
              <p className="text-gray-600">Tell us about your work style and city</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">What's your work style?</label>
              <div className="grid grid-cols-2 gap-4">
                {['remote', 'hybrid', 'office', 'freelance'].map(style => (
                  <button
                    key={style}
                    onClick={() => handleInputChange('workStyle', style)}
                    className={`py-4 rounded-full border-2 transition-all duration-200 font-medium text-base shadow-sm hover:shadow-md px-6 ${
                      formData.workStyle === style
                        ? 'border-blue-500 bg-blue-50 text-blue-700 scale-105 shadow-lg'
                        : 'border-gray-200 hover:border-blue-300 hover:text-blue-600 bg-white'
                    }`}
                  >
                    <Home className="w-6 h-6 mx-auto mb-2" />
                    <p className="font-medium capitalize">{style}</p>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">Which city are you looking in? <span className="text-gray-500 text-sm">(Optional)</span></label>
              <div className="grid grid-cols-2 gap-4">
                {['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad'].map(city => (
                  <button
                    key={city}
                    onClick={() => handleInputChange('city', city)}
                    className={`py-3 rounded-full border-2 transition-all duration-200 font-medium text-base shadow-sm hover:shadow-md px-6 ${
                      formData.city === city
                        ? 'border-blue-500 bg-blue-50 text-blue-700 scale-105 shadow-lg'
                        : 'border-gray-200 hover:border-blue-300 hover:text-blue-600 bg-white'
                    }`}
                  >
                    <p className="font-medium">{city}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Family & Lifestyle</h2>
              <p className="text-gray-600">This helps us understand your needs</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Family status?
              </label>
              <div className="grid grid-cols-2 gap-4">
                {['single', 'couple', 'nuclear-family', 'joint-family', 'roommates', 'bachelor'].map(status => (
                  <button
                    key={status}
                    onClick={() => handleInputChange('familyStatus', status)}
                    className={`py-4 rounded-full border-2 transition-all duration-200 font-medium text-base shadow-sm hover:shadow-md px-6 ${
                      formData.familyStatus === status
                        ? 'border-blue-500 bg-blue-50 text-blue-700 scale-105 shadow-lg'
                        : 'border-gray-200 hover:border-blue-300 hover:text-blue-600 bg-white'
                    }`}
                  >
                    <p className="font-medium capitalize">{status.replace('-', ' ')}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Lifestyle preference?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['traditional', 'modern', 'cultural', 'spiritual', 'active', 'social', 'quiet'].map(lifestyle => (
                  <button
                    key={lifestyle}
                    onClick={() => handleInputChange('lifestyle', lifestyle)}
                    className={`py-3 rounded-full border-2 transition-all duration-200 font-medium text-base shadow-sm hover:shadow-md px-6 ${
                      formData.lifestyle === lifestyle
                        ? 'border-blue-500 bg-blue-50 text-blue-700 scale-105 shadow-lg'
                        : 'border-gray-200 hover:border-blue-300 hover:text-blue-600 bg-white'
                    }`}
                  >
                    <p className="font-medium capitalize">{lifestyle}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.name.trim() &&
          formData.email.trim() &&
          /^\S+@\S+\.\S+$/.test(formData.email) &&
          !emailExists &&
          formData.password &&
          formData.password.length >= 6 &&
          formData.confirmPassword &&
          formData.password === formData.confirmPassword &&
          formData.age &&
          Number(formData.age) >= 10 &&
          Number(formData.age) <= 120 &&
          formData.gender
        );
      case 2:
        return formData.workStyle; // City is optional
      case 3:
        // For step 3, we need basic user info from step 1
        return (
          formData.name.trim() &&
          formData.email.trim() &&
          /^\S+@\S+\.\S+$/.test(formData.email) &&
          !emailExists &&
          formData.password &&
          formData.password.length >= 6 &&
          formData.confirmPassword &&
          formData.password === formData.confirmPassword &&
          formData.age &&
          Number(formData.age) >= 10 &&
          Number(formData.age) <= 120 &&
          formData.gender
        );
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Step Content */}
        <div className="card">
          {renderStep()}
        </div>
        <div className="mt-4 text-center">
          <span>Already have an account? </span>
          <Link to="/signin" className="text-blue-600 hover:underline">Sign In</Link>
        </div>

        {/* Error message */}
        {error && <div className="text-red-600 mb-2 text-center">{error}</div>}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center px-8 py-4 rounded-full font-semibold text-base transition-colors duration-200 shadow-md hover:shadow-lg ${
              currentStep === 1
                ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                : 'text-gray-700 hover:text-blue-700 hover:bg-blue-50 bg-white'
            }`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </button>

          {currentStep === totalSteps ? (
            <button
              onClick={handleSubmit}
              disabled={!isStepValid()}
              className={`flex items-center px-8 py-4 rounded-full font-semibold text-base transition-colors duration-200 shadow-md hover:shadow-lg ${
                isStepValid()
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Complete Setup
              <Check className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={nextStep}
              disabled={!isStepValid()}
              className={`flex items-center px-8 py-4 rounded-full font-semibold text-base transition-colors duration-200 shadow-md hover:shadow-lg ${
                isStepValid()
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Onboarding; 
import React from 'react';
import SignInForm from './SignInForm';
import { Link, useNavigate } from 'react-router-dom';

const SignIn = () => {
  const navigate = useNavigate();
  const handleSuccess = () => {
    navigate('/dashboard');
  };
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <SignInForm onSuccess={handleSuccess} />
      <div className="mb-2 text-right">
        <Link to="/forgot-password" className="text-blue-600 hover:underline text-sm">Forgot Password?</Link>
      </div>
      <div className="mt-4 text-center">
        <span>Don't have an account? </span>
        <Link to="/onboarding" className="text-blue-600 hover:underline">Sign Up</Link>
      </div>
    </div>
  );
};

export default SignIn; 
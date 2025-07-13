import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../../../lib/api';
import { useUser } from '../../../context/UserContext';
import { useToast } from '../../../context/ToastContext';
import LoadingSpinner from '../../ui/LoadingSpinner';

const SignInForm = ({ onSuccess }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [error, setError] = React.useState(null);
  const { setUser } = useUser();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setError(null);
    try {
      const response = await userAPI.login(data);
      if (response.data.token && response.data.user) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        
        // Show success toast
        showSuccess(`Welcome back, ${response.data.user.name}! 👋`);
        
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      const errorResponse = err.response?.data;
      
      // Check if email verification is required
      if (errorResponse?.requiresEmailVerification) {
        showError('Please verify your email before signing in');
        navigate('/verify-email', { 
          state: { email: errorResponse.email }
        });
        return;
      }
      
      const errorMessage = errorResponse?.message || 'Invalid email or password.';
      setError(errorMessage);
      showError(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`bg-white p-6 rounded shadow-md w-full max-w-md mx-auto transition-all duration-300 ${isSubmitting ? 'opacity-60 pointer-events-none blur-[1px]' : ''}`}>
      <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>
      {error && <div className="text-red-600 mb-2 text-center">{error}</div>}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Email</label>
        <input
          type="email"
          {...register('email', { required: 'Email is required' })}
          className="w-full p-2 border rounded"
        />
        {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Password</label>
        <input
          type="password"
          {...register('password', { required: 'Password is required' })}
          className="w-full p-2 border rounded"
        />
        {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition flex items-center justify-center"
        disabled={isSubmitting}
      >
        {isSubmitting ? <><LoadingSpinner size="small" color="white" /><span className="ml-2">Signing In...</span></> : 'Sign In'}
      </button>
    </form>
  );
};

export default SignInForm; 
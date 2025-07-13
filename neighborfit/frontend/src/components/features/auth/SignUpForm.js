import React from 'react';
import { useForm } from 'react-hook-form';
import { userAPI } from '../../../lib/api';
import { useUser } from '../../../context/UserContext';
import { useToast } from '../../../context/ToastContext';

const SignUpForm = ({ onSuccess }) => {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      preferences: {
        priceRange: 50000,
        workStyle: 'remote',
        familyStatus: 'single',
        lifestyle: 'modern'
      }
    }
  });
  const [error, setError] = React.useState(null);
  const { setUser } = useUser();
  const { showSuccess, showError } = useToast();

  const onSubmit = async (data) => {
    setError(null);
    try {
      // Structure the priceRange correctly for the backend
      const payload = {
        ...data,
        preferences: {
          ...data.preferences,
          priceRange: [10000, parseInt(data.preferences.priceRange, 10)]
        }
      };

      const response = await userAPI.register(payload);
      if (response.data.token && response.data.user) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        
        // Show success toast
        showSuccess(`Welcome to NeighborFit, ${response.data.user.name}! 🎉 Your account has been created successfully.`);
        
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      showError(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded shadow-md w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
      {error && <div className="text-red-600 mb-2 text-center">{error}</div>}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Name</label>
        <input
          type="text"
          {...register('name', { required: 'Name is required' })}
          className="w-full p-2 border rounded"
        />
        {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
      </div>
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
          {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
          className="w-full p-2 border rounded"
        />
        {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Age</label>
        <input
          type="number"
          min="10"
          max="120"
          {...register('age', { required: 'Age is required', min: { value: 10, message: 'Minimum age is 10' }, max: { value: 120, message: 'Maximum age is 120' } })}
          className="w-full p-2 border rounded"
        />
        {errors.age && <span className="text-red-500 text-sm">{errors.age.message}</span>}
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Gender</label>
        <select
          {...register('gender', { required: 'Gender is required' })}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        {errors.gender && <span className="text-red-500 text-sm">{errors.gender.message}</span>}
      </div>

      {/* Work Style */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold" htmlFor="workStyle">Work Style</label>
        <select
          id="workStyle"
          {...register('preferences.workStyle', { required: 'Work Style is required' })}
          className="w-full p-2 border rounded"
        >
          <option value="remote">Remote</option>
          <option value="hybrid">Hybrid</option>
          <option value="office">In-Office</option>
          <option value="freelance">Freelance</option>
        </select>
        {errors.preferences?.workStyle && <span className="text-red-500 text-sm">{errors.preferences.workStyle.message}</span>}
      </div>

      {/* Family Status */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold" htmlFor="familyStatus">Family Status</label>
        <select
          id="familyStatus"
          {...register('preferences.familyStatus', { required: 'Family Status is required' })}
          className="w-full p-2 border rounded"
        >
          <option value="single">Single</option>
          <option value="couple">Couple</option>
          <option value="nuclear-family">Nuclear Family</option>
          <option value="joint-family">Joint Family</option>
          <option value="roommates">Roommates/PG</option>
          <option value="bachelor">Bachelor</option>
        </select>
        {errors.preferences?.familyStatus && <span className="text-red-500 text-sm">{errors.preferences.familyStatus.message}</span>}
      </div>

      {/* Lifestyle */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold" htmlFor="lifestyle">Lifestyle</label>
        <select
          id="lifestyle"
          {...register('preferences.lifestyle', { required: 'Lifestyle is required' })}
          className="w-full p-2 border rounded"
        >
          <option value="traditional">Traditional</option>
          <option value="modern">Modern</option>
          <option value="cultural">Cultural</option>
          <option value="spiritual">Spiritual</option>
          <option value="active">Active/Fitness</option>
          <option value="social">Social</option>
          <option value="quiet">Quiet/Peaceful</option>
        </select>
        {errors.preferences?.lifestyle && <span className="text-red-500 text-sm">{errors.preferences.lifestyle.message}</span>}
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-semibold">Budget Range</label>
        <input
          type="range"
          min="10000"
          max="100000"
          step="1000"
          {...register('preferences.priceRange')}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="text-center mt-1">Up to ₹{watch('preferences.priceRange')}</div>
      </div>
      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Signing Up...' : 'Sign Up'}
      </button>
    </form>
  );
};

export default SignUpForm; 
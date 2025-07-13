import React, { useState } from 'react';
import { useUser } from '../../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { User, Save, Edit, Eye, EyeOff, Download, Trash2, X } from 'lucide-react';
import { userAPI } from '../../../lib/api';
import { useToast } from '../../../context/ToastContext';

function Profile() {
  const { user, preferences, updatePreferences, setUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(preferences);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const handleSave = async () => {
    try {
      setLoading(true);
      const fullPreferences = {
        ...preferences,
        ...formData
      };
      
      const response = await userAPI.updatePreferences(fullPreferences);
      
      if (response.data) {
        setUser(response.data);
        updatePreferences(response.data.preferences || fullPreferences);
      } else {
        updatePreferences(fullPreferences);
      }
      
      setIsEditing(false);
      showSuccess('Preferences updated successfully!');
    } catch (error) {
      console.error('Save preferences error:', error);
      showError('Failed to update preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError('New passwords do not match!');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      showError('Password must be at least 8 characters long!');
      return;
    }

    try {
      setLoading(true);
      await userAPI.changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      setShowChangePassword(false);
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      showSuccess('Password changed successfully!');
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      setLoading(true);
      const response = await userAPI.exportData();
      
      const dataStr = JSON.stringify(response.data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `neighborfit-data-${user.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showSuccess('Your data has been downloaded successfully!');
    } catch (error) {
      showError('Failed to export data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      await userAPI.deleteAccount();
      localStorage.removeItem('token');
      setUser(null);
      showSuccess('Account deleted successfully. We\'re sorry to see you go!');
      navigate('/');
    } catch (error) {
      showError('Failed to delete account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in</h2>
          <a href="/onboarding" className="btn-primary">Get Started</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mr-4">
              <User className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-600">Member since {new Date(user.createdAt || Date.now()).toLocaleDateString('en-IN')}</p>
            </div>
          </div>
          
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            disabled={loading}
            className="btn-primary flex items-center"
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </>
            ) : (
              <>
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </>
            )}
          </button>
        </div>

        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Preferences</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Style
              </label>
              {isEditing ? (
                <select
                  value={formData.workStyle}
                  onChange={(e) => handleInputChange('workStyle', e.target.value)}
                  className="input-field"
                >
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="office">In-Office</option>
                  <option value="freelance">Freelance</option>
                </select>
              ) : (
                <p className="text-gray-900 capitalize">{preferences.workStyle || 'Not specified'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Family Status
              </label>
              {isEditing ? (
                <select
                  value={formData.familyStatus}
                  onChange={(e) => handleInputChange('familyStatus', e.target.value)}
                  className="input-field"
                >
                  <option value="single">Single</option>
                  <option value="couple">Couple</option>
                  <option value="nuclear-family">Nuclear Family</option>
                  <option value="joint-family">Joint Family</option>
                  <option value="roommates">Roommates/PG</option>
                  <option value="bachelor">Bachelor</option>
                </select>
              ) : (
                <p className="text-gray-900 capitalize">{preferences.familyStatus?.replace('-', ' ') || 'Not specified'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lifestyle
              </label>
              {isEditing ? (
                <select
                  value={formData.lifestyle}
                  onChange={(e) => handleInputChange('lifestyle', e.target.value)}
                  className="input-field"
                >
                  <option value="traditional">Traditional</option>
                  <option value="modern">Modern</option>
                  <option value="cultural">Cultural</option>
                  <option value="spiritual">Spiritual</option>
                  <option value="active">Active/Fitness</option>
                  <option value="social">Social</option>
                  <option value="quiet">Quiet/Peaceful</option>
                </select>
              ) : (
                <p className="text-gray-900 capitalize">{preferences.lifestyle || 'Not specified'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget Range
              </label>
              {isEditing ? (
                <div>
                  <input
                    type="range"
                    min="10000"
                    max="100000"
                    step="5000"
                    value={formData.priceRange?.[1] || 50000}
                    onChange={(e) => handleInputChange('priceRange', [10000, parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-600 mt-1">Up to ₹{(formData.priceRange?.[1] || 50000).toLocaleString('en-IN')}</p>
                </div>
              ) : (
                <p className="text-gray-900">Up to ₹{(preferences.priceRange?.[1] || 50000).toLocaleString('en-IN')}</p>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="mt-6 pt-6 border-t border-gray-200 flex space-x-4">
              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData(preferences);
                }}
                className="bg-white text-gray-700 font-semibold py-3 px-6 rounded-full border-2 border-gray-200 hover:border-gray-300 hover:text-gray-800 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Settings</h2>
          <div className="divide-y divide-gray-200">
            <button 
              onClick={() => setShowChangePassword(true)}
              className="w-full text-left py-4 px-2 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="text-gray-700 font-medium">Change Password</span>
              <Edit className="w-5 h-5 text-gray-400" />
            </button>
            <button 
              onClick={handleExportData}
              disabled={loading}
              className="w-full text-left py-4 px-2 flex items-center justify-between hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <span className="text-gray-700 font-medium">{loading ? 'Exporting...' : 'Export My Data'}</span>
              <Download className="w-5 h-5 text-gray-400" />
            </button>
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full text-left py-4 px-2 flex items-center justify-between hover:bg-red-50 transition-colors"
            >
              <span className="text-red-600 font-medium">Delete Account</span>
              <Trash2 className="w-5 h-5 text-red-500" />
            </button>
          </div>
        </div>

        {showChangePassword && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
                <button
                  onClick={() => setShowChangePassword(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.old ? 'text' : 'password'}
                      value={passwordData.oldPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, oldPassword: e.target.value }))}
                      className="input-field pr-10"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, old: !prev.old }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.old ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="input-field pr-10"
                      placeholder="Enter new password"
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="input-field pr-10"
                      placeholder="Confirm new password"
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleChangePassword}
                  disabled={loading || !passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                  className="bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-full shadow-md hover:bg-blue-700 transition-all flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
                <button
                  onClick={() => setShowChangePassword(false)}
                  className="bg-white text-gray-700 font-semibold px-6 py-2.5 rounded-full border-2 border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-all shadow-md flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-red-600">Delete Account</h3>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700 mb-3">
                  Are you sure you want to delete your account? This action cannot be undone.
                </p>
                <p className="text-sm text-gray-600">
                  All your data, preferences, and saved neighborhoods will be permanently removed.
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex-1 font-medium transition-colors"
                >
                  {loading ? 'Deleting...' : 'Yes, Delete Account'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile; 
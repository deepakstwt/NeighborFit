import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import { neighborhoodAPI } from '../../../lib/api';
import { 
  Heart, 
  MapPin, 
  TrendingUp, 
  Navigation, 
  Briefcase, 
  Users, 
  Sparkles, 
  Building2,
  ArrowRight,
  Award,
  Target,
  Zap,
  Globe,
  Search,
  ChevronRight,
  Eye,
  Settings,
  RefreshCw
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { userAPI } from '../../../lib/api';
import ModernAIChatbot from '../ai/ModernAIChatbot';
import PersonalizedRecommendations from '../recommendations/PersonalizedRecommendations';

function Dashboard() {
  const { user, preferences, setUser } = useUser();
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  // Update time every minute for dynamic greeting
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const getTimeBasedGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return { text: 'Good morning', emoji: '🌅', color: 'from-amber-500 to-orange-600' };
    if (hour < 17) return { text: 'Good afternoon', emoji: '☀️', color: 'from-emerald-500 to-teal-600' };
    return { text: 'Good evening', emoji: '🌙', color: 'from-violet-500 to-purple-600' };
  };

  // High-quality fallback images for neighborhoods
  const getFallbackImage = (index) => {
    const fallbackImages = [
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop&crop=center&auto=format&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop&crop=center&auto=format&q=80',
      'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?w=600&h=400&fit=crop&crop=center&auto=format&q=80',
      'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=600&h=400&fit=crop&crop=center&auto=format&q=80',
      'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=600&h=400&fit=crop&crop=center&auto=format&q=80'
    ];
    return fallbackImages[index % fallbackImages.length];
  };

  const fetchNeighborhoods = useCallback(async () => {
    try {
      setLoading(true);
      const response = await neighborhoodAPI.getAll();
      const sortedNeighborhoods = response.data
        .sort((a, b) => {
          const scoreA = (a.safetyScore + a.lifestyleScore + a.transportScore) / 3;
          const scoreB = (b.safetyScore + b.lifestyleScore + b.transportScore) / 3;
          return scoreB - scoreA;
        })
        .slice(0, 3)
        .map((neighborhood, index) => ({
          ...neighborhood,
          matchScore: Math.round(92 - (index * 5))
        }));
      setNeighborhoods(sortedNeighborhoods);
    } catch (error) {
      console.error('Error fetching neighborhoods:', error);
      showError('Failed to fetch neighborhoods. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    if (user) {
      fetchNeighborhoods();
    }
  }, [user, fetchNeighborhoods]);

  const handleViewDetails = (neighborhoodId) => {
    navigate(`/neighborhoods/${neighborhoodId}`);
  };

  const handleToggleFavorite = async (neighborhoodId) => {
    try {
      if (!user) {
        showError('Please log in to save favorites.');
        return;
      }

      const isCurrentlyFavorite = user.favoriteNeighborhoods?.includes(neighborhoodId);
      
      let response;
      if (isCurrentlyFavorite) {
        response = await userAPI.removeFavorite(neighborhoodId);
        showSuccess('Neighborhood removed from favorites!');
      } else {
        response = await userAPI.addFavorite(neighborhoodId);
        showSuccess('Neighborhood added to favorites!');
      }
      
      if (response && response.data) {
        setUser({
          ...user,
          favoriteNeighborhoods: response.data.favoriteNeighborhoods || []
        });
      }
    } catch (error) {
      showError('Failed to update favorites. Please try again.');
    }
  };

  const handleGetDirections = (neighborhood) => {
    if (!neighborhood || !neighborhood.location || !neighborhood.location.coordinates) {
      showError('Location coordinates not available for this neighborhood.');
      return;
    }

    const [longitude, latitude] = neighborhood.location.coordinates;
    const destination = `${latitude},${longitude}`;
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    let mapUrl;
    
    if (isMobile) {
      if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        mapUrl = `maps://maps.apple.com/?daddr=${destination}&dirflg=d&t=m`;
        const appleMapsLink = document.createElement('a');
        appleMapsLink.href = mapUrl;
        appleMapsLink.click();
        setTimeout(() => {
          window.open(`https://maps.google.com/maps?daddr=${destination}&dirflg=d`, '_blank');
        }, 500);
        return;
      } else if (/Android/i.test(navigator.userAgent)) {
        mapUrl = `google.navigation:q=${destination}`;
        const googleMapsLink = document.createElement('a');
        googleMapsLink.href = mapUrl;
        googleMapsLink.click();
        setTimeout(() => {
          window.open(`https://maps.google.com/maps?daddr=${destination}&dirflg=d`, '_blank');
        }, 500);
        return;
      }
    }

    mapUrl = `https://maps.google.com/maps?daddr=${destination}&dirflg=d`;
    window.open(mapUrl, '_blank');
    showSuccess('Opening directions in map application...');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-stone-50 to-slate-100">
        {/* Elegant background patterns */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.05),transparent_50%)]"></div>
        
        <div className="relative flex items-center justify-center min-h-screen p-4">
          <div className="max-w-md w-full">
            <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Building2 className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Welcome to NeighborFit</h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Discover your perfect neighborhood match with our AI-powered recommendations
              </p>
          <button 
            onClick={() => navigate('/onboarding')} 
                className="w-full bg-gradient-to-r from-slate-800 to-slate-900 text-white font-semibold py-4 px-8 rounded-2xl hover:from-slate-900 hover:to-black transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
          >
            Get Started
                <ArrowRight className="w-5 h-5" />
          </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-stone-50 to-slate-100">
        {/* Elegant background patterns */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.05),transparent_50%)]"></div>
        
        <div className="relative flex items-center justify-center min-h-screen">
        <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-slate-800 mx-auto mb-6"></div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-slate-400 to-slate-600 opacity-20 animate-pulse"></div>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Curating Your Matches</h3>
            <p className="text-slate-600">Finding the perfect neighborhoods for you...</p>
          </div>
        </div>
      </div>
    );
  }

  const greeting = getTimeBasedGreeting();

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-stone-50 to-slate-100">
      {/* Sophisticated background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.05),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Refined Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/3 via-stone-900/3 to-neutral-900/3"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-slate-400/8 to-stone-600/8 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-stone-400/8 to-neutral-600/8 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
          {/* Time-based Greeting */}
          <div className="text-center mb-12">
            <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r ${greeting.color} text-white shadow-lg mb-6`}>
              <span className="text-2xl">{greeting.emoji}</span>
              <span className="font-medium">{greeting.text}</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-4 tracking-tight">
              Welcome back,{' '}
              <span className="bg-gradient-to-r from-slate-700 via-stone-700 to-neutral-700 bg-clip-text text-transparent">
                {user.name}
              </span>
          </h1>
            
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Your personalized neighborhood matches in{' '}
              <span className="font-semibold text-slate-800">{preferences?.city || 'India'}</span>
          </p>
        </div>

          {/* Premium Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {/* Total Matches */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-stone-700 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white/70 backdrop-blur-2xl rounded-2xl p-6 shadow-xl border border-white/30 hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center shadow-lg">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded-full">
                    MATCHES
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{neighborhoods.length}</div>
                <div className="text-sm text-slate-600">Total Matches</div>
              </div>
            </div>

            {/* Saved Favorites */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white/70 backdrop-blur-2xl rounded-2xl p-6 shadow-xl border border-white/30 hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-xs font-medium text-rose-700 bg-rose-100 px-2 py-1 rounded-full">
                    SAVED
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{user.favoriteNeighborhoods?.length || 0}</div>
                <div className="text-sm text-slate-600">Favorites</div>
          </div>
            </div>

            {/* Best Match */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white/70 backdrop-blur-2xl rounded-2xl p-6 shadow-xl border border-white/30 hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-xs font-medium text-amber-700 bg-amber-100 px-2 py-1 rounded-full">
                    BEST
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{neighborhoods[0]?.matchScore || 0}%</div>
                <div className="text-sm text-slate-600">Match Score</div>
          </div>
            </div>

            {/* Search Area */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white/70 backdrop-blur-2xl rounded-2xl p-6 shadow-xl border border-white/30 hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">
                    AREA
                  </div>
                </div>
                <div className="text-xl font-bold text-slate-900 mb-1 truncate">{preferences?.city || 'India'}</div>
                <div className="text-sm text-slate-600">Search Area</div>
          </div>
            </div>
          </div>
          </div>
        </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Preferences Overview */}
        {preferences && (
          <div className="mb-16">
            <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl flex items-center justify-center shadow-lg">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Your Preferences</h2>
                    <p className="text-slate-600">Tailored to your lifestyle</p>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/profile')}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-slate-700 font-medium"
                >
                  <Settings className="w-4 h-4" />
                  Edit
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-slate-50 to-stone-100 rounded-2xl p-6 border border-slate-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-slate-700" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-700">Work Style</div>
                      <div className="text-lg font-semibold text-slate-900 capitalize">{preferences.workStyle || 'Not specified'}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-rose-50 to-pink-100 rounded-2xl p-6 border border-rose-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-rose-700" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-rose-700">Family Status</div>
                      <div className="text-lg font-semibold text-slate-900 capitalize">{preferences.familyStatus || 'Not specified'}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl p-6 border border-amber-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-amber-700" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-amber-700">Lifestyle</div>
                      <div className="text-lg font-semibold text-slate-900 capitalize">{preferences.lifestyle || 'Not specified'}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-teal-100 rounded-2xl p-6 border border-emerald-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Navigation className="w-5 h-5 text-emerald-700" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-emerald-700">Commute</div>
                      <div className="text-lg font-semibold text-slate-900">{preferences.commutePreference || 'Not specified'}</div>
                    </div>
            </div>
            </div>
            </div>
            </div>
          </div>
        )}

        {/* Neighborhood Recommendations */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Top Recommendations</h2>
                <p className="text-slate-600">Perfectly matched to your preferences</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/explore')}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-slate-700 font-medium"
            >
              <Search className="w-4 h-4" />
              Explore All
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {neighborhoods.map((neighborhood, index) => {
              const isFavorite = user.favoriteNeighborhoods?.includes(neighborhood._id);
              
              return (
                <div key={neighborhood._id} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-stone-700 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                  <div className="relative bg-white/70 backdrop-blur-2xl rounded-2xl overflow-hidden shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-500">
                    {/* Image Container */}
                    <div className="relative h-48 overflow-hidden bg-slate-100">
                      <img 
                        src={neighborhood.image || neighborhood.imageUrl || getFallbackImage(index)} 
                    alt={neighborhood.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = getFallbackImage(index);
                        }}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      
                      {/* Best Match Badge */}
                      {index === 0 && (
                        <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                          <Award className="w-4 h-4 inline-block mr-1" />
                          Best Match
                        </div>
                      )}
                      
                      {/* Favorite Button */}
                      <button
                        onClick={() => handleToggleFavorite(neighborhood._id)}
                        className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                          isFavorite 
                            ? 'bg-rose-500 text-white hover:bg-rose-600' 
                            : 'bg-white/90 backdrop-blur-sm text-slate-700 hover:bg-white'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 mb-2">{neighborhood.name}</h3>
                          <div className="flex items-center gap-2 text-slate-600">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{neighborhood.city}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-slate-900">{neighborhood.matchScore}%</div>
                          <div className="text-xs text-slate-600">Match</div>
                  </div>
                </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-slate-900">{Math.round(neighborhood.safetyScore || 0)}</div>
                          <div className="text-xs text-slate-600">Safety</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-slate-900">{Math.round(neighborhood.lifestyleScore || 0)}</div>
                          <div className="text-xs text-slate-600">Lifestyle</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-slate-900">{Math.round(neighborhood.transportScore || 0)}</div>
                          <div className="text-xs text-slate-600">Transport</div>
                        </div>
                </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                  <button 
                    onClick={() => handleViewDetails(neighborhood._id)}
                          className="flex-1 bg-gradient-to-r from-slate-700 to-slate-800 text-white px-4 py-2 rounded-xl font-medium hover:from-slate-800 hover:to-slate-900 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
                  >
                          <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  <button 
                    onClick={() => handleGetDirections(neighborhood)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl font-medium transition-colors flex items-center justify-center"
                  >
                    <Navigation className="w-4 h-4" />
                  </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Quick Actions</h2>
              <p className="text-slate-600">Streamline your neighborhood search</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <button 
              onClick={() => navigate('/explore')} 
              className="group bg-white/70 backdrop-blur-2xl rounded-2xl p-6 shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-300 text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Explore Neighborhoods</h3>
              <p className="text-sm text-slate-600">Browse all available neighborhoods with advanced filters</p>
            </button>

            <button 
              onClick={() => navigate('/profile')} 
              className="group bg-white/70 backdrop-blur-2xl rounded-2xl p-6 shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-300 text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Update Preferences</h3>
              <p className="text-sm text-slate-600">Refine your search criteria for better matches</p>
            </button>

            <button 
              onClick={fetchNeighborhoods}
              className="group bg-white/70 backdrop-blur-2xl rounded-2xl p-6 shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-300 text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <RefreshCw className="w-6 h-6 text-white" />
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Refresh Matches</h3>
              <p className="text-sm text-slate-600">Get the latest neighborhood recommendations</p>
            </button>
          </div>
        </div>

        {/* Personalized Recommendations Component */}
        <PersonalizedRecommendations />
      </div>

      {/* AI Chat Assistant */}
      <ModernAIChatbot />
    </div>
  );
}

export default Dashboard; 
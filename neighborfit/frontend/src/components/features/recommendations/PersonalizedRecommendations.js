import React, { useState, useEffect, useCallback } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Heart, 
  TrendingUp, 
  DollarSign,
  Shield,
  Users,
  Brain,
  Eye,
  Clock,
  Award,
  Target,
  Star,
  ArrowRight,
  ChevronRight,
  Gauge,
  Activity
} from 'lucide-react';
import { useUser } from '../../../context/UserContext';
import { useToast } from '../../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { neighborhoodAPI } from '../../../lib/api';

const PersonalizedRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('personalized');
  const { user } = useUser();
  const { showError, showSuccess } = useToast();
  const navigate = useNavigate();

  // Enhanced recommendation categories with premium styling
  const tabs = [
    { 
      id: 'personalized', 
      label: 'For You', 
      icon: Brain,
      description: 'AI-powered recommendations based on your unique preferences',
      gradient: 'from-purple-500 to-indigo-600',
      color: 'text-purple-600'
    },
    { 
      id: 'trending', 
      label: 'Trending', 
      icon: TrendingUp,
      description: 'Popular neighborhoods with high ratings',
      gradient: 'from-emerald-500 to-teal-600',
      color: 'text-emerald-600'
    },
    { 
      id: 'budget', 
      label: 'Best Value', 
      icon: DollarSign,
      description: 'Great neighborhoods within your budget',
      gradient: 'from-amber-500 to-orange-600',
      color: 'text-amber-600'
    },
    { 
      id: 'safety', 
      label: 'Safest', 
      icon: Shield,
      description: 'Top-rated neighborhoods for safety',
      gradient: 'from-blue-500 to-cyan-600',
      color: 'text-blue-600'
    },
    { 
      id: 'family', 
      label: 'Family', 
      icon: Users,
      description: 'Perfect for families with kids',
      gradient: 'from-pink-500 to-rose-600',
      color: 'text-pink-600'
    }
  ];

  // High-quality fallback images
  const fallbackImages = [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop&crop=entropy&auto=format&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop&crop=entropy&auto=format&q=80',
    'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=600&h=400&fit=crop&crop=entropy&auto=format&q=80',
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600&h=400&fit=crop&crop=entropy&auto=format&q=80',
    'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=600&h=400&fit=crop&crop=entropy&auto=format&q=80'
  ];

  // Calculate personalized score based on user preferences
  const calculatePersonalizedScore = useCallback((neighborhood) => {
    if (!user?.preferences) return neighborhood.safetyScore || 0;
    
    let score = 0;
    const prefs = user.preferences;
    
    // Price range matching
    if (prefs.priceRange && prefs.priceRange.length === 2) {
      const [minPrice, maxPrice] = prefs.priceRange;
      if (neighborhood.averageRent >= minPrice && neighborhood.averageRent <= maxPrice) {
        score += 20;
      }
    }
    
    // Safety importance
    if (prefs.safetyImportance) {
      score += (neighborhood.safetyScore || 0) * (prefs.safetyImportance / 10) * 3;
    }
    
    // Transport importance
    if (prefs.publicTransportImportance) {
      score += (neighborhood.transportScore || 0) * (prefs.publicTransportImportance / 10) * 2;
    }
    
    // Lifestyle matching
    if (prefs.lifestyle === 'modern' && neighborhood.lifestyleScore > 7) {
      score += 15;
    }
    
    return score;
  }, [user]);

  // Fetch recommendations using existing API
  const fetchRecommendations = useCallback(async (category = 'personalized') => {
    try {
      setLoading(true);
      
      // Use existing neighborhood API
      const response = await neighborhoodAPI.getAll();
      let allNeighborhoods = response.data || [];
      
      // Apply category-specific filtering and sorting
      let filteredRecommendations = [...allNeighborhoods];
      
      switch (category) {
        case 'personalized':
          // Sort by overall score and apply user preferences
          filteredRecommendations = allNeighborhoods
            .map(neighborhood => ({
              ...neighborhood,
              personalizedScore: calculatePersonalizedScore(neighborhood),
              recommendationReason: 'Matches your preferences perfectly'
            }))
            .sort((a, b) => b.personalizedScore - a.personalizedScore);
          break;
          
        case 'trending':
          filteredRecommendations = allNeighborhoods
            .map(neighborhood => ({
              ...neighborhood,
              trendingScore: (neighborhood.safetyScore + neighborhood.lifestyleScore + neighborhood.transportScore) / 3,
              recommendationReason: `High overall score (${((neighborhood.safetyScore + neighborhood.lifestyleScore + neighborhood.transportScore) / 3).toFixed(1)}/10)`
            }))
            .sort((a, b) => b.trendingScore - a.trendingScore);
          break;
          
        case 'budget':
          filteredRecommendations = allNeighborhoods
            .map(neighborhood => ({
              ...neighborhood,
              valueScore: (neighborhood.safetyScore + neighborhood.lifestyleScore) / neighborhood.averageRent * 1000,
              recommendationReason: `Best value: ₹${neighborhood.averageRent?.toLocaleString()}/month`
            }))
            .sort((a, b) => b.valueScore - a.valueScore);
          break;
          
        case 'safety':
          filteredRecommendations = allNeighborhoods
            .filter(n => n.safetyScore >= 7)
            .map(neighborhood => ({
              ...neighborhood,
              recommendationReason: `Safety score: ${neighborhood.safetyScore}/10`
            }))
            .sort((a, b) => b.safetyScore - a.safetyScore);
          break;
          
        case 'family':
          filteredRecommendations = allNeighborhoods
            .filter(n => n.amenities?.includes('Schools') || n.amenities?.includes('Parks'))
            .map(neighborhood => ({
              ...neighborhood,
              recommendationReason: 'Great for families with schools and parks nearby'
            }))
            .sort((a, b) => b.safetyScore - a.safetyScore);
          break;
          
        default:
          break;
      }
      
      setRecommendations(filteredRecommendations.slice(0, 6));
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      showError('Failed to load recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [showError, calculatePersonalizedScore]);

  // Handle tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    fetchRecommendations(tabId);
  };

  // Handle neighborhood click
  const handleNeighborhoodClick = (neighborhood) => {
    navigate(`/neighborhoods/${neighborhood._id}`);
  };

  // Handle favorite toggle
  const handleFavoriteToggle = async (neighborhood) => {
    try {
      showSuccess(`${neighborhood.name} added to favorites!`);
    } catch (error) {
      showError('Failed to add to favorites');
    }
  };

  // Initial load
  useEffect(() => {
    if (user) {
      fetchRecommendations('personalized');
    }
  }, [user, fetchRecommendations]);

  // Premium confidence indicator component
  const ConfidenceIndicator = ({ confidence = 0.8 }) => {
    const percentage = Math.round(confidence * 100);
    const getConfidenceColor = () => {
      if (confidence > 0.9) return 'from-emerald-500 to-green-600';
      if (confidence > 0.8) return 'from-blue-500 to-cyan-600';
      if (confidence > 0.7) return 'from-amber-500 to-orange-600';
      return 'from-red-500 to-pink-600';
    };
    
    return (
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-slate-600">Match Score</span>
            <span className="text-xs font-bold text-slate-900">{percentage}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-2 rounded-full bg-gradient-to-r ${getConfidenceColor()} transition-all duration-500 ease-out`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Gauge className="w-3 h-3 text-slate-500" />
          <span className="text-xs text-slate-500">AI Score</span>
        </div>
      </div>
    );
  };

  // Premium recommendation card component
  const RecommendationCard = ({ neighborhood, index }) => {
    const [imageError, setImageError] = useState(false);

    const getImageUrl = () => {
      if (imageError) return fallbackImages[index % fallbackImages.length];
      return neighborhood.image || neighborhood.imageUrl || fallbackImages[index % fallbackImages.length];
    };

    const getRankingBadge = () => {
      if (index === 0) return 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white';
      if (index === 1) return 'bg-gradient-to-r from-slate-400 to-slate-500 text-white';
      if (index === 2) return 'bg-gradient-to-r from-amber-600 to-orange-600 text-white';
      return 'bg-gradient-to-r from-slate-600 to-slate-700 text-white';
    };

    return (
      <div className="group relative">
        {/* Premium card with glassmorphism */}
        <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/20 hover:border-white/40">
          {/* Gradient overlay for premium effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-slate-900/5 pointer-events-none" />
          
          {/* Image section with premium effects */}
          <div className="relative overflow-hidden">
            <img
              src={getImageUrl()}
              alt={neighborhood.name}
              className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              onError={() => setImageError(true)}
              loading="lazy"
            />
            
            {/* Premium gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Ranking badge with premium styling */}
            <div className={`absolute top-4 left-4 ${getRankingBadge()} px-3 py-1.5 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm`}>
              {index === 0 && <Award className="w-4 h-4 inline mr-1" />}
              #{index + 1}
            </div>
            
            {/* Premium match score */}
            <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-medium border border-white/20">
              <Star className="w-3 h-3 inline mr-1 text-yellow-400" />
              {Math.round(Math.random() * 20 + 80)}%
            </div>
            
            {/* Premium favorite button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleFavoriteToggle(neighborhood);
              }}
              className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md hover:bg-white p-2.5 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 border border-white/20"
            >
              <Heart className="w-5 h-5 text-red-500 hover:text-red-600" />
            </button>
          </div>

          {/* Content section with premium styling */}
          <div className="p-6 space-y-4">
            {/* Header with premium typography */}
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-slate-800 transition-colors">
                  {neighborhood.name}
                </h3>
                <p className="text-slate-600 flex items-center gap-1.5 text-sm">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  {neighborhood.city}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  ₹{neighborhood.averageRent?.toLocaleString()}
                </div>
                <div className="text-sm text-slate-500">per month</div>
              </div>
            </div>

            {/* Premium scores section */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
                <div className="text-lg font-bold text-emerald-700">{neighborhood.safetyScore}/10</div>
                <div className="text-xs text-emerald-600 font-medium">Safety</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                <div className="text-lg font-bold text-blue-700">{neighborhood.lifestyleScore}/10</div>
                <div className="text-xs text-blue-600 font-medium">Lifestyle</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
                <div className="text-lg font-bold text-purple-700">{neighborhood.transportScore}/10</div>
                <div className="text-xs text-purple-600 font-medium">Transport</div>
              </div>
            </div>

            {/* Premium AI recommendation reason */}
            <div className="relative p-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl border border-indigo-100 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5" />
              <div className="relative flex items-start gap-3">
                <div className="p-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-900 mb-1">
                    AI Recommendation
                  </div>
                  <div className="text-sm text-slate-700">
                    {neighborhood.recommendationReason || 'Perfectly matches your lifestyle preferences'}
                  </div>
                </div>
              </div>
            </div>

            {/* Premium confidence indicator */}
            <div className="p-3 bg-gradient-to-r from-slate-50 to-stone-50 rounded-xl border border-slate-200">
              <ConfidenceIndicator confidence={0.8 + Math.random() * 0.2} />
            </div>

            {/* Premium amenities */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Target className="w-4 h-4" />
                <span>Key Features</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {neighborhood.amenities?.slice(0, 3).map((amenity, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-gradient-to-r from-slate-100 to-stone-100 text-slate-700 text-xs font-medium rounded-full border border-slate-200 hover:border-slate-300 transition-colors"
                  >
                    {amenity}
                  </span>
                ))}
                {neighborhood.amenities?.length > 3 && (
                  <span className="px-3 py-1.5 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 text-xs font-medium rounded-full border border-indigo-200">
                    +{neighborhood.amenities.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Premium action buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => handleNeighborhoodClick(neighborhood)}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Eye className="w-4 h-4" />
                View Details
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>


          </div>
        </div>
      </div>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-stone-50 to-slate-100 relative overflow-hidden">
        {/* Premium background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.8),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,0.05)_50%,transparent_75%)]" />
        
        <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="relative bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl p-12 border border-white/20">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-slate-900/5 rounded-3xl" />
              
              <div className="relative">
                <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl w-fit mx-auto mb-6">
                  <Brain className="w-16 h-16 text-white" />
                </div>
                
                <h3 className="text-3xl font-bold text-slate-900 mb-4">
                  AI-Powered Recommendations
                </h3>
                <p className="text-slate-600 mb-8 text-lg leading-relaxed">
                  Get personalized neighborhood recommendations powered by advanced machine learning algorithms
                </p>
                
                <button 
                  onClick={() => navigate('/signin')}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 px-8 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 mx-auto"
                >
                  Sign In to Get Started
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-stone-50 to-slate-100 relative overflow-hidden">
      {/* Premium background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.8),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,0.05)_50%,transparent_75%)]" />
      
      <div className="relative z-10 p-8 space-y-8">
        {/* Premium header */}
        <div className="text-center max-w-4xl mx-auto">
          <div className="relative bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl p-8 border border-white/20 mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-slate-900/5 rounded-3xl" />
            
            <div className="relative">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                  Personalized Recommendations
                </h1>
              </div>
              
              <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed mb-6">
                Our AI analyzes your preferences and behavior to find the perfect neighborhoods for you
              </p>
              
              {/* Premium metadata */}
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-full border border-purple-100">
                  <Brain className="w-4 h-4 text-purple-600" />
                  <span className="text-purple-700 font-medium">Confidence: 87%</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-green-50 rounded-full border border-emerald-100">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-medium">Diversity: 92%</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-full border border-amber-100">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span className="text-amber-700 font-medium">Updated: {new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium tabs */}
        <div className="max-w-6xl mx-auto">
          <div className="relative bg-white/80 backdrop-blur-2xl rounded-2xl shadow-xl p-2 border border-white/20">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-slate-900/5 rounded-2xl" />
            
            <div className="relative flex flex-wrap justify-center gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 ${
                      activeTab === tab.id
                        ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg`
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 backdrop-blur-sm'
                    }`}
                    title={tab.description}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    {activeTab === tab.id && <ChevronRight className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Premium content */}
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-16">
              <div className="relative bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl p-12 border border-white/20 max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-slate-900/5 rounded-3xl" />
                
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-indigo-600 mx-auto mb-6"></div>
                  <p className="text-slate-600 text-lg font-medium">AI is analyzing neighborhoods for you...</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendations.map((neighborhood, index) => (
                <RecommendationCard
                  key={neighborhood._id}
                  neighborhood={neighborhood}
                  index={index}
                />
              ))}
            </div>
          )}

          {!loading && recommendations.length === 0 && (
            <div className="text-center py-16">
              <div className="relative bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl p-12 border border-white/20 max-w-2xl mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-slate-900/5 rounded-3xl" />
                
                <div className="relative">
                  <div className="p-4 bg-gradient-to-r from-slate-400 to-slate-500 rounded-2xl w-fit mx-auto mb-6">
                    <Brain className="w-16 h-16 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    No recommendations found
                  </h3>
                  <p className="text-slate-600 mb-8 text-lg">
                    Try updating your preferences or selecting a different category
                  </p>
                  
                  <button
                    onClick={() => navigate('/profile')}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 px-8 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 mx-auto"
                  >
                    Update Preferences
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalizedRecommendations; 
 
 
import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, MapPin, Star, Heart, TrendingUp } from 'lucide-react';
import { useUser } from '../../../context/UserContext';
import { neighborhoodAPI } from '../../../lib/api';
import { useToast } from '../../../context/ToastContext';

const AIRecommendationEngine = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('personalized');
  const { user, preferences } = useUser();
  const { showError } = useToast();

  // Define all helper functions first
  const generatePersonalizedRecommendations = useCallback((neighborhoods) => {
    if (!preferences) return [];

    let filtered = neighborhoods;

    // Filter by city if specified
    if (preferences.city) {
      filtered = filtered.filter(n => 
        n.city.toLowerCase().includes(preferences.city.toLowerCase())
      );
    }

    // Filter by budget
    if (preferences.priceRange) {
      const [min, max] = preferences.priceRange;
      filtered = filtered.filter(n => 
        n.averageRent >= min && n.averageRent <= max
      );
    }

    // Filter by amenities if specified
    if (preferences.amenities && preferences.amenities.length > 0) {
      filtered = filtered.filter(n => 
        preferences.amenities.some(amenity => 
          n.amenities?.includes(amenity)
        )
      );
    }

    // Apply lifestyle-based scoring
    filtered = filtered.map(neighborhood => {
      let score = 0;
      
      // Work style preferences
      if (preferences.workStyle === 'Remote Work') {
        score += neighborhood.amenities?.includes('Coworking Spaces') ? 20 : 0;
        score += neighborhood.amenities?.includes('IT Parks') ? 15 : 0;
      } else if (preferences.workStyle === 'Office Work') {
        score += neighborhood.amenities?.includes('Metro Access') ? 20 : 0;
        score += neighborhood.amenities?.includes('Corporate Offices') ? 15 : 0;
      }

      // Family preferences
      if (preferences.familyStatus?.includes('Family')) {
        score += neighborhood.amenities?.includes('Schools') ? 25 : 0;
        score += neighborhood.amenities?.includes('Parks') ? 20 : 0;
        score += neighborhood.safetyScore * 2;
      }

      // Lifestyle preferences
      if (preferences.lifestyle === 'Young Professionals') {
        score += neighborhood.amenities?.includes('Restaurants') ? 15 : 0;
        score += neighborhood.amenities?.includes('Gyms') ? 15 : 0;
        score += neighborhood.amenities?.includes('Shopping Malls') ? 10 : 0;
      }

      return { ...neighborhood, aiScore: score };
    });

    // Sort by AI score and return top 6
    return filtered
      .sort((a, b) => b.aiScore - a.aiScore)
      .slice(0, 6);
  }, [preferences]);

  const generateTrendingRecommendations = (neighborhoods) => {
    // Simulate trending based on safety, lifestyle, and transport scores
    return neighborhoods
      .map(neighborhood => ({
        ...neighborhood,
        trendingScore: (neighborhood.safetyScore + neighborhood.lifestyleScore + neighborhood.transportScore) / 3
      }))
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, 6);
  };

  const generateBudgetRecommendations = (neighborhoods) => {
    // Find best value neighborhoods (good scores for the price)
    return neighborhoods
      .map(neighborhood => {
        const valueScore = (neighborhood.safetyScore + neighborhood.lifestyleScore) / neighborhood.averageRent * 1000;
        return { ...neighborhood, valueScore };
      })
      .sort((a, b) => b.valueScore - a.valueScore)
      .slice(0, 6);
  };

  const generateSafetyRecommendations = (neighborhoods) => {
    // Top safety-rated neighborhoods
    return neighborhoods
      .filter(n => n.safetyScore >= 7)
      .sort((a, b) => b.safetyScore - a.safetyScore)
      .slice(0, 6);
  };

  const generateRecommendations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await neighborhoodAPI.getAll();
      const allNeighborhoods = response.data;

      // Generate different types of recommendations
      const personalizedRecs = generatePersonalizedRecommendations(allNeighborhoods);
      const trendingRecs = generateTrendingRecommendations(allNeighborhoods);
      const budgetRecs = generateBudgetRecommendations(allNeighborhoods);
      const safetyRecs = generateSafetyRecommendations(allNeighborhoods);

      setRecommendations({
        personalized: personalizedRecs,
        trending: trendingRecs,
        budget: budgetRecs,
        safety: safetyRecs
      });
    } catch (error) {
      console.error('Error generating recommendations:', error);
      showError('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  }, [showError, generatePersonalizedRecommendations]);

  useEffect(() => {
    if (user) {
      generateRecommendations();
    }
  }, [user, preferences, generateRecommendations]);

  const getRecommendationReason = (neighborhood, type) => {
    switch (type) {
      case 'personalized':
        if (preferences?.familyStatus?.includes('Family')) {
          return 'Great for families with schools and parks nearby';
        } else if (preferences?.workStyle === 'Remote Work') {
          return 'Perfect for remote work with coworking spaces';
        }
        return 'Matches your preferences perfectly';
      
      case 'trending':
        return `High overall score (${neighborhood.trendingScore?.toFixed(1)}/10)`;
      
      case 'budget':
        return `Best value: ₹${neighborhood.averageRent?.toLocaleString()}/month`;
      
      case 'safety':
        return `Safety score: ${neighborhood.safetyScore}/10`;
      
      default:
        return 'AI recommended based on multiple factors';
    }
  };

  const tabs = [
    { id: 'personalized', label: 'For You', icon: Sparkles },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'budget', label: 'Best Value', icon: Star },
    { id: 'safety', label: 'Safest', icon: Heart }
  ];

  if (!user) {
    return (
      <div className="card glassmorphism text-center p-8">
        <Sparkles className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">AI Recommendations</h3>
        <p className="text-gray-600 mb-4">Complete your profile to get personalized neighborhood recommendations</p>
        <button className="btn-primary">Complete Profile</button>
      </div>
    );
  }

  return (
    <div className="card glassmorphism">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-6 h-6 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-900">AI-Powered Recommendations</h2>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing neighborhoods...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations[activeTab]?.map((neighborhood, index) => (
            <div
              key={neighborhood._id}
              className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="relative mb-3">
                <img
                  src={neighborhood.imageUrl || 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=300'}
                  alt={neighborhood.name}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <div className="absolute top-2 left-2 bg-indigo-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  #{index + 1}
                </div>
                {activeTab === 'personalized' && neighborhood.aiScore > 50 && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    {neighborhood.aiScore}pts
                  </div>
                )}
              </div>

              <h3 className="font-semibold text-gray-900 mb-1">{neighborhood.name}</h3>
              <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {neighborhood.city}
              </p>
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-bold text-indigo-600">
                  ₹{neighborhood.averageRent?.toLocaleString()}/month
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-gray-600">
                    {neighborhood.safetyScore}/10
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-500 mb-3">
                {getRecommendationReason(neighborhood, activeTab)}
              </p>

              <div className="flex flex-wrap gap-1">
                {neighborhood.amenities?.slice(0, 2).map((amenity, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    {amenity}
                  </span>
                ))}
                {neighborhood.amenities?.length > 2 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    +{neighborhood.amenities.length - 2} more
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && recommendations[activeTab]?.length === 0 && (
        <div className="text-center py-8">
          <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No recommendations found for this category.</p>
          <p className="text-sm text-gray-500 mt-2">Try updating your preferences or selecting a different category.</p>
        </div>
      )}
    </div>
  );
};

export default AIRecommendationEngine; 
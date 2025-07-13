import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { neighborhoodAPI, userAPI } from '../../../lib/api';
import { ArrowLeft, Heart, MapPin, Star, Home, Shield, Car, Users, Navigation } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { useUser } from '../../../context/UserContext';
import StarRating from '../../ui/StarRating';

// Error Boundary for this page
class NeighborhoodErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('NeighborhoodDetail render error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong loading this neighborhood.</h2>
            <pre className="text-xs text-gray-500 mb-2">{this.state.error?.toString()}</pre>
            <button onClick={() => window.location.href = '/explore'} className="btn-primary">Back to Explore</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function NeighborhoodDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [neighborhood, setNeighborhood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState('');
  const { showSuccess, showError } = useToast();
  const { user, setUser } = useUser();

  const fetchNeighborhood = useCallback(async () => {
      try {
        setLoading(true);
        setError('');
        console.log('[NeighborhoodDetail] Fetching neighborhood with id:', id);
        const response = await neighborhoodAPI.getById(id);
        console.log('[NeighborhoodDetail] API response:', response);
        setNeighborhood(response.data);
        if (!response.data || !response.data._id) {
          setError('Neighborhood not found. (No data returned)');
          console.error('[NeighborhoodDetail] No data returned for id:', id);
        }
    } catch (error) {
        console.error('[NeighborhoodDetail] Error fetching neighborhood:', error);
        setError('Failed to fetch neighborhood details. Please try again.');
      showError('Failed to fetch neighborhood details. Please try again.');
        setTimeout(() => navigate('/explore'), 2000);
      } finally {
        setLoading(false);
      }
  }, [id, showError, navigate]);

  useEffect(() => {
    if (id) {
      fetchNeighborhood();
    }
  }, [id, fetchNeighborhood]);

  useEffect(() => {
    if (neighborhood && user) {
      setIsFavorite(user?.favoriteNeighborhoods?.includes(neighborhood._id) || false);
    }
  }, [neighborhood, user]);

  const handleToggleFavorite = async () => {
    try {
      if (!user) {
        showError('Please log in to save favorites.');
        return;
      }

      const isCurrentlyFavorite = user.favoriteNeighborhoods?.includes(neighborhood._id);
      
      let response;
      if (isCurrentlyFavorite) {
        response = await userAPI.removeFavorite(neighborhood._id);
        setIsFavorite(false);
        showSuccess('Removed from favorites');
      } else {
        response = await userAPI.addFavorite(neighborhood._id);
        setIsFavorite(true);
        showSuccess('Added to favorites!');
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

  const handleRatingChange = async (newRating) => {
    if (!user) {
      showError('You must be logged in to rate a neighborhood.');
      return;
    }

    try {
      const response = await neighborhoodAPI.rate(neighborhood._id, newRating);
      setNeighborhood(response.data);
      showSuccess('Your rating has been submitted!');
    } catch (error) {
      console.error('Rating submission error:', error);
      showError('Failed to submit your rating. Please try again.');
    }
  };

  const handleGetDirections = () => {
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

  if (loading) {
    console.log('[NeighborhoodDetail] Loading neighborhood...');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading neighborhood details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('[NeighborhoodDetail] Error state:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">{error}</h2>
          <button 
            onClick={() => navigate('/explore')} 
            className="btn-primary"
          >
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  if (!neighborhood) {
    console.error('[NeighborhoodDetail] No neighborhood data after loading.');
    setTimeout(() => navigate('/explore'), 2000);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Neighborhood not found</h2>
          <button 
            onClick={() => navigate('/explore')} 
            className="btn-primary"
          >
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-6">
          <button 
            className="bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300 hover:text-blue-600 px-4 py-3 rounded-full mr-4 shadow-md hover:shadow-lg transition-all duration-300 flex items-center"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{neighborhood.name}</h1>
            <p className="text-gray-600 flex items-center mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              {neighborhood.city}
            </p>
          </div>
          <button 
            onClick={handleToggleFavorite}
            className={`border-2 px-6 py-3 rounded-full flex items-center shadow-md hover:shadow-lg transition-all duration-300 font-semibold text-base ml-4 ${isFavorite ? 'bg-red-50 text-red-600 border-red-300 hover:bg-red-100' : 'bg-white text-gray-700 border-gray-200 hover:border-pink-300 hover:text-pink-600 hover:bg-pink-50'}`}
          >
            <Heart className={`w-5 h-5 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
            {isFavorite ? 'Saved' : 'Save'}
          </button>
        </div>

        <div className="mb-8">
          <img
            src={neighborhood.imageUrl || 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800'}
            alt={neighborhood.name}
            className="w-full h-64 md:h-80 object-cover rounded-lg shadow-lg"
          />
        </div>

        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Community Rating</h2>
          <div className="flex items-center mb-4">
            <StarRating rating={neighborhood.averageRating} readOnly={true} />
            <span className="ml-3 text-gray-600 font-semibold">
              {neighborhood.averageRating.toFixed(1)} out of 5
            </span>
            <span className="ml-2 text-gray-500">({neighborhood.numRatings} ratings)</span>
          </div>
          {user && (
            <div>
              <h3 className="text-md font-semibold text-gray-800 mb-2">Your Rating</h3>
              <StarRating
                rating={neighborhood.ratings?.find(r => r.user === user._id)?.rating || 0}
                onRatingChange={handleRatingChange}
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
            <div className="w-12 h-12 flex items-center justify-center rounded-lg mb-4" style={{ background: '#e8f0fe' }}>
              <Home className="w-6 h-6 text-blue-600" />
            </div>
            <div className="font-semibold text-lg text-center mb-1">Average Rent</div>
            <div className="text-2xl font-bold text-blue-700 mb-1">₹{neighborhood.averageRent?.toLocaleString()}</div>
            <div className="text-gray-500 text-base">per month</div>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
            <div className="w-12 h-12 flex items-center justify-center rounded-lg mb-4" style={{ background: '#e6faea' }}>
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <div className="font-semibold text-lg text-center mb-1">Safety Score</div>
            <div className="text-2xl font-bold text-green-600 mb-1">{Number(neighborhood.safetyScore).toFixed(Number.isInteger(neighborhood.safetyScore) ? 0 : 1)}</div>
            <div className="text-gray-500 text-base">/10</div>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
            <div className="w-12 h-12 flex items-center justify-center rounded-lg mb-4" style={{ background: '#f3e8ff' }}>
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="font-semibold text-lg text-center mb-1">Lifestyle Score</div>
            <div className="text-2xl font-bold text-purple-600 mb-1">{Number(neighborhood.lifestyleScore).toFixed(Number.isInteger(neighborhood.lifestyleScore) ? 0 : 1)}</div>
            <div className="text-gray-500 text-base">/10</div>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
            <div className="w-12 h-12 flex items-center justify-center rounded-lg mb-4" style={{ background: '#e6faea' }}>
              <Car className="w-6 h-6 text-green-600" />
            </div>
            <div className="font-semibold text-lg text-center mb-1">Transport Score</div>
            <div className="text-2xl font-bold text-green-600 mb-1">{Number(neighborhood.transportScore).toFixed(Number.isInteger(neighborhood.transportScore) ? 0 : 1)}</div>
            <div className="text-gray-500 text-base">/10</div>
          </div>
        </div>

        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About {neighborhood.name}</h2>
          <p className="text-gray-700 leading-relaxed">
            {neighborhood.description}
          </p>
        </div>

        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenities & Features</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {neighborhood.amenities?.map((amenity, index) => (
              <div
                key={index}
                className="flex items-center p-3 bg-gray-50 rounded-lg"
              >
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                  <Star className="w-4 h-4 text-primary-600" />
                </div>
                <span className="text-gray-700 text-sm font-medium">{amenity}</span>
              </div>
            ))}
          </div>
        </div>

        {neighborhood.tags && neighborhood.tags.length > 0 && (
          <div className="card mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Highlights</h2>
            <div className="flex flex-wrap gap-2">
              {neighborhood.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {neighborhood.population && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Population</h3>
              <p className="text-gray-700">{neighborhood.population}</p>
            </div>
          )}

          {neighborhood.avgCommuteTime && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Average Commute Time</h3>
              <p className="text-gray-700">{neighborhood.avgCommuteTime}</p>
            </div>
          )}
        </div>

        {neighborhood.nearbyLandmarks && neighborhood.nearbyLandmarks.length > 0 && (
          <div className="card mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Nearby Landmarks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {neighborhood.nearbyLandmarks.map((landmark, index) => (
                <div key={index} className="flex items-center p-2">
                  <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-gray-700">{landmark}</span>
                </div>
              ))}
            </div>
        </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => navigate('/explore')}
            className="bg-white text-gray-700 font-semibold py-4 px-6 rounded-full border-2 border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 shadow-md hover:shadow-lg flex-1"
          >
            Back to Explore
          </button>
          <button 
            onClick={handleGetDirections}
            className="bg-white text-gray-700 font-semibold py-4 px-6 rounded-full border-2 border-gray-200 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50 transition-all duration-300 shadow-md hover:shadow-lg flex-1 flex items-center justify-center"
          >
            <Navigation className="w-5 h-5 mr-2" />
            Get Directions
          </button>
          <button 
            onClick={handleToggleFavorite}
            className={`bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-4 px-6 rounded-full shadow-lg hover:shadow-xl flex-1 transition-all duration-300 ml-0 ${isFavorite ? 'bg-red-600 hover:bg-red-700' : 'hover:from-blue-600 hover:to-purple-700'}`}
          >
            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NeighborhoodDetailWithBoundary(props) {
  return (
    <NeighborhoodErrorBoundary>
      <NeighborhoodDetail {...props} />
    </NeighborhoodErrorBoundary>
  );
} 
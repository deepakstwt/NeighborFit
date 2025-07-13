import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { neighborhoodAPI, userAPI } from '../../../lib/api';
import { 
  Search, 
  Filter, 
  MapPin, 
  Heart, 
  Star, 
  Navigation,
  Sparkles,
  Award,
  Target,
  ArrowRight,
  ChevronRight,
  Eye,
  Gauge,
  Activity,
  Sliders,
  X,
  RefreshCw,
  Grid,
  List,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { useUser } from '../../../context/UserContext';
import VanillaTilt from 'vanilla-tilt';
import StarRating from '../../ui/StarRating';

function Explore() {
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [filteredNeighborhoods, setFilteredNeighborhoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    city: '',
    minRent: 10000,
    maxRent: 100000,
    minSafetyScore: 0,
    amenities: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const { user, setUser } = useUser();

  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata'];
  const amenityOptions = [
    'Metro Access', 'IT Parks', 'Shopping Malls', 'Restaurants', 'Gyms', 
    'Schools', 'Hospitals', 'Parks', 'Temples', 'Markets', 'Street Food',
    'Banks/ATMs', 'Pharmacies', 'Bus Stops', 'Auto Stands', 'Vegetarian Restaurants',
    'International Schools', 'Coaching Centers', 'Community Centers', 'Gardens',
    'Cinema Halls', 'Libraries', 'Sports Complex', 'Medical Stores'
  ];

  // High-quality fallback images
  const fallbackImages = [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop&crop=entropy&auto=format&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop&crop=entropy&auto=format&q=80',
    'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=600&h=400&fit=crop&crop=entropy&auto=format&q=80',
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600&h=400&fit=crop&crop=entropy&auto=format&q=80',
    'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=600&h=400&fit=crop&crop=entropy&auto=format&q=80'
  ];

  const fetchNeighborhoods = useCallback(async () => {
    try {
      setLoading(true);
      const response = await neighborhoodAPI.getAll();
      setNeighborhoods(response.data);
    } catch (error) {
      console.error('Error fetching neighborhoods:', error);
      showError('Failed to fetch neighborhoods. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const filterNeighborhoods = useCallback(() => {
    let filtered = neighborhoods;

    if (searchTerm) {
      filtered = filtered.filter(n => 
        n.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.city) {
      filtered = filtered.filter(n => n.city === filters.city);
    }

    filtered = filtered.filter(n => 
      n.averageRent >= filters.minRent && n.averageRent <= filters.maxRent
    );

    if (filters.minSafetyScore > 0) {
      filtered = filtered.filter(n => n.safetyScore >= filters.minSafetyScore);
    }

    if (filters.amenities.length > 0) {
      filtered = filtered.filter(n => 
        filters.amenities.some(amenity => n.amenities.includes(amenity))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'rent':
          aValue = a.averageRent;
          bValue = b.averageRent;
          break;
        case 'safety':
          aValue = a.safetyScore;
          bValue = b.safetyScore;
          break;
        case 'rating':
          aValue = a.averageRating || 0;
          bValue = b.averageRating || 0;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredNeighborhoods(filtered);
  }, [neighborhoods, searchTerm, filters, sortBy, sortOrder]);

  useEffect(() => {
    fetchNeighborhoods();
  }, [fetchNeighborhoods]);

  useEffect(() => {
    filterNeighborhoods();
  }, [filterNeighborhoods]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleAmenityToggle = (amenity) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const clearFilters = () => {
    setFilters({
      city: '',
      minRent: 10000,
      maxRent: 100000,
      minSafetyScore: 0,
      amenities: []
    });
    setSearchTerm('');
    setSortBy('name');
    setSortOrder('asc');
  };

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

  function TiltCard({ children, options, ...rest }) {
    const tiltRef = useRef(null);
    useEffect(() => {
      if (tiltRef.current) {
        VanillaTilt.init(tiltRef.current, options || {
          max: 15,
          speed: 400,
          glare: true,
          'max-glare': 0.18,
          scale: 1.04,
        });
      }
      return () => {
        const currentTiltRef = tiltRef.current;
        if (currentTiltRef && currentTiltRef.vanillaTilt) {
          currentTiltRef.vanillaTilt.destroy();
        }
      };
    }, [options]);
    return (
      <div ref={tiltRef} {...rest}>
        {children}
      </div>
    );
  }

  // Premium neighborhood card component
  const NeighborhoodCard = ({ neighborhood, index }) => {
    const [imageError, setImageError] = useState(false);

    const getImageUrl = () => {
      if (imageError) return fallbackImages[index % fallbackImages.length];
      return neighborhood.imageUrl || neighborhood.image || fallbackImages[index % fallbackImages.length];
    };

    const getRankingBadge = () => {
      if (index === 0) return 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white';
      if (index === 1) return 'bg-gradient-to-r from-slate-400 to-slate-500 text-white';
      if (index === 2) return 'bg-gradient-to-r from-amber-600 to-orange-600 text-white';
      return 'bg-gradient-to-r from-slate-600 to-slate-700 text-white';
    };

    return (
      <TiltCard className="group relative" options={{max:15,speed:400,glare:true,'max-glare':0.18,scale:1.04}}>
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
            {index < 3 && (
              <div className={`absolute top-4 left-4 ${getRankingBadge()} px-3 py-1.5 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm`}>
                {index === 0 && <Award className="w-4 h-4 inline mr-1" />}
                #{index + 1}
              </div>
            )}
            
            {/* Premium safety score */}
            <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-medium border border-white/20">
              <Star className="w-3 h-3 inline mr-1 text-yellow-400" />
              {neighborhood.safetyScore}/10
            </div>
            
            {/* Premium rating section - moved to absolute position */}
            {neighborhood.numRatings > 0 && (
              <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md rounded-lg px-2 py-1 border border-white/20">
                <div className="flex items-center gap-1">
                  <StarRating rating={neighborhood.averageRating} readOnly={true} size="small" />
                  <span className="text-xs font-medium text-white">
                    {neighborhood.averageRating?.toFixed(1)}
                  </span>
                  <span className="text-xs text-white/70">
                    ({neighborhood.numRatings})
                  </span>
                </div>
              </div>
            )}
            
            {/* Premium favorite button */}
            <button
              onClick={() => handleToggleFavorite(neighborhood._id)}
              className={`absolute bottom-4 right-4 backdrop-blur-md p-2.5 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 border border-white/20 ${
                user?.favoriteNeighborhoods?.includes(neighborhood._id)
                  ? 'bg-red-500/90 hover:bg-red-500 text-white'
                  : 'bg-white/90 hover:bg-white text-slate-700'
              }`}
            >
              <Heart className={`w-5 h-5 ${
                user?.favoriteNeighborhoods?.includes(neighborhood._id) ? 'fill-current' : ''
              }`} />
            </button>
          </div>

          {/* Content section with premium styling */}
          <div className="p-6 h-80 flex flex-col">
            {/* Top section - Header and description */}
            <div className="flex-1 space-y-4">
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

              {/* Description */}
              <p className="text-slate-700 text-sm leading-relaxed line-clamp-2">
                {neighborhood.description}
              </p>

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
            </div>

            {/* Bottom section - Action buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => handleViewDetails(neighborhood._id)}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Eye className="w-4 h-4" />
                View Details
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => handleGetDirections(neighborhood)}
                className="bg-gradient-to-r from-slate-100 to-stone-100 hover:from-slate-200 hover:to-stone-200 text-slate-700 py-3 px-4 rounded-xl font-medium transition-all duration-300 border border-slate-200 hover:border-slate-300 hover:scale-105"
              >
                <Navigation className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </TiltCard>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-stone-50 to-slate-100 relative overflow-hidden">
        {/* Premium background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.8),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,0.05)_50%,transparent_75%)]" />
        
        <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
          <div className="text-center max-w-md mx-auto">
            <div className="relative bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl p-12 border border-white/20">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-slate-900/5 rounded-3xl" />
              
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-indigo-600 mx-auto mb-6"></div>
                <p className="text-slate-600 text-lg font-medium">Discovering amazing neighborhoods...</p>
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
                  <Search className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                  Explore Neighborhoods
                </h1>
              </div>
              
              <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
                Discover your perfect neighborhood across Indian cities with our premium search experience
              </p>
            </div>
          </div>
        </div>

        {/* Premium search and filters */}
        <div className="max-w-6xl mx-auto">
          <div className="relative bg-white/80 backdrop-blur-2xl rounded-2xl shadow-xl p-6 border border-white/20">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-slate-900/5 rounded-2xl" />
            
            <div className="relative space-y-6">
              {/* Search bar */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search neighborhoods by name, city, or description..."
                  className="w-full pl-12 pr-4 py-4 bg-white/60 backdrop-blur-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 placeholder-slate-500"
                />
              </div>

              {/* Controls */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
                      showFilters
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                        : 'bg-white/60 text-slate-700 hover:bg-white/80 border border-slate-200'
                    }`}
                  >
                    <Sliders className="w-4 h-4" />
                    Advanced Filters
                    {(filters.city || filters.amenities.length > 0 || filters.minSafetyScore > 0) && (
                      <span className="bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                        {[filters.city, ...filters.amenities, filters.minSafetyScore > 0 ? 'safety' : ''].filter(Boolean).length}
                      </span>
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        viewMode === 'grid'
                          ? 'bg-indigo-100 text-indigo-600'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        viewMode === 'list'
                          ? 'bg-indigo-100 text-indigo-600'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="rent">Sort by Rent</option>
                    <option value="safety">Sort by Safety</option>
                    <option value="rating">Sort by Rating</option>
                  </select>
                  
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="p-2 bg-white/60 backdrop-blur-sm border border-slate-200 rounded-xl hover:bg-white/80 transition-all duration-300"
                  >
                    {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm border border-slate-200 rounded-xl hover:bg-white/80 transition-all duration-300 text-slate-700"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reset
                  </button>
                </div>
              </div>

              {/* Advanced filters */}
              {showFilters && (
                <div className="p-6 bg-gradient-to-r from-slate-50/80 to-stone-50/80 backdrop-blur-sm rounded-xl border border-slate-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* City filter */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
                      <select
                        value={filters.city}
                        onChange={(e) => handleFilterChange('city', e.target.value)}
                        className="w-full p-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">All Cities</option>
                        {cities.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>

                    {/* Rent filter */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Max Rent: ₹{filters.maxRent.toLocaleString('en-IN')}
                      </label>
                      <input
                        type="range"
                        min="10000"
                        max="150000"
                        step="5000"
                        value={filters.maxRent}
                        onChange={(e) => handleFilterChange('maxRent', parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    {/* Safety filter */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Min Safety Score: {filters.minSafetyScore}/10
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="0.5"
                        value={filters.minSafetyScore}
                        onChange={(e) => handleFilterChange('minSafetyScore', parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    {/* Clear filters */}
                    <div className="flex items-end">
                      <button
                        onClick={clearFilters}
                        className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-slate-700 mb-3">Amenities</label>
                    <div className="flex flex-wrap gap-2">
                      {amenityOptions.map(amenity => (
                        <button
                          key={amenity}
                          onClick={() => handleAmenityToggle(amenity)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                            filters.amenities.includes(amenity)
                              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                              : 'bg-white/60 text-slate-700 border border-slate-200 hover:bg-white/80'
                          }`}
                        >
                          {amenity}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <p className="text-slate-600 font-medium">
              Showing {filteredNeighborhoods.length} of {neighborhoods.length} neighborhoods
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Activity className="w-4 h-4" />
              <span>Updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* Premium neighborhood grid */}
        <div className="max-w-7xl mx-auto">
          {filteredNeighborhoods.length > 0 ? (
            <div className={`grid gap-8 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {filteredNeighborhoods.map((neighborhood, index) => (
                <NeighborhoodCard
                  key={neighborhood._id}
                  neighborhood={neighborhood}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="relative bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl p-12 border border-white/20 max-w-2xl mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-slate-900/5 rounded-3xl" />
                
                <div className="relative">
                  <div className="p-4 bg-gradient-to-r from-slate-400 to-slate-500 rounded-2xl w-fit mx-auto mb-6">
                    <Search className="w-16 h-16 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    No neighborhoods found
                  </h3>
                  <p className="text-slate-600 mb-8 text-lg">
                    Try adjusting your search criteria or filters to find more results.
                  </p>
                  
                  <button
                    onClick={clearFilters}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 px-8 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 mx-auto"
                  >
                    Clear All Filters
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Premium slider styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default Explore;
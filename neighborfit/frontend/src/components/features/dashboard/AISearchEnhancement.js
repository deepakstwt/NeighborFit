import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, Filter, MapPin, Star, TrendingUp } from 'lucide-react';
import { neighborhoodAPI } from '../../../lib/api';
import { useToast } from '../../../context/ToastContext';

const AISearchEnhancement = ({ onSearchResults, onFiltersChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const searchRef = useRef(null);
  const { showError } = useToast();

  useEffect(() => {
    // Load search history from localStorage
    const savedHistory = localStorage.getItem('neighborfit_search_history');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const processNaturalLanguageQuery = async (query) => {
    setIsProcessing(true);
    
    try {
      // Parse natural language query
      const parsedQuery = parseNaturalLanguage(query);
      
      // Generate AI suggestions based on the query
      const suggestions = generateAISuggestions(parsedQuery);
      setAiSuggestions(suggestions);
      
      // Execute the search
      const results = await executeSearch(parsedQuery);
      
      // Save to search history
      addToSearchHistory(query);
      
      return results;
    } catch (error) {
      console.error('Error processing search:', error);
      showError('Failed to process search query');
      return [];
    } finally {
      setIsProcessing(false);
    }
  };

  const parseNaturalLanguage = (query) => {
    const lowerQuery = query.toLowerCase();
    const parsed = {
      search: '',
      city: '',
      minRent: null,
      maxRent: null,
      minSafetyScore: null,
      amenities: [],
      lifestyle: '',
      budget: ''
    };

    // Extract city
    const cities = ['mumbai', 'delhi', 'bangalore', 'hyderabad', 'chennai', 'pune', 'kolkata'];
    cities.forEach(city => {
      if (lowerQuery.includes(city)) {
        parsed.city = city;
        parsed.search = query.replace(new RegExp(city, 'gi'), '').trim();
      }
    });

    // Extract budget information
    if (lowerQuery.includes('cheap') || lowerQuery.includes('affordable') || lowerQuery.includes('low budget')) {
      parsed.budget = 'low';
      parsed.maxRent = 25000;
    } else if (lowerQuery.includes('expensive') || lowerQuery.includes('luxury') || lowerQuery.includes('high end')) {
      parsed.budget = 'high';
      parsed.minRent = 50000;
    } else if (lowerQuery.includes('medium') || lowerQuery.includes('moderate')) {
      parsed.budget = 'medium';
      parsed.minRent = 25000;
      parsed.maxRent = 50000;
    }

    // Extract safety requirements
    if (lowerQuery.includes('safe') || lowerQuery.includes('security') || lowerQuery.includes('secure')) {
      parsed.minSafetyScore = 7;
    } else if (lowerQuery.includes('very safe') || lowerQuery.includes('safest')) {
      parsed.minSafetyScore = 8;
    }

    // Extract amenities
    const amenityKeywords = {
      'school': 'Schools',
      'hospital': 'Hospitals',
      'metro': 'Metro Access',
      'park': 'Parks',
      'gym': 'Gyms',
      'restaurant': 'Restaurants',
      'mall': 'Shopping Malls',
      'temple': 'Temples',
      'market': 'Markets',
      'bank': 'Banks/ATMs',
      'pharmacy': 'Pharmacies',
      'bus': 'Bus Stops',
      'auto': 'Auto Stands',
      'vegetarian': 'Vegetarian Restaurants',
      'international school': 'International Schools',
      'coaching': 'Coaching Centers',
      'community center': 'Community Centers',
      'garden': 'Gardens',
      'cinema': 'Cinema Halls',
      'library': 'Libraries',
      'sports': 'Sports Complex',
      'medical': 'Medical Stores'
    };

    Object.entries(amenityKeywords).forEach(([keyword, amenity]) => {
      if (lowerQuery.includes(keyword)) {
        parsed.amenities.push(amenity);
      }
    });

    // Extract lifestyle preferences
    if (lowerQuery.includes('family') || lowerQuery.includes('kids') || lowerQuery.includes('children')) {
      parsed.lifestyle = 'family';
    } else if (lowerQuery.includes('young professional') || lowerQuery.includes('working')) {
      parsed.lifestyle = 'professional';
    } else if (lowerQuery.includes('student') || lowerQuery.includes('college')) {
      parsed.lifestyle = 'student';
    }

    // If no specific search term was extracted, use the original query
    if (!parsed.search) {
      parsed.search = query;
    }

    return parsed;
  };

  const generateAISuggestions = (parsedQuery) => {
    const suggestions = [];

    // Generate suggestions based on parsed query
    if (parsedQuery.city) {
      suggestions.push({
        type: 'city',
        text: `Explore ${parsedQuery.city.charAt(0).toUpperCase() + parsedQuery.city.slice(1)}`,
        query: `neighborhoods in ${parsedQuery.city}`
      });
    }

    if (parsedQuery.budget === 'low') {
      suggestions.push({
        type: 'budget',
        text: 'Affordable neighborhoods',
        query: 'cheap affordable neighborhoods'
      });
    }

    if (parsedQuery.minSafetyScore >= 7) {
      suggestions.push({
        type: 'safety',
        text: 'Safe neighborhoods',
        query: 'safe secure neighborhoods'
      });
    }

    if (parsedQuery.amenities.length > 0) {
      suggestions.push({
        type: 'amenities',
        text: `Areas with ${parsedQuery.amenities[0]}`,
        query: `neighborhoods with ${parsedQuery.amenities[0].toLowerCase()}`
      });
    }

    if (parsedQuery.lifestyle === 'family') {
      suggestions.push({
        type: 'lifestyle',
        text: 'Family-friendly areas',
        query: 'family friendly neighborhoods with schools'
      });
    }

    // Add general suggestions
    suggestions.push(
      {
        type: 'trending',
        text: 'Trending neighborhoods',
        query: 'trending popular neighborhoods'
      },
      {
        type: 'value',
        text: 'Best value for money',
        query: 'best value neighborhoods'
      }
    );

    return suggestions.slice(0, 6);
  };

  const executeSearch = async (parsedQuery) => {
    try {
      const filters = {};
      
      if (parsedQuery.city) filters.city = parsedQuery.city;
      if (parsedQuery.minRent) filters.minRent = parsedQuery.minRent;
      if (parsedQuery.maxRent) filters.maxRent = parsedQuery.maxRent;
      if (parsedQuery.minSafetyScore) filters.minSafetyScore = parsedQuery.minSafetyScore;
      if (parsedQuery.amenities.length > 0) filters.amenities = parsedQuery.amenities;

      const response = await neighborhoodAPI.getFiltered(filters);
      const results = response.data;

      // Apply additional filtering based on search term
      let filteredResults = results;
      if (parsedQuery.search) {
        filteredResults = results.filter(neighborhood => 
          neighborhood.name.toLowerCase().includes(parsedQuery.search.toLowerCase()) ||
          neighborhood.description.toLowerCase().includes(parsedQuery.search.toLowerCase()) ||
          neighborhood.amenities.some(amenity => 
            amenity.toLowerCase().includes(parsedQuery.search.toLowerCase())
          )
        );
      }

      // Apply lifestyle-based sorting
      if (parsedQuery.lifestyle === 'family') {
        filteredResults.sort((a, b) => {
          const scoreA = (a.safetyScore * 2) + (a.amenities.includes('Schools') ? 10 : 0);
          const scoreB = (b.safetyScore * 2) + (b.amenities.includes('Schools') ? 10 : 0);
          return scoreB - scoreA;
        });
      } else if (parsedQuery.lifestyle === 'professional') {
        filteredResults.sort((a, b) => {
          const scoreA = (a.transportScore * 2) + (a.amenities.includes('Metro Access') ? 10 : 0);
          const scoreB = (b.transportScore * 2) + (b.amenities.includes('Metro Access') ? 10 : 0);
          return scoreB - scoreA;
        });
      }

      return filteredResults;
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  };

  const addToSearchHistory = (query) => {
    const newHistory = [query, ...searchHistory.filter(item => item !== query)].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem('neighborfit_search_history', JSON.stringify(newHistory));
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setShowSuggestions(false);
    const results = await processNaturalLanguageQuery(searchQuery);
    
    if (onSearchResults) {
      onSearchResults(results);
    }
  };

  const handleSuggestionClick = async (suggestion) => {
    setSearchQuery(suggestion.query);
    setShowSuggestions(false);
    const results = await processNaturalLanguageQuery(suggestion.query);
    
    if (onSearchResults) {
      onSearchResults(results);
    }
  };

  const handleHistoryClick = (historyItem) => {
    setSearchQuery(historyItem);
    setShowSuggestions(false);
  };

  const getSuggestionIcon = (type) => {
    switch (type) {
      case 'city': return <MapPin className="w-4 h-4" />;
      case 'budget': return <Star className="w-4 h-4" />;
      case 'safety': return <TrendingUp className="w-4 h-4" />;
      case 'amenities': return <Filter className="w-4 h-4" />;
      case 'lifestyle': return <Sparkles className="w-4 h-4" />;
      case 'trending': return <TrendingUp className="w-4 h-4" />;
      case 'value': return <Star className="w-4 h-4" />;
      default: return <Search className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="w-full flex flex-col sm:flex-row gap-2 items-stretch">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value.trim()) {
                setShowSuggestions(true);
              } else {
                setShowSuggestions(false);
              }
            }}
            onFocus={() => {
              if (searchQuery.trim() || searchHistory.length > 0) {
                setShowSuggestions(true);
              }
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            placeholder="Search neighborhoods naturally... (e.g., 'affordable family areas in Mumbai with schools')"
            className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-base sm:text-lg bg-white"
            style={{ minWidth: 0 }}
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={isProcessing || !searchQuery.trim()}
          className="bg-indigo-600 text-white px-4 sm:px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 text-sm sm:text-base whitespace-nowrap w-full sm:w-auto"
          style={{ minWidth: '90px' }}
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span className="text-sm">AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span className="text-sm sm:text-base">Search</span>
            </>
          )}
        </button>
      </div>

      {/* AI Suggestions and History */}
      {showSuggestions && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {/* AI Suggestions */}
          {aiSuggestions.length > 0 && (
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                AI Suggestions
              </h3>
              <div className="space-y-2">
                {aiSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left p-2 hover:bg-gray-50 rounded-md transition-colors flex items-center gap-3"
                  >
                    {getSuggestionIcon(suggestion.type)}
                    <span className="text-sm text-gray-700">{suggestion.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search History */}
          {searchHistory.length > 0 && (
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent Searches</h3>
              <div className="space-y-2">
                {searchHistory.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleHistoryClick(item)}
                    className="w-full text-left p-2 hover:bg-gray-50 rounded-md transition-colors flex items-center gap-3"
                  >
                    <Search className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{item}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Filters */}
          <div className="p-4 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Filters</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { text: 'Under ₹25k', query: 'cheap affordable under 25000' },
                { text: '₹25k-50k', query: 'medium budget 25000 to 50000' },
                { text: 'Above ₹50k', query: 'luxury expensive above 50000' },
                { text: 'Safe Areas', query: 'safe secure neighborhoods' },
                { text: 'Family Friendly', query: 'family friendly with schools' },
                { text: 'Metro Access', query: 'near metro station' }
              ].map((filter, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick({ query: filter.query })}
                  className="text-xs px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  {filter.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AISearchEnhancement; 
// AI Service for NeighborFit - Enhanced Natural Language Processing
import { neighborhoodAPI } from './api';

class AIService {
  constructor() {
    // Pre-defined responses and patterns
    this.patterns = {
      greetings: {
        hindi: ['नमस्ते', 'हैलो', 'हाय', 'प्रणाम'],
        english: ['hello', 'hi', 'hey', 'greetings']
      },
      search: {
        hindi: ['खोज', 'ढूंढ', 'बताओ', 'दिखाओ', 'में', 'के', 'अच्छे', 'इलाके', 'जगह'],
        english: ['search', 'find', 'show', 'tell', 'look', 'area', 'place', 'neighborhood']
      },
      recommendation: {
        hindi: ['सुझाव', 'सिफारिश', 'recommend', 'बेहतर', 'अच्छा'],
        english: ['recommend', 'suggest', 'best', 'good', 'better']
      },
      cities: {
        mumbai: ['mumbai', 'मुंबई', 'bombay'],
        delhi: ['delhi', 'दिल्ली', 'new delhi'],
        bangalore: ['bangalore', 'bengaluru', 'बैंगलोर'],
        pune: ['pune', 'पुणे'],
        hyderabad: ['hyderabad', 'हैदराबाद'],
        chennai: ['chennai', 'चेन्नई', 'madras'],
        kolkata: ['kolkata', 'कोलकाता', 'calcutta']
      }
    };

    this.responses = {
      greetings: {
        hindi: "नमस्ते! मैं आपका NeighborFit AI असिस्टेंट हूं। मैं आपको सही neighborhood खोजने में मदद कर सकता हूं।",
        english: "Hello! I'm your NeighborFit AI assistant. I can help you find the perfect neighborhood."
      },
      noData: {
        hindi: "मुझे कोई डेटा नहीं मिला। कृपया बाद में कोशिश करें।",
        english: "I couldn't find any data. Please try again later."
      },
      searchHelp: {
        hindi: "आप क्या खोजना चाहते हैं? जैसे 'मुंबई में अच्छे इलाके' या 'Delhi में affordable areas'।",
        english: "What would you like to search for? For example, 'good areas in Mumbai' or 'affordable areas in Delhi'."
      }
    };
  }

  // Detect primary language of the input
  detectLanguage(text) {
    const hindiChars = text.match(/[\u0900-\u097F]/g);
    return hindiChars && hindiChars.length > 2 ? 'hindi' : 'english';
  }

  // Extract city from the message
  extractCity(message) {
    const lowerMessage = message.toLowerCase();
    
    for (const [city, variations] of Object.entries(this.patterns.cities)) {
      for (const variation of variations) {
        if (lowerMessage.includes(variation)) {
          return city;
        }
      }
    }
    return null;
  }

  // Extract search intent
  extractSearchIntent(message) {
    const lowerMessage = message.toLowerCase();
    const lang = this.detectLanguage(message);
    
    const searchWords = this.patterns.search[lang] || this.patterns.search.english;
    const recommendWords = this.patterns.recommendation[lang] || this.patterns.recommendation.english;
    
    const hasSearch = searchWords.some(word => lowerMessage.includes(word));
    const hasRecommend = recommendWords.some(word => lowerMessage.includes(word));
    
    if (hasRecommend) return 'recommend';
    if (hasSearch) return 'search';
    return 'general';
  }

  // Process neighborhoods data for response
  formatNeighborhoodsResponse(neighborhoods, intent, language = 'english', city = null) {
    if (!neighborhoods || neighborhoods.length === 0) {
      return this.responses.noData[language];
    }

    const maxResults = 5;
    const displayNeighborhoods = neighborhoods.slice(0, maxResults);
    
    let response = '';
    
    if (intent === 'recommend') {
      response = language === 'hindi' 
        ? `यहां हैं मेरी ${city ? city + ' में' : ''} top recommendations:\n\n`
        : `Here are my top recommendations${city ? ` in ${city}` : ''}:\n\n`;
    } else {
      response = language === 'hindi'
        ? `मुझे ${neighborhoods.length} neighborhoods मिले${city ? ` ${city} में` : ''}:\n\n`
        : `I found ${neighborhoods.length} neighborhoods${city ? ` in ${city}` : ''}:\n\n`;
    }

    displayNeighborhoods.forEach((neighborhood, index) => {
      response += `${index + 1}. **${neighborhood.name}** - ${neighborhood.city}\n`;
      response += `   💰 Rent: ₹${neighborhood.averageRent?.toLocaleString()}/month\n`;
      response += `   🛡️ Safety: ${neighborhood.safetyScore}/10\n`;
      response += `   🌟 Lifestyle: ${neighborhood.lifestyleScore}/10\n`;
      
      if (neighborhood.amenities && neighborhood.amenities.length > 0) {
        response += `   🏢 Features: ${neighborhood.amenities.slice(0, 3).join(', ')}\n`;
      }
      response += '\n';
    });

    if (neighborhoods.length > maxResults) {
      const remaining = neighborhoods.length - maxResults;
      response += language === 'hindi'
        ? `... और ${remaining} और भी हैं।\n`
        : `... and ${remaining} more results.\n`;
    }

    return response;
  }

  // Main processing function
  async processMessage(message, userPreferences = null) {
    const language = this.detectLanguage(message);
    const intent = this.extractSearchIntent(message);
    const city = this.extractCity(message);
    
    console.log('AI Processing:', { message, language, intent, city, userPreferences });

    try {
      switch (intent) {
        case 'recommend':
          return await this.handleRecommendation(message, language, city, userPreferences);
        
        case 'search':
          return await this.handleSearch(message, language, city);
        
        default:
          return this.handleGeneral(message, language);
      }
    } catch (error) {
      console.error('AI Service Error:', error);
      return language === 'hindi'
        ? "माफ़ करें, मुझे कुछ तकनीकी समस्या हो रही है। कृपया फिर से कोशिश करें।"
        : "Sorry, I'm having technical difficulties. Please try again.";
    }
  }

  async handleRecommendation(message, language, city, userPreferences) {
    const response = await neighborhoodAPI.getAll();
    let neighborhoods = response.data || response;

    if (!neighborhoods || neighborhoods.length === 0) {
      return this.responses.noData[language];
    }

    // Apply filters based on user preferences and extracted city
    if (city) {
      neighborhoods = neighborhoods.filter(n => 
        n.city.toLowerCase().includes(city.toLowerCase())
      );
    }

    if (userPreferences?.city && !city) {
      neighborhoods = neighborhoods.filter(n => 
        n.city.toLowerCase().includes(userPreferences.city.toLowerCase())
      );
    }

    if (userPreferences?.priceRange && userPreferences.priceRange.length === 2) {
      const [min, max] = userPreferences.priceRange;
      neighborhoods = neighborhoods.filter(n => 
        n.averageRent >= min && n.averageRent <= max
      );
    }

    // Sort by combined score
    neighborhoods.sort((a, b) => {
      const scoreA = (a.safetyScore + a.lifestyleScore + a.transportScore) / 3;
      const scoreB = (b.safetyScore + b.lifestyleScore + b.transportScore) / 3;
      return scoreB - scoreA;
    });

    return this.formatNeighborhoodsResponse(neighborhoods, 'recommend', language, city);
  }

  async handleSearch(message, language, city) {
    let searchTerm = city || 'mumbai'; // Default to Mumbai if no city found
    
    // Try to extract more specific search terms
    const cleanMessage = message.toLowerCase()
      .replace(/search|find|look|show|tell|खोज|ढूंढ|बताओ|दिखाओ|में|के|अच्छे|इलाके/gi, '')
      .trim();
    
    if (cleanMessage && !city) {
      searchTerm = cleanMessage;
    }

    const response = await neighborhoodAPI.search(searchTerm);
    const neighborhoods = response.data || response;

    return this.formatNeighborhoodsResponse(neighborhoods, 'search', language, city);
  }

  handleGeneral(message, language) {
    const lowerMessage = message.toLowerCase();
    
    // Check for greetings
    const greetingWords = this.patterns.greetings[language] || this.patterns.greetings.english;
    if (greetingWords.some(word => lowerMessage.includes(word))) {
      return this.responses.greetings[language];
    }

    // Help responses
    if (lowerMessage.includes('help') || lowerMessage.includes('मदद')) {
      return language === 'hindi'
        ? "मैं आपको neighborhoods ढूंढने में मदद कर सकता हूं। कुछ भी पूछें जैसे 'मुंबई में अच्छे इलाके' या 'recommend करो'।"
        : "I can help you find neighborhoods. Ask me anything like 'good areas in Mumbai' or 'recommend something'.";
    }

    // Default response
    return language === 'hindi'
      ? "मैं आपको neighborhood खोजने में मदद कर सकता हूं। कुछ specific पूछें जैसे 'मुंबई में अच्छे इलाके बताओ'।"
      : "I can help you find neighborhoods. Ask me something specific like 'show me good areas in Mumbai'.";
  }
}

// Create singleton instance
const aiService = new AIService();

export default aiService; 
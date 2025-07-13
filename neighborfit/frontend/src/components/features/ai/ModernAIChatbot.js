import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, User, X, Minimize2, Maximize2, MessageCircle, Sparkles } from 'lucide-react';
import { useUser } from '../../../context/UserContext';
import { useToast } from '../../../context/ToastContext';
import { neighborhoodAPI } from '../../../lib/api';

const ModernAIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: "Hello! I'm your NeighborFit AI assistant. How can I help you find the perfect neighborhood today? 🏠",
      timestamp: new Date(),
      typing: false
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { user, preferences } = useUser();
  const { showError, showSuccess } = useToast();

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  // Load chat history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('neighborfit_chat_history');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        setChatHistory(parsedHistory);
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    }
  }, []);

  // Save chat history to localStorage
  const saveChatHistory = useCallback((newMessages) => {
    try {
      const historyToSave = newMessages.slice(-50); // Keep last 50 messages
      localStorage.setItem('neighborfit_chat_history', JSON.stringify(historyToSave));
      setChatHistory(historyToSave);
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  }, []);

  // Simulate typing effect for AI responses
  const typeMessage = useCallback((message, onComplete) => {
    const words = message.split(' ');
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < words.length) {
        const partialMessage = words.slice(0, currentIndex + 1).join(' ');
        setMessages(prev => prev.map(msg => 
          msg.id === 'typing' 
            ? { ...msg, content: partialMessage, typing: true }
            : msg
        ));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setMessages(prev => prev.map(msg => 
          msg.id === 'typing' 
            ? { ...msg, typing: false, id: Date.now() }
            : msg
        ));
        onComplete();
      }
    }, 50);
  }, []);

  // Enhanced AI response processing
  const processAIRequest = useCallback(async (message) => {
    try {
      const lowerMessage = message.toLowerCase();
      
      // Context-aware responses based on user preferences
      const context = {
        user: user?.name || 'User',
        preferences: preferences || {},
        previousMessages: chatHistory.slice(-5) // Last 5 messages for context
      };

      // Smart intent detection
      if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest')) {
        return await handleRecommendationRequest(message, context);
      } else if (lowerMessage.includes('search') || lowerMessage.includes('find')) {
        return await handleSearchRequest(message, context);
      } else if (lowerMessage.includes('compare') || lowerMessage.includes('vs')) {
        return await handleComparisonRequest(message, context);
      } else if (lowerMessage.includes('preference') || lowerMessage.includes('setting')) {
        return await handlePreferenceRequest(message, context);
      } else if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
        return getHelpResponse(context);
      } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return getGreetingResponse(context);
      } else {
        return await handleGeneralQuery(message, context);
      }
    } catch (error) {
      console.error('AI Processing Error:', error);
      return "I'm experiencing some technical difficulties. Please try again in a moment. 🔧";
    }
  }, [user, preferences, chatHistory]);

  // Enhanced recommendation handler
  const handleRecommendationRequest = useCallback(async (message, context) => {
    try {
      const response = await neighborhoodAPI.getAll();
      const neighborhoods = response.data || response;
      
      if (!neighborhoods || neighborhoods.length === 0) {
        return "I couldn't find any neighborhoods at the moment. Please try again later. 🏘️";
      }
      
      // Smart filtering based on preferences
      let recommendations = [...neighborhoods];
      
      if (context.preferences?.city) {
        recommendations = recommendations.filter(n => 
          n.city.toLowerCase().includes(context.preferences.city.toLowerCase())
        );
      }
      
      if (context.preferences?.priceRange && context.preferences.priceRange.length === 2) {
        const [min, max] = context.preferences.priceRange;
        recommendations = recommendations.filter(n => 
          n.averageRent >= min && n.averageRent <= max
        );
      }
      
      // Advanced scoring algorithm
      recommendations = recommendations.map(n => ({
        ...n,
        aiScore: calculateAIScore(n, context.preferences)
      })).sort((a, b) => b.aiScore - a.aiScore);
      
      const topRecommendations = recommendations.slice(0, 3);
      
      let responseText = `Based on your preferences, here are my top recommendations for ${context.user}:\n\n`;
      
      topRecommendations.forEach((neighborhood, index) => {
        responseText += `${index + 1}. **${neighborhood.name}** - ${neighborhood.city}\n`;
        responseText += `   💰 Rent: ₹${neighborhood.averageRent?.toLocaleString()}/month\n`;
        responseText += `   🛡️ Safety: ${neighborhood.safetyScore}/10\n`;
        responseText += `   🤖 AI Match: ${Math.round(neighborhood.aiScore)}%\n`;
        if (neighborhood.amenities && neighborhood.amenities.length > 0) {
          responseText += `   🏢 Features: ${neighborhood.amenities.slice(0, 3).join(', ')}\n`;
        }
        responseText += "\n";
      });
      
      responseText += "Would you like more details about any of these neighborhoods? 🤔";
      
      return responseText;
    } catch (error) {
      console.error('Recommendation Error:', error);
      return "I'm having trouble fetching recommendations right now. Please try the Explore page for now. 🔍";
    }
  }, []);

  // Enhanced search handler
  const handleSearchRequest = useCallback(async (message, context) => {
    try {
      let searchTerms = message.toLowerCase()
        .replace(/search|find|look for|show me|where can i find/gi, '')
        .trim();
      
      if (!searchTerms) {
        return `What are you looking for, ${context.user}? For example:\n• "Good areas in Mumbai"\n• "Affordable places in Delhi"\n• "Family-friendly neighborhoods"\n• "Areas with good connectivity" 🔍`;
      }
      
      const response = await neighborhoodAPI.search(searchTerms);
      const results = response.data || response;
      
      if (!results || results.length === 0) {
        return `I couldn't find any neighborhoods matching "${searchTerms}". Try different keywords like:\n• City names (Mumbai, Delhi, Bangalore)\n• Amenities (parks, schools, metro)\n• Price ranges (affordable, premium) 🏙️`;
      }
      
      let responseText = `I found ${results.length} neighborhoods matching "${searchTerms}":\n\n`;
      
      results.slice(0, 4).forEach((neighborhood, index) => {
        responseText += `${index + 1}. **${neighborhood.name}** - ${neighborhood.city}\n`;
        responseText += `   💰 ₹${neighborhood.averageRent?.toLocaleString()}/month\n`;
        responseText += `   🛡️ Safety: ${neighborhood.safetyScore}/10\n`;
        if (neighborhood.amenities && neighborhood.amenities.length > 0) {
          responseText += `   🏢 ${neighborhood.amenities.slice(0, 3).join(', ')}\n`;
        }
        responseText += "\n";
      });
      
      if (results.length > 4) {
        responseText += `... and ${results.length - 4} more results! Use the Explore page to see all results. 🌟`;
      }
      
      return responseText;
    } catch (error) {
      console.error('Search Error:', error);
      return "I'm having trouble searching right now. Please try using the Explore page. 🔍";
    }
  }, []);

  // New comparison handler
  const handleComparisonRequest = useCallback(async (message, context) => {
    return `I can help you compare neighborhoods! Here's what I can compare:\n\n🏘️ **Neighborhood Features:**\n• Rent prices\n• Safety scores\n• Amenities\n• Transportation\n\n💡 **Try asking:**\n• "Compare Bandra vs Andheri"\n• "Which is better for families?"\n• "Show me differences between areas"\n\nWhat would you like to compare? 🤔`;
  }, []);

  // Enhanced preference handler
  const handlePreferenceRequest = useCallback(async (message, context) => {
    if (!user) {
      return "Please log in to see your preferences. You can update your settings on the Profile page. 👤";
    }
    
    let preferenceText = `Here are your current preferences, ${context.user}:\n\n`;
    
    if (context.preferences) {
      preferenceText += `**🏢 Work Style:** ${context.preferences.workStyle || 'Not set'}\n`;
      preferenceText += `**👨‍👩‍👧‍👦 Family Status:** ${context.preferences.familyStatus || 'Not set'}\n`;
      preferenceText += `**🎯 Lifestyle:** ${context.preferences.lifestyle || 'Not set'}\n`;
      preferenceText += `**🏙️ City:** ${context.preferences.city || 'Not set'}\n`;
      
      if (context.preferences.priceRange && context.preferences.priceRange.length === 2) {
        preferenceText += `**💰 Budget:** ₹${context.preferences.priceRange[0]?.toLocaleString()} - ₹${context.preferences.priceRange[1]?.toLocaleString()}/month\n`;
      } else {
        preferenceText += `**💰 Budget:** Not set\n`;
      }
      
      preferenceText += `**🏢 Amenities:** ${context.preferences.amenities?.join(', ') || 'None selected'}\n\n`;
    }
    
    preferenceText += "💡 **Tip:** Update your preferences on the Profile page for better recommendations!";
    
    return preferenceText;
  }, [user]);

  // Enhanced help response
  const getHelpResponse = useCallback((context) => {
    return `Hi ${context.user}! I'm your AI neighborhood assistant. Here's what I can help you with:\n\n🏠 **Find Neighborhoods**\n• "Recommend areas in Mumbai"\n• "Find family-friendly places"\n\n🔍 **Search & Compare**\n• "Search for affordable areas"\n• "Compare Bandra vs Andheri"\n\n⚙️ **Preferences**\n• "What are my preferences?"\n• "Show my settings"\n\n💡 **Smart Features**\n• Personalized recommendations\n• Real-time search\n• Contextual responses\n\nWhat would you like to explore? 🚀`;
  }, []);

  // Enhanced greeting response
  const getGreetingResponse = useCallback((context) => {
    const greetings = [
      `Hello ${context.user}! Ready to find your perfect neighborhood? 🏡`,
      `Hi there, ${context.user}! What neighborhood adventure shall we embark on today? 🗺️`,
      `Hey ${context.user}! I'm here to help you discover amazing places to live. 🌟`,
      `Welcome back, ${context.user}! Let's find you the perfect neighborhood match! 🎯`
    ];
    
    return greetings[Math.floor(Math.random() * greetings.length)];
  }, []);

  // Enhanced general query handler
  const handleGeneralQuery = useCallback(async (message, context) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('how') || lowerMessage.includes('what') || lowerMessage.includes('why')) {
      return `Great question, ${context.user}! I can help you with:\n\n🏘️ **Neighborhood Info**\n• Finding the best areas\n• Comparing different locations\n• Understanding local amenities\n\n💡 **Try asking:**\n• "How do I find a good neighborhood?"\n• "What makes a place family-friendly?"\n• "Why should I choose this area?"\n\nWhat specific information are you looking for? 🤔`;
    }
    
    return `I'd love to help you with that, ${context.user}! Here are some things you can ask me:\n\n🏠 **"Find neighborhoods in [city]"**\n🔍 **"Search for [amenity/feature]"**\n⚙️ **"Show my preferences"**\n🆚 **"Compare [area1] vs [area2]"**\n\nWhat would you like to know? 😊`;
  }, []);

  // AI scoring algorithm
  const calculateAIScore = useCallback((neighborhood, userPreferences) => {
    let score = 0;
    let factors = 0;
    
    // Safety score (30% weight)
    if (neighborhood.safetyScore) {
      score += (neighborhood.safetyScore / 10) * 30;
      factors++;
    }
    
    // Price match (25% weight)
    if (userPreferences?.priceRange && neighborhood.averageRent) {
      const [minPrice, maxPrice] = userPreferences.priceRange;
      if (neighborhood.averageRent >= minPrice && neighborhood.averageRent <= maxPrice) {
        score += 25;
      } else {
        const priceDeviation = Math.min(
          Math.abs(neighborhood.averageRent - minPrice),
          Math.abs(neighborhood.averageRent - maxPrice)
        );
        const maxDeviation = (maxPrice - minPrice) * 0.5;
        score += Math.max(0, 25 - (priceDeviation / maxDeviation) * 25);
      }
      factors++;
    }
    
    // Amenity match (20% weight)
    if (userPreferences?.amenities && neighborhood.amenities) {
      const matchedAmenities = userPreferences.amenities.filter(pref => 
        neighborhood.amenities.some(amenity => 
          amenity.toLowerCase().includes(pref.toLowerCase())
        )
      );
      score += (matchedAmenities.length / userPreferences.amenities.length) * 20;
      factors++;
    }
    
    // Lifestyle score (15% weight)
    if (neighborhood.lifestyleScore) {
      score += (neighborhood.lifestyleScore / 10) * 15;
      factors++;
    }
    
    // Transport score (10% weight)
    if (neighborhood.transportScore) {
      score += (neighborhood.transportScore / 10) * 10;
      factors++;
    }
    
    return factors > 0 ? score : 50; // Default score if no factors
  }, []);

  // Enhanced message sending
  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage('');
    setIsTyping(true);

    // Add typing indicator
    const typingMessage = {
      id: 'typing',
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      typing: true
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      const aiResponse = await processAIRequest(userMessage.content);
      
      // Simulate realistic typing delay
      setTimeout(() => {
        typeMessage(aiResponse, () => {
          setIsTyping(false);
          const finalMessages = [...newMessages, {
            id: Date.now() + 1,
            role: 'assistant',
            content: aiResponse,
            timestamp: new Date(),
            typing: false
          }];
          saveChatHistory(finalMessages);
        });
      }, 500);
      
    } catch (error) {
      console.error('AI Chat Error:', error);
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: "I'm experiencing some technical difficulties. Please try again in a moment. 🔧",
        timestamp: new Date(),
        typing: false
      }]);
      setIsTyping(false);
      showError('AI response failed');
    }
  }, [inputMessage, isTyping, messages, processAIRequest, typeMessage, saveChatHistory, showError]);

  // Enhanced keyboard handling
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  // Chat controls
  const toggleChat = useCallback(() => {
    setIsOpen(!isOpen);
    if (isMinimized) {
      setIsMinimized(false);
    }
  }, [isOpen, isMinimized]);

  const minimizeChat = useCallback(() => {
    setIsMinimized(true);
  }, []);

  const maximizeChat = useCallback(() => {
    setIsMinimized(false);
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
    setIsMinimized(false);
  }, []);

  // Clear chat history
  const clearChat = useCallback(() => {
    setMessages([{
      id: 1,
      role: 'assistant',
      content: "Hello! I'm your NeighborFit AI assistant. How can I help you find the perfect neighborhood today? 🏠",
      timestamp: new Date(),
      typing: false
    }]);
    localStorage.removeItem('neighborfit_chat_history');
    setChatHistory([]);
    showSuccess('Chat history cleared!');
  }, [showSuccess]);

  // Render chat button when closed
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 animate-pulse"
          aria-label="Open AI Chat Assistant"
        >
          <div className="relative">
            <MessageCircle className="w-6 h-6" />
            <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300 animate-bounce" />
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`bg-white rounded-2xl shadow-2xl border border-gray-200 transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
      }`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bot className="w-6 h-6" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <span className="font-semibold">AI Assistant</span>
              <div className="text-xs text-indigo-200">
                {isTyping ? 'Typing...' : 'Online'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearChat}
              className="text-white hover:text-gray-200 transition-colors p-1 rounded"
              title="Clear chat"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              onClick={isMinimized ? maximizeChat : minimizeChat}
              className="text-white hover:text-gray-200 transition-colors p-1 rounded"
              title={isMinimized ? 'Maximize' : 'Minimize'}
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={closeChat}
              className="text-white hover:text-gray-200 transition-colors p-1 rounded"
              title="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        {!isMinimized && (
          <>
            <div className="flex-1 p-4 h-80 overflow-y-auto bg-gray-50">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                          : 'bg-white text-gray-800 border border-gray-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {message.role === 'assistant' && (
                          <Bot className="w-5 h-5 mt-0.5 text-indigo-600 flex-shrink-0" />
                        )}
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                          {message.content}
                          {message.typing && (
                            <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-pulse ml-1"></span>
                          )}
                        </div>
                        {message.role === 'user' && (
                          <User className="w-5 h-5 mt-0.5 text-white flex-shrink-0" />
                        )}
                      </div>
                      <div className={`text-xs mt-2 ${
                        message.role === 'user' ? 'text-indigo-200' : 'text-gray-400'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
              <div className="flex gap-3">
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about neighborhoods..."
                  className="flex-1 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  rows="1"
                  disabled={isTyping}
                  style={{ minHeight: '44px', maxHeight: '120px' }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ModernAIChatbot; 
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X, Minimize2, Maximize2 } from 'lucide-react';
import { useUser } from '../../../context/UserContext';
import { useToast } from '../../../context/ToastContext';
import { neighborhoodAPI } from '../../../lib/api';
import aiService from '../../../lib/aiService';

const AIChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hello! I'm your NeighborFit AI assistant. How can I help you find the perfect neighborhood?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { user, preferences } = useUser();
  const { showError } = useToast();

  const DEBUG_MODE = process.env.NODE_ENV === 'development';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) {
      if (DEBUG_MODE) console.log('Message send blocked:', { inputMessage: inputMessage.trim(), isLoading });
      return;
    }

    if (DEBUG_MODE) console.log('Sending message:', inputMessage);

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToProcess = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      if (DEBUG_MODE) console.log('Processing AI request for:', messageToProcess);
      const aiResponse = await processAIRequest(messageToProcess);
      if (DEBUG_MODE) console.log('AI response received:', aiResponse);
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI Chat Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: "I'm sorry, I'm having some technical difficulties. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      showError('AI response failed');
    } finally {
      setIsLoading(false);
    }
  };

  const processAIRequest = async (message) => {
    try {
      return await aiService.processMessage(message, preferences);
    } catch (error) {
      console.error('AI Processing Error:', error);
      return await handleFallbackProcessing(message);
    }
  };

  const handleFallbackProcessing = async (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('recommend') || lowerMessage.includes('suggestion')) {
      return await handleRecommendationRequest(message);
    } else if (lowerMessage.includes('search') || lowerMessage.includes('find')) {
      return await handleSearchRequest(message);
    } else if (lowerMessage.includes('preference') || lowerMessage.includes('setting')) {
      return await handlePreferenceRequest(message);
    } else if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
      return getHelpResponse();
    } else {
      return await handleGeneralQuery(message);
    }
  };

  const handleRecommendationRequest = async (message) => {
    try {
      console.log('Processing recommendation request...');
      const response = await neighborhoodAPI.getAll();
      console.log('API Response:', response);
      
      const neighborhoods = response.data || response;
      
      if (!neighborhoods || neighborhoods.length === 0) {
        return "I couldn't find any neighborhoods. Please try again later.";
      }
      
      let recommendations = neighborhoods;
      
      if (preferences?.city) {
        recommendations = recommendations.filter(n => 
          n.city.toLowerCase().includes(preferences.city.toLowerCase())
        );
      }
      
      if (preferences?.priceRange && preferences.priceRange.length === 2) {
        const [min, max] = preferences.priceRange;
        recommendations = recommendations.filter(n => 
          n.averageRent >= min && n.averageRent <= max
        );
      }
      
      recommendations.sort((a, b) => {
        const scoreA = (a.safetyScore + a.lifestyleScore) / 2;
        const scoreB = (b.safetyScore + b.lifestyleScore) / 2;
        return scoreB - scoreA;
      });
      
      const topRecommendations = recommendations.slice(0, 3);
      
      if (topRecommendations.length === 0) {
        return "I couldn't find any neighborhoods matching your current preferences. Try adjusting your settings.";
      }
      
      let recommendationText = "Based on your preferences, here are my top recommendations:\n\n";
      topRecommendations.forEach((neighborhood, index) => {
        recommendationText += `${index + 1}. **${neighborhood.name}** - ${neighborhood.city}\n`;
        recommendationText += `   💰 Average Rent: $${neighborhood.averageRent?.toLocaleString()}/month\n`;
        recommendationText += `   🛡️ Safety Score: ${neighborhood.safetyScore}/10\n`;
        recommendationText += `   🌟 Lifestyle Score: ${neighborhood.lifestyleScore}/10\n`;
        if (neighborhood.amenities && neighborhood.amenities.length > 0) {
          recommendationText += `   🏢 Key Features: ${neighborhood.amenities.slice(0, 3).join(', ')}\n`;
        }
        recommendationText += "\n";
      });
      
      recommendationText += "Would you like to know more about any of these?";
      
      return recommendationText;
    } catch (error) {
      console.error('Recommendation Error:', error);
      return "I'm having trouble fetching neighborhood information. Please try again later.";
    }
  };

  const handleSearchRequest = async (message) => {
    try {
      console.log('Processing search request...');
      let searchTerms = message.toLowerCase()
        .replace(/search|find|look for|show me/gi, '')
        .trim();
      
      if (!searchTerms) {
        return "What are you looking for? For example, 'good areas in Mumbai' or 'affordable areas in Delhi'.";
      }
      
      console.log('Search terms:', searchTerms);
      const response = await neighborhoodAPI.search(searchTerms);
      console.log('Search API Response:', response);
      
      const results = response.data || response;
      
      if (!results || results.length === 0) {
        return `I couldn't find any neighborhoods for "${searchTerms}". Try different keywords.`;
      }
      
      let responseText = `I found ${results.length} neighborhoods for "${searchTerms}":\n\n`;
      results.slice(0, 5).forEach((neighborhood, index) => {
        responseText += `${index + 1}. **${neighborhood.name}** - ${neighborhood.city}\n`;
        responseText += `   💰 Rent: $${neighborhood.averageRent?.toLocaleString()}/month\n`;
        responseText += `   🛡️ Safety: ${neighborhood.safetyScore}/10\n`;
        if (neighborhood.amenities && neighborhood.amenities.length > 0) {
          responseText += `   🏢 Features: ${neighborhood.amenities.slice(0, 3).join(', ')}\n`;
        }
        responseText += "\n";
      });
      
      if (results.length > 5) {
        responseText += `... and ${results.length - 5} more. You can use filters to narrow the results.`;
      }
      
      return responseText;
    } catch (error) {
      console.error('Search Error:', error);
      return "I'm having trouble searching right now. Please try using the Explore page.";
    }
  };

  const handlePreferenceRequest = async (message) => {
    if (!user) {
      return "Please log in to see your preferences. You can update your settings on the Profile page.";
    }
    
    let preferenceText = "Your current preferences:\n\n";
    
    if (preferences) {
      preferenceText += `**Work Style:** ${preferences.workStyle || 'Not set'}\n`;
      preferenceText += `**Family Status:** ${preferences.familyStatus || 'Not set'}\n`;
      preferenceText += `**Lifestyle:** ${preferences.lifestyle || 'Not set'}\n`;
      preferenceText += `**City:** ${preferences.city || 'Not set'}\n`;
      if (preferences.priceRange && preferences.priceRange.length === 2) {
        preferenceText += `**Budget Range:** $${preferences.priceRange[0]?.toLocaleString()} - $${preferences.priceRange[1]?.toLocaleString()}/month\n`;
      } else {
        preferenceText += `**Budget Range:** Not set\n`;
      }
      preferenceText += `**Amenities:** ${preferences.amenities?.join(', ') || 'None selected'}\n\n`;
    }
    
    preferenceText += "Go to the Profile page to update your preferences for better suggestions!";
    
    return preferenceText;
  };

  const handleGeneralQuery = async (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('how to') || lowerMessage.includes('how do i')) {
      return "I can help you with these things:\n\n" +
             "🏠 **Finding Neighborhoods** - 'Tell me about good areas in Mumbai'\n" +
             "🔍 **Searching** - 'Places with good schools'\n" +
             "⚙️ **Preferences** - 'What are my preferences?'\n" +
             "👋 **Greetings** - Just say 'Hi!'";
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello there! How can I assist you today?";
    }
    
    return "I'm not sure how to answer that. You can ask me to 'recommend a neighborhood', 'search for a place', or check your 'preferences'.";
  };

  const getHelpResponse = () => {
    return "You can ask me things like:\n\n" +
           "  - 'Find neighborhoods in Delhi with good parks.'\n" +
           "  - 'Can you recommend a family-friendly area?'\n" +
           "  - 'What are my current preferences?'\n" +
           "  - 'Show me places with a budget of $2000.'\n" +
           "  - 'Hi' or 'Help'\n\n" +
           "Your preferences on your profile help me make better recommendations!";
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (isMinimized) {
      setIsMinimized(false);
    }
  };

  const minimizeChat = () => {
    setIsMinimized(true);
    setIsOpen(false);
  };
  
  const maximizeChat = () => {
    setIsMinimized(false);
    setIsOpen(true);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
          <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        >
          <Bot className="w-6 h-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`bg-white rounded-lg shadow-2xl border border-gray-200 transition-all duration-300 ${
        isMinimized ? 'w-80 h-12' : 'w-96 h-96'
      }`}>
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            <span className="font-semibold">AI Assistant</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            <div className="flex-1 p-4 h-64 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {message.type === 'ai' && (
                          <Bot className="w-4 h-4 mt-0.5 text-indigo-600 flex-shrink-0" />
                        )}
                        <div className="whitespace-pre-wrap text-sm">
                          {message.content}
                        </div>
                        {message.type === 'user' && (
                          <User className="w-4 h-4 mt-0.5 text-white flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Bot className="w-4 h-4 text-indigo-600" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="w-full p-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows="1"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AIChatAssistant;
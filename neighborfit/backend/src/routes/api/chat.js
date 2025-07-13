const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Neighborhood = require('../../models/Neighborhood');

// AI Chat endpoint
router.post('/message', auth, async (req, res) => {
  try {
    const { message, context } = req.body;
    const userId = req.user.userId;

    // Process the message and generate response
    const response = await processAIMessage(message, context, userId);
    
    res.json({
      success: true,
      response: response,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process message',
      message: error.message
    });
  }
});

// AI message processing function
async function processAIMessage(message, context, userId) {
  try {
    const lowerMessage = message.toLowerCase();
    
    // Intent detection and response generation
    if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest')) {
      return await generateRecommendations(context, userId);
    } else if (lowerMessage.includes('search') || lowerMessage.includes('find')) {
      return await handleSearch(message, context);
    } else if (lowerMessage.includes('compare')) {
      return await handleComparison(message, context);
    } else {
      return generateGenericResponse(message, context);
    }
  } catch (error) {
    console.error('AI Processing Error:', error);
    return "I'm experiencing some technical difficulties. Please try again.";
  }
}

async function generateRecommendations(context, userId) {
  try {
    const neighborhoods = await Neighborhood.find({}).limit(10);
    
    // Apply user preferences filtering
    let filtered = neighborhoods;
    if (context.preferences?.city) {
      filtered = filtered.filter(n => 
        n.city.toLowerCase().includes(context.preferences.city.toLowerCase())
      );
    }
    
    if (context.preferences?.priceRange) {
      const [min, max] = context.preferences.priceRange;
      filtered = filtered.filter(n => 
        n.averageRent >= min && n.averageRent <= max
      );
    }
    
    // Generate response
    const top3 = filtered.slice(0, 3);
    let response = "Based on your preferences, here are my top recommendations:\n\n";
    
    top3.forEach((neighborhood, index) => {
      response += `${index + 1}. **${neighborhood.name}** - ${neighborhood.city}\n`;
      response += `   💰 Rent: ₹${neighborhood.averageRent?.toLocaleString()}/month\n`;
      response += `   🛡️ Safety: ${neighborhood.safetyScore}/10\n`;
      if (neighborhood.amenities?.length > 0) {
        response += `   🏢 Features: ${neighborhood.amenities.slice(0, 3).join(', ')}\n`;
      }
      response += "\n";
    });
    
    return response;
  } catch (error) {
    console.error('Recommendation Error:', error);
    return "I'm having trouble generating recommendations right now.";
  }
}

async function handleSearch(message, context) {
  try {
    // Extract search terms
    const searchTerms = message.toLowerCase()
      .replace(/search|find|look for|show me/gi, '')
      .trim();
    
    if (!searchTerms) {
      return "What are you looking for? Try asking about specific cities, amenities, or price ranges.";
    }
    
    // Search neighborhoods
    const results = await Neighborhood.find({
      $or: [
        { name: { $regex: searchTerms, $options: 'i' } },
        { city: { $regex: searchTerms, $options: 'i' } },
        { amenities: { $regex: searchTerms, $options: 'i' } }
      ]
    }).limit(5);
    
    if (results.length === 0) {
      return `I couldn't find any neighborhoods matching "${searchTerms}". Try different keywords.`;
    }
    
    let response = `I found ${results.length} neighborhoods matching "${searchTerms}":\n\n`;
    
    results.forEach((neighborhood, index) => {
      response += `${index + 1}. **${neighborhood.name}** - ${neighborhood.city}\n`;
      response += `   💰 ₹${neighborhood.averageRent?.toLocaleString()}/month\n`;
      response += `   🛡️ Safety: ${neighborhood.safetyScore}/10\n\n`;
    });
    
    return response;
  } catch (error) {
    console.error('Search Error:', error);
    return "I'm having trouble searching right now.";
  }
}

async function handleComparison(message, context) {
  return "I can help you compare neighborhoods! Please specify which areas you'd like to compare, or ask me to recommend some options for comparison.";
}

function generateGenericResponse(message, context) {
  const responses = [
    "I'm here to help you find the perfect neighborhood! You can ask me to recommend areas, search for specific features, or compare different locations.",
    "I can assist you with neighborhood recommendations, searches, and comparisons. What would you like to know?",
    "Feel free to ask me about neighborhoods, amenities, prices, or anything else related to finding your perfect home!"
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

module.exports = router; 
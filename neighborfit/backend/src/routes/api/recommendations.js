const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const recommendationService = require('../../services/recommendationService');
const User = require('../../models/User');

// Get personalized recommendations
router.get('/personalized', auth, async (req, res) => {
  try {
    const { userId } = req.user;
    const { limit = 10, type = 'all' } = req.query;

    const recommendations = await recommendationService.generateRecommendations(userId, {
      limit: parseInt(limit),
      type
    });

    res.json({
      success: true,
      data: recommendations,
      message: 'Personalized recommendations generated successfully'
    });
  } catch (error) {
    console.error('Personalized recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate personalized recommendations',
      error: error.message
    });
  }
});

// Get recommendations by category
router.get('/category/:category', auth, async (req, res) => {
  try {
    const { userId } = req.user;
    const { category } = req.params;
    const { limit = 6 } = req.query;

    const allRecommendations = await recommendationService.generateRecommendations(userId, {
      limit: parseInt(limit) * 2 // Get more to allow for filtering
    });

    let filteredRecommendations = allRecommendations.recommendations;

    // Apply category-specific filters
    switch (category) {
      case 'budget':
        filteredRecommendations = filteredRecommendations
          .sort((a, b) => a.averageRent - b.averageRent)
          .slice(0, parseInt(limit));
        break;
      
      case 'safety':
        filteredRecommendations = filteredRecommendations
          .filter(rec => rec.safetyScore >= 7)
          .sort((a, b) => b.safetyScore - a.safetyScore)
          .slice(0, parseInt(limit));
        break;
      
      case 'trending':
        filteredRecommendations = filteredRecommendations
          .sort((a, b) => b.averageRating - a.averageRating)
          .slice(0, parseInt(limit));
        break;
      
      case 'family':
        filteredRecommendations = filteredRecommendations
          .filter(rec => rec.amenities?.includes('Schools') || rec.amenities?.includes('Parks'))
          .slice(0, parseInt(limit));
        break;
      
      default:
        filteredRecommendations = filteredRecommendations.slice(0, parseInt(limit));
    }

    res.json({
      success: true,
      data: {
        recommendations: filteredRecommendations,
        metadata: {
          ...allRecommendations.metadata,
          category,
          filtered: true
        }
      },
      message: `${category} recommendations generated successfully`
    });
  } catch (error) {
    console.error('Category recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate category recommendations',
      error: error.message
    });
  }
});

// Track user interaction for improving recommendations
router.post('/interaction', auth, async (req, res) => {
  try {
    const { userId } = req.user;
    const { neighborhoodId, interactionType, metadata = {} } = req.body;

    // In a real app, you'd store this in a UserInteractions collection
    // For now, we'll update user preferences or favorites
    
    if (interactionType === 'favorite') {
      await User.findByIdAndUpdate(userId, {
        $addToSet: { favoriteNeighborhoods: neighborhoodId }
      });
    }

    // Track interaction for future ML model training
    console.log('User interaction tracked:', {
      userId,
      neighborhoodId,
      interactionType,
      timestamp: new Date(),
      metadata
    });

    res.json({
      success: true,
      message: 'Interaction tracked successfully'
    });
  } catch (error) {
    console.error('Interaction tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track interaction',
      error: error.message
    });
  }
});

// Get recommendation explanations
router.get('/explain/:neighborhoodId', auth, async (req, res) => {
  try {
    const { userId } = req.user;
    const { neighborhoodId } = req.params;

    const user = await User.findById(userId);
    const recommendations = await recommendationService.generateRecommendations(userId, {
      limit: 50
    });

    const targetRecommendation = recommendations.recommendations.find(
      rec => rec._id.toString() === neighborhoodId
    );

    if (!targetRecommendation) {
      return res.status(404).json({
        success: false,
        message: 'Recommendation not found'
      });
    }

    const explanation = {
      neighborhood: targetRecommendation,
      reasons: targetRecommendation.explanations || [],
      score: targetRecommendation.finalScore,
      confidence: targetRecommendation.confidence,
      algorithms: targetRecommendation.algorithms,
      matchedFeatures: targetRecommendation.matchedFeatures || [],
      userPreferences: user.preferences
    };

    res.json({
      success: true,
      data: explanation,
      message: 'Recommendation explanation generated'
    });
  } catch (error) {
    console.error('Recommendation explanation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate explanation',
      error: error.message
    });
  }
});

module.exports = router; 
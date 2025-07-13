// World-Class Personalized Recommendation Service
// Following Netflix, Amazon, and Spotify best practices

const Neighborhood = require('../models/Neighborhood');
const User = require('../models/User');

class RecommendationService {
  constructor() {
    // Feature weights for different recommendation algorithms
    this.featureWeights = {
      collaborative: 0.4,    // User-based collaborative filtering
      contentBased: 0.3,     // Content-based filtering
      hybrid: 0.2,           // Hybrid approach
      popularity: 0.1        // Popularity-based
    };

    // User behavior tracking weights
    this.behaviorWeights = {
      view: 1,
      favorite: 3,
      rating: 2,
      timeSpent: 1.5,
      search: 0.5
    };

    // Preference importance matrix
    this.preferenceMatrix = {
      safetyImportance: {
        weight: 0.25,
        field: 'safetyScore'
      },
      nightlifeImportance: {
        weight: 0.15,
        field: 'lifestyleScore'
      },
      greenSpaceImportance: {
        weight: 0.20,
        field: 'amenities',
        values: ['Parks', 'Gardens', 'Green Spaces']
      },
      schoolQualityImportance: {
        weight: 0.15,
        field: 'amenities',
        values: ['Schools', 'International Schools', 'Colleges']
      },
      publicTransportImportance: {
        weight: 0.25,
        field: 'transportScore'
      }
    };
  }

  // Main recommendation engine
  async generateRecommendations(userId, options = {}) {
    try {
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');

      const neighborhoods = await Neighborhood.find({});
      const userInteractions = await this.getUserInteractions(userId);

      // Multi-algorithm approach
      const recommendations = await Promise.all([
        this.collaborativeFiltering(user, neighborhoods, userInteractions),
        this.contentBasedFiltering(user, neighborhoods),
        this.hybridFiltering(user, neighborhoods, userInteractions),
        this.popularityBasedFiltering(neighborhoods)
      ]);

      // Combine and rank recommendations
      const finalRecommendations = this.combineRecommendations(recommendations);
      
      // Apply diversity and novelty
      const diverseRecommendations = this.applyDiversity(finalRecommendations);
      
      // Add explanation and confidence scores
      const explainableRecommendations = this.addExplanations(diverseRecommendations, user);

      return {
        recommendations: explainableRecommendations.slice(0, options.limit || 10),
        metadata: {
          algorithm: 'hybrid-ml',
          confidence: this.calculateOverallConfidence(explainableRecommendations),
          diversity: this.calculateDiversity(explainableRecommendations),
          timestamp: new Date()
        }
      };
    } catch (error) {
      console.error('Recommendation generation error:', error);
      throw error;
    }
  }

  // Collaborative Filtering - User-based
  async collaborativeFiltering(user, neighborhoods, userInteractions) {
    try {
      // Find similar users based on preferences and behavior
      const similarUsers = await this.findSimilarUsers(user);
      
      // Get neighborhoods liked by similar users
      const collaborativeScores = new Map();
      
      for (const similarUser of similarUsers) {
        const similarity = this.calculateUserSimilarity(user, similarUser);
        const userFavorites = await this.getUserFavorites(similarUser._id);
        
        userFavorites.forEach(neighborhoodId => {
          const currentScore = collaborativeScores.get(neighborhoodId) || 0;
          collaborativeScores.set(neighborhoodId, currentScore + similarity);
        });
      }

      // Convert to neighborhood objects with scores
      const recommendations = [];
      for (const [neighborhoodId, score] of collaborativeScores) {
        const neighborhood = neighborhoods.find(n => n._id.toString() === neighborhoodId);
        if (neighborhood) {
          recommendations.push({
            ...neighborhood.toObject(),
            algorithmScore: score,
            algorithm: 'collaborative',
            confidence: Math.min(score / 10, 1)
          });
        }
      }

      return recommendations.sort((a, b) => b.algorithmScore - a.algorithmScore);
    } catch (error) {
      console.error('Collaborative filtering error:', error);
      return [];
    }
  }

  // Content-Based Filtering
  async contentBasedFiltering(user, neighborhoods) {
    try {
      const preferences = user.preferences || {};
      const recommendations = [];

      for (const neighborhood of neighborhoods) {
        let score = 0;
        let matchedFeatures = [];

        // Price range matching
        if (preferences.priceRange && preferences.priceRange.length === 2) {
          const [minPrice, maxPrice] = preferences.priceRange;
          if (neighborhood.averageRent >= minPrice && neighborhood.averageRent <= maxPrice) {
            score += 20;
            matchedFeatures.push('Budget Match');
          } else {
            // Penalty for out-of-budget
            const deviation = Math.abs(neighborhood.averageRent - ((minPrice + maxPrice) / 2));
            score -= Math.min(deviation / 10000, 15);
          }
        }

        // Preference importance scoring
        Object.entries(this.preferenceMatrix).forEach(([prefKey, config]) => {
          const importance = preferences[prefKey] || 5;
          const weight = config.weight * (importance / 10);

          if (config.field === 'amenities') {
            const hasAmenities = config.values.some(value => 
              neighborhood.amenities?.includes(value)
            );
            if (hasAmenities) {
              score += weight * 30;
              matchedFeatures.push(`${prefKey.replace('Importance', '')} Match`);
            }
          } else {
            const fieldValue = neighborhood[config.field];
            if (fieldValue) {
              score += weight * fieldValue * 3;
              if (fieldValue >= 7) {
                matchedFeatures.push(`High ${config.field}`);
              }
            }
          }
        });

        // Lifestyle matching
        if (preferences.lifestyle) {
          const lifestyleScore = this.calculateLifestyleMatch(preferences.lifestyle, neighborhood);
          score += lifestyleScore;
          if (lifestyleScore > 15) {
            matchedFeatures.push('Lifestyle Match');
          }
        }

        // Work style matching
        if (preferences.workStyle) {
          const workStyleScore = this.calculateWorkStyleMatch(preferences.workStyle, neighborhood);
          score += workStyleScore;
          if (workStyleScore > 10) {
            matchedFeatures.push('Work Style Match');
          }
        }

        // Family status matching
        if (preferences.familyStatus) {
          const familyScore = this.calculateFamilyMatch(preferences.familyStatus, neighborhood);
          score += familyScore;
          if (familyScore > 10) {
            matchedFeatures.push('Family Friendly');
          }
        }

        recommendations.push({
          ...neighborhood.toObject(),
          algorithmScore: Math.max(score, 0),
          algorithm: 'content-based',
          matchedFeatures,
          confidence: Math.min(score / 100, 1)
        });
      }

      return recommendations.sort((a, b) => b.algorithmScore - a.algorithmScore);
    } catch (error) {
      console.error('Content-based filtering error:', error);
      return [];
    }
  }

  // Hybrid Filtering - Matrix Factorization inspired
  async hybridFiltering(user, neighborhoods, userInteractions) {
    try {
      // Combine user preferences with implicit feedback
      const recommendations = [];
      
      for (const neighborhood of neighborhoods) {
        let score = 0;
        
        // Implicit feedback score
        const interactionScore = userInteractions
          .filter(interaction => interaction.neighborhoodId === neighborhood._id.toString())
          .reduce((sum, interaction) => {
            return sum + (this.behaviorWeights[interaction.type] || 1) * interaction.weight;
          }, 0);

        // Preference-based score
        const preferenceScore = this.calculatePreferenceScore(user.preferences, neighborhood);
        
        // Contextual factors
        const contextScore = this.calculateContextualScore(user, neighborhood);
        
        // Combine scores
        score = (interactionScore * 0.4) + (preferenceScore * 0.4) + (contextScore * 0.2);
        
        recommendations.push({
          ...neighborhood.toObject(),
          algorithmScore: score,
          algorithm: 'hybrid',
          confidence: Math.min(score / 50, 1)
        });
      }

      return recommendations.sort((a, b) => b.algorithmScore - a.algorithmScore);
    } catch (error) {
      console.error('Hybrid filtering error:', error);
      return [];
    }
  }

  // Popularity-Based Filtering
  async popularityBasedFiltering(neighborhoods) {
    try {
      const recommendations = neighborhoods.map(neighborhood => {
        const popularityScore = (
          (neighborhood.averageRating || 0) * 10 +
          (neighborhood.numRatings || 0) * 2 +
          (neighborhood.safetyScore || 0) * 3 +
          (neighborhood.lifestyleScore || 0) * 2 +
          (neighborhood.transportScore || 0) * 2
        );

        return {
          ...neighborhood.toObject(),
          algorithmScore: popularityScore,
          algorithm: 'popularity',
          confidence: Math.min(popularityScore / 100, 1)
        };
      });

      return recommendations.sort((a, b) => b.algorithmScore - a.algorithmScore);
    } catch (error) {
      console.error('Popularity-based filtering error:', error);
      return [];
    }
  }

  // Helper Methods
  calculateLifestyleMatch(lifestyle, neighborhood) {
    const lifestyleMapping = {
      'traditional': ['Temples', 'Markets', 'Community Centers'],
      'modern': ['Shopping Malls', 'Restaurants', 'Gyms'],
      'cultural': ['Art Galleries', 'Museums', 'Cultural Centers'],
      'active': ['Parks', 'Sports Complex', 'Gyms'],
      'social': ['Restaurants', 'Cafes', 'Community Centers']
    };

    const relevantAmenities = lifestyleMapping[lifestyle] || [];
    const matches = relevantAmenities.filter(amenity => 
      neighborhood.amenities?.includes(amenity)
    ).length;

    return matches * 8;
  }

  calculateWorkStyleMatch(workStyle, neighborhood) {
    const workStyleMapping = {
      'remote': ['Coworking Spaces', 'Cafes', 'High-Speed Internet'],
      'hybrid': ['Metro Access', 'Coworking Spaces', 'IT Parks'],
      'office': ['Metro Access', 'Corporate Offices', 'Business Districts'],
      'freelance': ['Coworking Spaces', 'Cafes', 'Libraries']
    };

    const relevantAmenities = workStyleMapping[workStyle] || [];
    const matches = relevantAmenities.filter(amenity => 
      neighborhood.amenities?.includes(amenity)
    ).length;

    return matches * 6;
  }

  calculateFamilyMatch(familyStatus, neighborhood) {
    const familyMapping = {
      'single': ['Restaurants', 'Gyms', 'Entertainment'],
      'couple': ['Restaurants', 'Parks', 'Shopping'],
      'nuclear-family': ['Schools', 'Parks', 'Hospitals', 'Safety'],
      'joint-family': ['Schools', 'Hospitals', 'Community Centers', 'Markets']
    };

    const relevantFeatures = familyMapping[familyStatus] || [];
    let score = 0;

    relevantFeatures.forEach(feature => {
      if (feature === 'Safety' && neighborhood.safetyScore >= 7) {
        score += 10;
      } else if (neighborhood.amenities?.includes(feature)) {
        score += 5;
      }
    });

    return score;
  }

  // User similarity calculation using cosine similarity
  calculateUserSimilarity(user1, user2) {
    const prefs1 = user1.preferences || {};
    const prefs2 = user2.preferences || {};
    
    // Extract numerical preferences
    const features1 = [
      prefs1.safetyImportance || 5,
      prefs1.nightlifeImportance || 3,
      prefs1.greenSpaceImportance || 4,
      prefs1.schoolQualityImportance || 3,
      prefs1.publicTransportImportance || 4,
      prefs1.priceRange ? prefs1.priceRange[1] : 50000
    ];

    const features2 = [
      prefs2.safetyImportance || 5,
      prefs2.nightlifeImportance || 3,
      prefs2.greenSpaceImportance || 4,
      prefs2.schoolQualityImportance || 3,
      prefs2.publicTransportImportance || 4,
      prefs2.priceRange ? prefs2.priceRange[1] : 50000
    ];

    // Cosine similarity
    const dotProduct = features1.reduce((sum, val, idx) => sum + val * features2[idx], 0);
    const magnitude1 = Math.sqrt(features1.reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(features2.reduce((sum, val) => sum + val * val, 0));

    return dotProduct / (magnitude1 * magnitude2);
  }

  // Combine recommendations from different algorithms
  combineRecommendations(algorithmResults) {
    const [collaborative, contentBased, hybrid, popularity] = algorithmResults;
    const combinedScores = new Map();

    // Combine scores with weights
    [collaborative, contentBased, hybrid, popularity].forEach((results, index) => {
      const weight = Object.values(this.featureWeights)[index];
      
      results.forEach(item => {
        const id = item._id.toString();
        const currentScore = combinedScores.get(id) || { item, score: 0, algorithms: [] };
        
        currentScore.score += item.algorithmScore * weight;
        currentScore.algorithms.push(item.algorithm);
        
        combinedScores.set(id, currentScore);
      });
    });

    // Convert to array and sort
    return Array.from(combinedScores.values())
      .sort((a, b) => b.score - a.score)
      .map(entry => ({
        ...entry.item,
        finalScore: entry.score,
        algorithms: entry.algorithms
      }));
  }

  // Apply diversity to avoid filter bubbles
  applyDiversity(recommendations) {
    const diverse = [];
    const cityCount = new Map();
    const priceRanges = new Map();

    for (const rec of recommendations) {
      const city = rec.city;
      const priceRange = Math.floor(rec.averageRent / 20000) * 20000;

      const cityFreq = cityCount.get(city) || 0;
      const priceFreq = priceRanges.get(priceRange) || 0;

      // Diversity penalty
      const diversityPenalty = (cityFreq * 0.1) + (priceFreq * 0.05);
      
      if (cityFreq < 3 && priceFreq < 2) {
        diverse.push({
          ...rec,
          finalScore: rec.finalScore - diversityPenalty
        });
        
        cityCount.set(city, cityFreq + 1);
        priceRanges.set(priceRange, priceFreq + 1);
      }
    }

    return diverse.sort((a, b) => b.finalScore - a.finalScore);
  }

  // Add explanations for recommendations
  addExplanations(recommendations, user) {
    return recommendations.map(rec => {
      const explanations = [];
      
      if (rec.matchedFeatures?.length > 0) {
        explanations.push(`Matches your preferences: ${rec.matchedFeatures.join(', ')}`);
      }
      
      if (rec.algorithms?.includes('collaborative')) {
        explanations.push('Users with similar preferences also liked this');
      }
      
      if (rec.finalScore > 80) {
        explanations.push('Highly recommended based on your profile');
      }

      return {
        ...rec,
        explanations,
        recommendationReason: explanations[0] || 'AI recommended based on multiple factors'
      };
    });
  }

  // Utility methods
  async findSimilarUsers(user) {
    const users = await User.find({ _id: { $ne: user._id } }).limit(100);
    return users
      .map(u => ({ ...u.toObject(), similarity: this.calculateUserSimilarity(user, u) }))
      .filter(u => u.similarity > 0.7)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 10);
  }

  async getUserFavorites(userId) {
    const user = await User.findById(userId);
    return user?.favoriteNeighborhoods || [];
  }

  async getUserInteractions(userId) {
    // In a real app, this would come from a user interactions collection
    // For now, we'll simulate based on favorites and preferences
    const user = await User.findById(userId);
    const interactions = [];
    
    if (user?.favoriteNeighborhoods?.length > 0) {
      user.favoriteNeighborhoods.forEach(neighborhoodId => {
        interactions.push({
          neighborhoodId: neighborhoodId.toString(),
          type: 'favorite',
          weight: 1,
          timestamp: new Date()
        });
      });
    }

    return interactions;
  }

  calculatePreferenceScore(preferences, neighborhood) {
    // Implementation of preference scoring logic
    let score = 0;
    
    if (preferences?.priceRange && preferences.priceRange.length === 2) {
      const [min, max] = preferences.priceRange;
      if (neighborhood.averageRent >= min && neighborhood.averageRent <= max) {
        score += 20;
      }
    }
    
    // Add other preference calculations
    return score;
  }

  calculateContextualScore(user, neighborhood) {
    // Time-based, location-based, and seasonal factors
    let score = 0;
    
    // Age-based preferences
    if (user.age < 30 && neighborhood.lifestyleScore > 7) {
      score += 5;
    } else if (user.age >= 30 && neighborhood.safetyScore > 7) {
      score += 5;
    }
    
    return score;
  }

  calculateOverallConfidence(recommendations) {
    const avgConfidence = recommendations.reduce((sum, rec) => sum + (rec.confidence || 0), 0) / recommendations.length;
    return Math.min(avgConfidence, 1);
  }

  calculateDiversity(recommendations) {
    const cities = new Set(recommendations.map(rec => rec.city));
    const priceRanges = new Set(recommendations.map(rec => Math.floor(rec.averageRent / 20000)));
    
    return (cities.size / recommendations.length) * (priceRanges.size / recommendations.length);
  }
}

module.exports = new RecommendationService(); 
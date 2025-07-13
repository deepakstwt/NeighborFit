import React from 'react';
import { Brain, Database, Map, Users } from 'lucide-react';

function About() {
  const features = [
    {
      icon: Brain,
      title: 'Smart Matching Algorithm',
      description: 'Our AI analyzes your lifestyle preferences and matches them with neighborhood characteristics using weighted scoring for Indian cities.'
    },
    {
      icon: Database,
      title: 'Real Data Sources',
      description: 'We aggregate data from Indian government databases, OpenStreetMap, and local APIs to provide accurate neighborhood insights.'
    },
    {
      icon: Map,
      title: 'Interactive Exploration',
      description: 'Visualize neighborhoods on interactive maps with amenities, transportation, and demographic overlays specific to Indian cities.'
    },
    {
      icon: Users,
      title: 'Community-Driven',
      description: 'Built for Indians making real decisions about where to live, with transparency in our matching process and local context.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">About NeighborFit</h1>
          <p className="text-xl opacity-90">
            Helping Indians find their perfect neighborhood through data-driven insights and personalized matching
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mission */}
        <div className="card mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We believe that finding the right neighborhood is one of life's most important decisions, especially in India's diverse and dynamic cities. 
            NeighborFit was created to make this process more scientific, transparent, and personal by 
            combining real neighborhood data with your unique lifestyle preferences and cultural considerations.
          </p>
        </div>

        {/* How It Works */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">How Our Algorithm Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="card">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Algorithm Details */}
        <div className="card mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">The Matching Process</h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mr-4 text-sm font-bold">
                1
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Preference Collection</h3>
                <p className="text-gray-600">
                  We collect your lifestyle preferences, work requirements, family status, cultural preferences, and priorities 
                  through our comprehensive onboarding questionnaire designed for Indian families.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mr-4 text-sm font-bold">
                2
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Analysis</h3>
                <p className="text-gray-600">
                  Each neighborhood is analyzed across multiple dimensions: safety scores, amenity density, 
                  transportation access (including metro connectivity), demographics, cost of living, and cultural amenities.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mr-4 text-sm font-bold">
                3
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Weighted Scoring</h3>
                <p className="text-gray-600">
                  We calculate a compatibility score by weighing neighborhood characteristics against your 
                  preferences, with higher weights for factors you marked as most important, including cultural considerations.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mr-4 text-sm font-bold">
                4
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Personalized Results</h3>
                <p className="text-gray-600">
                  Neighborhoods are ranked by compatibility score and presented with detailed explanations 
                  of why each area matches your lifestyle and requirements in the Indian context.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Sources */}
        <div className="card mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Data Sources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Geographic & Amenities</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• OpenStreetMap India</li>
                <li>• Municipal Corporation Data</li>
                <li>• Google Places API</li>
                <li>• Local Business Directories</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Demographics & Safety</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Census of India</li>
                <li>• Police Department Data</li>
                <li>• Education Department</li>
                <li>• Public Transport Data</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Indian Context */}
        <div className="card mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Indian Neighborhoods</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              India's cities are unique in their diversity, culture, and urban planning. Our algorithm takes into account 
              factors specific to Indian neighborhoods such as joint family considerations, cultural amenities, 
              local market access, and traditional vs. modern lifestyle preferences.
            </p>
            <p>
              We understand that safety, connectivity, and community are paramount in Indian cities, and our matching 
              process prioritizes these factors while respecting cultural and religious considerations.
            </p>
            <p>
              From metro connectivity in Delhi to tech hubs in Bangalore, from cultural hotspots in Mumbai to 
              educational institutions in Chennai, we map the unique characteristics that make each Indian city special.
            </p>
          </div>
        </div>

        {/* Transparency */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment to Transparency</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              We believe in algorithmic transparency. Every match score can be broken down to show exactly 
              how it was calculated, which factors contributed most strongly, and where the data came from.
            </p>
            <p>
              Our goal is to augment your decision-making process, not replace it. We provide data-driven 
              insights to help you make informed choices about one of life's biggest decisions in the Indian context.
            </p>
            <p>
              All source code for this project is available on GitHub, and we welcome contributions from 
              the Indian developer community to improve our algorithms and data sources.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About; 
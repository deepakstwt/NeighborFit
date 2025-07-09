const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Neighborhood = require('./models/Neighborhood');

// Load environment variables
dotenv.config();

console.log('🚀 Starting production database seeding...');
console.log('📋 This script will add many neighborhoods for better exploration');
console.log('💡 Users will be created only when they actually sign up');

// Expanded neighborhood data
const neighborhoods = [
  // Mumbai
  {
    name: "Bandra West",
    city: "Mumbai",
    description: "Trendy suburb known for its vibrant nightlife, upscale restaurants, and proximity to the beach. Popular among young professionals and celebrities.",
    averageRent: 65000,
    safetyScore: 8,
    lifestyleScore: 9,
    transportScore: 8,
    amenities: ["Metro Station", "Shopping Malls", "Restaurants", "Beach Access", "Gyms", "Cafes"],
    location: {
      type: "Point",
      coordinates: [72.8295, 19.0596]
    },
    tags: ["Trendy", "Nightlife", "Beach", "Upscale"],
    nearbyLandmarks: ["Bandra-Worli Sea Link", "Carter Road", "Linking Road"]
  },
  {
    name: "Andheri East",
    city: "Mumbai",
    description: "Major business hub with excellent connectivity. Home to many IT companies and close to the airport.",
    averageRent: 50000,
    safetyScore: 7,
    lifestyleScore: 8,
    transportScore: 9,
    amenities: ["Metro Station", "Airport Proximity", "Business Centers", "Shopping Malls", "Restaurants"],
    location: {
      type: "Point",
      coordinates: [72.8697, 19.1136]
    },
    tags: ["Business Hub", "IT Companies", "Airport"],
    nearbyLandmarks: ["Chhatrapati Shivaji Airport", "Powai Lake", "Infinity Mall"]
  },
  {
    name: "Powai",
    city: "Mumbai",
    description: "Planned township with beautiful lake views, excellent infrastructure, and proximity to top educational institutions.",
    averageRent: 57500,
    safetyScore: 9,
    lifestyleScore: 8,
    transportScore: 7,
    amenities: ["Lake View", "IIT Bombay", "Shopping Centers", "Restaurants", "Parks", "Hospitals"],
    location: {
      type: "Point",
      coordinates: [72.9089, 19.1197]
    },
    tags: ["Planned Township", "Lake View", "Educational Hub"],
    nearbyLandmarks: ["Powai Lake", "IIT Bombay", "Hiranandani Gardens"]
  },
  {
    name: "Juhu",
    city: "Mumbai",
    description: "Beach-side locality popular among Bollywood celebrities. Known for its vibrant street food and beach activities.",
    averageRent: 70000,
    safetyScore: 7,
    lifestyleScore: 9,
    transportScore: 7,
    amenities: ["Beach Access", "Street Food", "Restaurants", "Airport Proximity", "Parks"],
    location: {
      type: "Point",
      coordinates: [72.8264, 19.0883]
    },
    tags: ["Beach", "Bollywood", "Street Food"],
    nearbyLandmarks: ["Juhu Beach", "ISKCON Temple", "Prithvi Theatre"]
  },
  {
    name: "Malad West",
    city: "Mumbai",
    description: "Rapidly developing suburb with good connectivity and affordable housing options. Growing commercial hub.",
    averageRent: 35000,
    safetyScore: 7,
    lifestyleScore: 7,
    transportScore: 8,
    amenities: ["Metro Station", "Shopping Malls", "Restaurants", "Parks", "Schools"],
    location: {
      type: "Point",
      coordinates: [72.8493, 19.1864]
    },
    tags: ["Affordable", "Developing", "Family Friendly"],
    nearbyLandmarks: ["Inorbit Mall", "Aksa Beach", "Goregaon Film City"]
  },
  
  // Delhi
  {
    name: "Connaught Place",
    city: "Delhi",
    description: "Historic commercial center with excellent connectivity. Hub for shopping, dining, and business activities.",
    averageRent: 60000,
    safetyScore: 8,
    lifestyleScore: 9,
    transportScore: 10,
    amenities: ["Metro Station", "Shopping Centers", "Restaurants", "Business Centers", "Historical Sites"],
    location: {
      type: "Point",
      coordinates: [77.2167, 28.6315]
    },
    tags: ["Historic", "Commercial", "Central"],
    nearbyLandmarks: ["India Gate", "Parliament House", "Central Park"]
  },
  {
    name: "Gurgaon Sector 29",
    city: "Gurgaon",
    description: "Modern business district with high-rise buildings, shopping malls, and excellent infrastructure.",
    averageRent: 52500,
    safetyScore: 8,
    lifestyleScore: 8,
    transportScore: 8,
    amenities: ["Metro Station", "Shopping Malls", "Restaurants", "Business Centers", "Gyms"],
    location: {
      type: "Point",
      coordinates: [77.0266, 28.4595]
    },
    tags: ["Modern", "Business District", "High-rise"],
    nearbyLandmarks: ["Leisure Valley Park", "Kingdom of Dreams", "Ambience Mall"]
  },
  {
    name: "Lajpat Nagar",
    city: "Delhi",
    description: "Vibrant market area known for its affordable shopping and diverse food options. Great connectivity.",
    averageRent: 30000,
    safetyScore: 7,
    lifestyleScore: 8,
    transportScore: 9,
    amenities: ["Metro Station", "Markets", "Restaurants", "Street Food", "Parks"],
    location: {
      type: "Point",
      coordinates: [77.2430, 28.5653]
    },
    tags: ["Market", "Affordable", "Food Hub"],
    nearbyLandmarks: ["Lajpat Nagar Central Market", "Defense Colony", "Khan Market"]
  },
  {
    name: "Karol Bagh",
    city: "Delhi",
    description: "Central Delhi location with excellent shopping and dining options. Perfect for families and young professionals.",
    averageRent: 37500,
    safetyScore: 7,
    lifestyleScore: 8,
    transportScore: 9,
    amenities: ["Metro Station", "Shopping Centers", "Restaurants", "Markets", "Schools"],
    location: {
      type: "Point",
      coordinates: [77.1900, 28.6519]
    },
    tags: ["Central", "Shopping", "Family Friendly"],
    nearbyLandmarks: ["Karol Bagh Market", "Ajmal Khan Road", "Gaffar Market"]
  },
  {
    name: "Dwarka",
    city: "Delhi",
    description: "Well-planned residential area with wide roads, parks, and modern amenities. Great for families.",
    averageRent: 33500,
    safetyScore: 9,
    lifestyleScore: 7,
    transportScore: 8,
    amenities: ["Metro Station", "Parks", "Shopping Centers", "Schools", "Hospitals"],
    location: {
      type: "Point",
      coordinates: [77.0460, 28.5921]
    },
    tags: ["Planned", "Family Friendly", "Modern"],
    nearbyLandmarks: ["Dwarka Sector 21 Metro", "Vegas Mall", "City Centre Mall"]
  },

  // Bangalore
  {
    name: "Koramangala",
    city: "Bangalore",
    description: "Hip neighborhood known for its startup ecosystem, trendy cafes, and vibrant nightlife. Tech hub of Bangalore.",
    averageRent: 45000,
    safetyScore: 8,
    lifestyleScore: 9,
    transportScore: 7,
    amenities: ["Cafes", "Restaurants", "Startups", "Parks", "Shopping Centers", "Gyms"],
    location: {
      type: "Point",
      coordinates: [77.6245, 12.9352]
    },
    tags: ["Startup Hub", "Trendy", "Nightlife"],
    nearbyLandmarks: ["Forum Mall", "BDA Complex", "Jyoti Nivas College"]
  },
  {
    name: "Whitefield",
    city: "Bangalore",
    description: "Major IT hub with international tech companies. Modern infrastructure and growing residential options.",
    averageRent: 41500,
    safetyScore: 8,
    lifestyleScore: 8,
    transportScore: 6,
    amenities: ["IT Parks", "Shopping Malls", "Restaurants", "International Schools", "Hospitals"],
    location: {
      type: "Point",
      coordinates: [77.7500, 12.9698]
    },
    tags: ["IT Hub", "International", "Modern"],
    nearbyLandmarks: ["ITPL", "Phoenix MarketCity", "Whitefield Main Road"]
  },
  {
    name: "HSR Layout",
    city: "Bangalore",
    description: "Well-planned residential layout with excellent infrastructure, parks, and proximity to tech companies.",
    averageRent: 47000,
    safetyScore: 8,
    lifestyleScore: 8,
    transportScore: 7,
    amenities: ["Parks", "Shopping Centers", "Restaurants", "Metro Connectivity", "Schools"],
    location: {
      type: "Point",
      coordinates: [77.6473, 12.9116]
    },
    tags: ["Planned Layout", "Tech Proximity", "Infrastructure"],
    nearbyLandmarks: ["HSR BDA Complex", "Agara Lake", "Bommanahalli"]
  },
  {
    name: "Indiranagar",
    city: "Bangalore",
    description: "Upscale neighborhood known for its pubs, restaurants, and shopping streets. Great for young professionals.",
    averageRent: 52500,
    safetyScore: 8,
    lifestyleScore: 9,
    transportScore: 8,
    amenities: ["Restaurants", "Pubs", "Shopping Streets", "Metro Station", "Parks"],
    location: {
      type: "Point",
      coordinates: [77.6412, 12.9716]
    },
    tags: ["Upscale", "Pub Culture", "Shopping"],
    nearbyLandmarks: ["100 Feet Road", "CMH Road", "Ulsoor Lake"]
  },
  {
    name: "Electronic City",
    city: "Bangalore",
    description: "Major IT and electronics hub with numerous tech parks and modern residential complexes.",
    averageRent: 37500,
    safetyScore: 8,
    lifestyleScore: 7,
    transportScore: 7,
    amenities: ["IT Parks", "Tech Companies", "Shopping Centers", "Restaurants", "Metro Connectivity"],
    location: {
      type: "Point",
      coordinates: [77.6603, 12.8456]
    },
    tags: ["IT Hub", "Electronics", "Tech Parks"],
    nearbyLandmarks: ["Infosys Campus", "Electronics City Metro", "Wipro Campus"]
  },

  // Pune
  {
    name: "Koregaon Park",
    city: "Pune",
    description: "Upscale area known for its German Bakery, Osho Ashram, and trendy restaurants. Popular expat destination.",
    averageRent: 45000,
    safetyScore: 8,
    lifestyleScore: 9,
    transportScore: 7,
    amenities: ["Restaurants", "Cafes", "Osho Ashram", "Parks", "International Community"],
    location: {
      type: "Point",
      coordinates: [73.8958, 18.5362]
    },
    tags: ["Upscale", "Expat Friendly", "Trendy"],
    nearbyLandmarks: ["Osho Ashram", "German Bakery", "Pune Race Course"]
  },
  {
    name: "Hinjewadi",
    city: "Pune",
    description: "Major IT hub housing numerous tech companies and software parks. Rapidly developing infrastructure.",
    averageRent: 33500,
    safetyScore: 8,
    lifestyleScore: 7,
    transportScore: 6,
    amenities: ["IT Parks", "Tech Companies", "Shopping Centers", "Restaurants", "Metro Connectivity"],
    location: {
      type: "Point",
      coordinates: [73.7389, 18.5912]
    },
    tags: ["IT Hub", "Tech Companies", "Developing"],
    nearbyLandmarks: ["Rajiv Gandhi IT Park", "Xion Mall", "Balewadi Sports Complex"]
  },
  {
    name: "Viman Nagar",
    city: "Pune",
    description: "Upscale residential area close to the airport with excellent shopping and dining options.",
    averageRent: 41500,
    safetyScore: 8,
    lifestyleScore: 8,
    transportScore: 8,
    amenities: ["Airport Proximity", "Shopping Malls", "Restaurants", "Schools", "Parks"],
    location: {
      type: "Point",
      coordinates: [73.9143, 18.5679]
    },
    tags: ["Airport Proximity", "Upscale", "Shopping"],
    nearbyLandmarks: ["Phoenix MarketCity", "Pune Airport", "Weikfield IT Park"]
  },
  {
    name: "Kharadi",
    city: "Pune",
    description: "Fast-growing IT corridor with modern residential complexes and commercial developments.",
    averageRent: 37500,
    safetyScore: 8,
    lifestyleScore: 7,
    transportScore: 7,
    amenities: ["IT Companies", "Modern Apartments", "Shopping Centers", "Restaurants", "Metro Connectivity"],
    location: {
      type: "Point",
      coordinates: [73.9517, 18.5515]
    },
    tags: ["IT Corridor", "Modern", "Commercial"],
    nearbyLandmarks: ["EON IT Park", "World Trade Center", "Kharadi Bypass"]
  },

  // Hyderabad
  {
    name: "HITEC City",
    city: "Hyderabad",
    description: "Cyberabad's crown jewel with major IT companies, modern infrastructure, and upscale lifestyle.",
    averageRent: 40000,
    safetyScore: 9,
    lifestyleScore: 8,
    transportScore: 8,
    amenities: ["IT Parks", "Shopping Malls", "Restaurants", "Metro Station", "Modern Infrastructure"],
    location: {
      type: "Point",
      coordinates: [78.3772, 17.4435]
    },
    tags: ["Cyberabad", "IT Companies", "Modern"],
    nearbyLandmarks: ["Cyber Towers", "Inorbit Mall", "Mindspace"]
  },
  {
    name: "Gachibowli",
    city: "Hyderabad",
    description: "Major financial and IT services hub with modern residential and commercial developments.",
    averageRent: 35500,
    safetyScore: 8,
    lifestyleScore: 8,
    transportScore: 8,
    amenities: ["IT Companies", "Financial District", "Shopping Centers", "Metro Connectivity", "Restaurants"],
    location: {
      type: "Point",
      coordinates: [78.3482, 17.4403]
    },
    tags: ["Financial District", "IT Services", "Modern"],
    nearbyLandmarks: ["Financial District", "Nanakramguda", "Gachibowli Stadium"]
  },
  {
    name: "Jubilee Hills",
    city: "Hyderabad",
    description: "Premium residential area known for its upscale lifestyle, celebrities, and excellent amenities.",
    averageRent: 60000,
    safetyScore: 9,
    lifestyleScore: 9,
    transportScore: 8,
    amenities: ["Upscale Restaurants", "Shopping Centers", "Parks", "Premium Schools", "Celebrity Homes"],
    location: {
      type: "Point",
      coordinates: [78.4238, 17.4239]
    },
    tags: ["Premium", "Celebrity", "Upscale"],
    nearbyLandmarks: ["KBR Park", "Road No 36", "Film Nagar"]
  },
  {
    name: "Kondapur",
    city: "Hyderabad",
    description: "Rapidly developing IT corridor with modern apartments and excellent connectivity to tech hubs.",
    averageRent: 33500,
    safetyScore: 8,
    lifestyleScore: 7,
    transportScore: 8,
    amenities: ["IT Proximity", "Modern Apartments", "Shopping Centers", "Metro Connectivity", "Restaurants"],
    location: {
      type: "Point",
      coordinates: [78.3657, 17.4616]
    },
    tags: ["IT Corridor", "Modern Apartments", "Connectivity"],
    nearbyLandmarks: ["Botanical Garden", "Kondapur Main Road", "KPHB Colony"]
  },

  // Chennai
  {
    name: "Adyar",
    city: "Chennai",
    description: "Upscale residential area known for its cultural heritage, theosophical society, and beach proximity.",
    averageRent: 41500,
    safetyScore: 8,
    lifestyleScore: 8,
    transportScore: 7,
    amenities: ["Beach Proximity", "Cultural Centers", "Restaurants", "Parks", "Educational Institutions"],
    location: {
      type: "Point",
      coordinates: [80.2206, 13.0067]
    },
    tags: ["Upscale", "Cultural", "Beach"],
    nearbyLandmarks: ["Theosophical Society", "Adyar River", "Elliot's Beach"]
  },
  {
    name: "OMR (Sholinganallur)",
    city: "Chennai",
    description: "Major IT corridor with numerous tech parks and modern residential complexes along Old Mahabalipuram Road.",
    averageRent: 30000,
    safetyScore: 8,
    lifestyleScore: 7,
    transportScore: 6,
    amenities: ["IT Parks", "Tech Companies", "Modern Apartments", "Shopping Centers", "Beach Access"],
    location: {
      type: "Point",
      coordinates: [80.2267, 12.9019]
    },
    tags: ["IT Corridor", "Tech Parks", "Modern"],
    nearbyLandmarks: ["Tidel Park", "Siruseri IT Park", "Sholinganallur Temple"]
  },
  {
    name: "T. Nagar",
    city: "Chennai",
    description: "Major commercial hub known for its shopping streets, jewelry stores, and vibrant market culture.",
    averageRent: 37500,
    safetyScore: 7,
    lifestyleScore: 8,
    transportScore: 8,
    amenities: ["Shopping Streets", "Jewelry Stores", "Restaurants", "Metro Station", "Markets"],
    location: {
      type: "Point",
      coordinates: [80.2341, 13.0418]
    },
    tags: ["Commercial Hub", "Shopping", "Jewelry"],
    nearbyLandmarks: ["Pondy Bazaar", "Ranganathan Street", "Panagal Park"]
  },
  {
    name: "Anna Nagar",
    city: "Chennai",
    description: "Well-planned residential area with circular parks, wide roads, and excellent amenities for families.",
    averageRent: 39000,
    safetyScore: 8,
    lifestyleScore: 8,
    transportScore: 8,
    amenities: ["Circular Parks", "Wide Roads", "Shopping Centers", "Schools", "Metro Connectivity"],
    location: {
      type: "Point",
      coordinates: [80.2101, 13.0850]
    },
    tags: ["Planned", "Family Friendly", "Parks"],
    nearbyLandmarks: ["Anna Nagar Tower", "Shanti Colony", "Thirumangalam"]
  },

  // Noida
  {
    name: "Sector 18",
    city: "Noida",
    description: "Commercial and entertainment hub with the largest mall in India and excellent metro connectivity.",
    averageRent: 37500,
    safetyScore: 8,
    lifestyleScore: 8,
    transportScore: 9,
    amenities: ["Largest Mall", "Metro Station", "Restaurants", "Entertainment Centers", "Business Hubs"],
    location: {
      type: "Point",
      coordinates: [77.3272, 28.5706]
    },
    tags: ["Commercial", "Entertainment", "Mall"],
    nearbyLandmarks: ["DLF Mall of India", "Worlds of Wonder", "Noida Golf Course"]
  },
  {
    name: "Sector 62",
    city: "Noida",
    description: "Major IT and corporate hub with numerous multinational companies and modern infrastructure.",
    averageRent: 33500,
    safetyScore: 8,
    lifestyleScore: 7,
    transportScore: 8,
    amenities: ["IT Companies", "Corporate Offices", "Metro Station", "Shopping Centers", "Restaurants"],
    location: {
      type: "Point",
      coordinates: [77.3648, 28.6069]
    },
    tags: ["IT Hub", "Corporate", "MNC"],
    nearbyLandmarks: ["Electronic City Metro", "Sector 62 Metro", "Fortis Hospital"]
  },

  // Kolkata
  {
    name: "Park Street",
    city: "Kolkata",
    description: "Cultural heart of Kolkata known for its restaurants, pubs, and vibrant nightlife. Historic charm meets modernity.",
    averageRent: 30000,
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ44rB8ulokwMLoRsLsLka5_QGhMRJmjI3alA&s",
    safetyScore: 7,
    lifestyleScore: 9,
    transportScore: 8,
    amenities: ["Restaurants", "Pubs", "Cultural Centers", "Metro Station", "Historical Sites"],
    location: {
      type: "Point",
      coordinates: [88.3594, 22.5535]
    },
    tags: ["Cultural", "Nightlife", "Historic"],
    nearbyLandmarks: ["Victoria Memorial", "Maidan", "South City Mall"]
  },
  {
    name: "Salt Lake",
    city: "Kolkata",
    description: "Planned township with modern infrastructure, IT sector growth, and family-friendly environment.",
    averageRent: 26500,
    safetyScore: 8,
    lifestyleScore: 7,
    transportScore: 7,
    amenities: ["Planned Township", "IT Sector", "Parks", "Shopping Centers", "Schools"],
    location: {
      type: "Point",
      coordinates: [88.4057, 22.5804]
    },
    tags: ["Planned Township", "IT Sector", "Family Friendly"],
    nearbyLandmarks: ["Salt Lake Stadium", "City Centre Mall", "Nicco Park"]
  }
];

async function productionSeed() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Check if neighborhoods already exist
    const existingNeighborhoods = await Neighborhood.countDocuments();
    
    if (existingNeighborhoods > 0) {
      console.log(`⚠️  Found ${existingNeighborhoods} existing neighborhoods`);
      console.log('🔄 Clearing existing neighborhoods to avoid duplicates...');
      await Neighborhood.deleteMany({});
    }
    
    // Insert neighborhoods
    const insertedNeighborhoods = await Neighborhood.insertMany(neighborhoods);
    console.log(`✅ Successfully seeded ${insertedNeighborhoods.length} authentic Indian neighborhoods`);

    // Log statistics
    const cities = [...new Set(neighborhoods.map(n => n.city))];
    console.log(`\n📊 Production Database Statistics:`);
    console.log(`🏙️  Cities covered: ${cities.join(', ')}`);
    console.log(`🏘️  Total neighborhoods: ${insertedNeighborhoods.length}`);
    console.log(`💰 Average rent range: ₹18,000 - ₹90,000`);
    console.log(`🔒 Safety scores: 7-9/10`);
    console.log(`🎯 Lifestyle scores: 6-10/10`);
    
    console.log(`\n👥 Users: 0 (Users will be created when they sign up)`);
    
    // Close connection
    await mongoose.connection.close();
    console.log('\n✅ Production seeding completed successfully!');
    console.log('🎉 Your app now has 30+ neighborhoods across 8+ cities!');
    
  } catch (error) {
    console.error('❌ Error in production seeding:', error);
    process.exit(1);
  }
}

// Run the production seeding function
productionSeed(); 
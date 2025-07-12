const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Neighborhood = require('./models/Neighborhood');

// Load environment variables
dotenv.config();

console.log('🚀 Starting production database seeding...');
console.log('📋 This script will add neighborhoods from test data');

const neighborhoods = [
  {
    name: "Bandra West",
    city: "Mumbai",
    location: {
      type: "Point",
      coordinates: [72.8295, 19.0596]
    },
    description: "Trendy suburb known for its vibrant nightlife, upscale restaurants, and proximity to the beach. Popular among young professionals and celebrities.",
    averageRent: 65000,
    amenities: ["Metro Station", "Shopping Malls", "Restaurants", "Beach Access", "Gyms", "Cafes"],
    safetyScore: 8,
    lifestyleScore: 9,
    transportScore: 8,
    tags: ["Trendy", "Nightlife", "Beach", "Upscale"],
    nearbyLandmarks: ["Bandra-Worli Sea Link", "Carter Road", "Linking Road"],
    imageUrl: "https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcRDOTSvPNGsaRZpw-ta_rhz7bcYrqbKiTNop9Pv-sh8ajtNpI0u3E6J_zM26KDUKdQahFrHzDkB75Xgh9vONZZVi1EmAV8-_3-0PT_SvA"
  },
  {
    name: "Andheri East",
    city: "Mumbai",
    location: {
      type: "Point",
      coordinates: [72.8697, 19.1136]
    },
    description: "Major business hub with excellent connectivity. Home to many IT companies and close to the airport.",
    averageRent: 50000,
    amenities: ["Metro Station", "Airport Proximity", "Business Centers", "Shopping Malls", "Restaurants"],
    safetyScore: 7,
    lifestyleScore: 8,
    transportScore: 9,
    tags: ["Business Hub", "IT Companies", "Airport"],
    nearbyLandmarks: ["Chhatrapati Shivaji Airport", "Powai Lake", "Infinity Mall"],
    imageUrl: "https://lh3.googleusercontent.com/gps-cs-s/AC9h4nquF5-A98FR6QeW_J_L4iMLH_I0ViYt3SAGNJv5b4KEmo9Rci_Lqy7aP_aT20RQgXbim69JpevtPgOhS3E22STjPvEPEHmr0Zq8HZBX5QB18u3BVWaECIGsnpaNxlHZBXyk822wSA=w1080-h624-n-k-no"
  },
  {
    name: "Powai",
    city: "Mumbai",
    location: {
      type: "Point",
      coordinates: [72.9089, 19.1197]
    },
    description: "Planned township with beautiful lake views, excellent infrastructure, and proximity to top educational institutions.",
    averageRent: 57500,
    amenities: ["Lake View", "IIT Bombay", "Shopping Centers", "Restaurants", "Parks", "Hospitals"],
    safetyScore: 9,
    lifestyleScore: 8,
    transportScore: 7,
    tags: ["Planned Township", "Lake View", "Educational Hub"],
    nearbyLandmarks: ["Powai Lake", "IIT Bombay", "Hiranandani Gardens"],
    imageUrl: "https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcSYSZib_nq0BwM2gbH1UNb8Kfe5mC2hkZ0kOUv_DYjAgbEWO2ZoqA49dVMQKIkPbL8PLamvtP9mawdI6Q7n5OQfv9WaPHjToeQlYhUYvA"
  },
  {
    name: "Juhu",
    city: "Mumbai",
    location: {
      type: "Point",
      coordinates: [72.8264, 19.0883]
    },
    description: "Beach-side locality popular among Bollywood celebrities. Known for its vibrant street food and beach activities.",
    averageRent: 70000,
    amenities: ["Beach Access", "Street Food", "Restaurants", "Airport Proximity", "Parks"],
    safetyScore: 7,
    lifestyleScore: 9,
    transportScore: 7,
    tags: ["Beach", "Bollywood", "Street Food"],
    nearbyLandmarks: ["Juhu Beach", "ISKCON Temple", "Prithvi Theatre"],
    imageUrl: "https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcQs3GgP3Q2ezFlmHsSacJlpSgOQ4HXKlS653Wfxvi2TH86DtbNSYpeMP3ZUEuWzpO5fceYbwPh_1xQ7bulL1g4EiFWRCt65I6m-cfqAvQ"
  },
  {
    name: "Malad West",
    city: "Mumbai",
    location: {
      type: "Point",
      coordinates: [72.8493, 19.1864]
    },
    description: "Rapidly developing suburb with good connectivity and affordable housing options. Growing commercial hub.",
    averageRent: 35000,
    amenities: ["Metro Station", "Shopping Malls", "Restaurants", "Parks", "Schools"],
    safetyScore: 7,
    lifestyleScore: 7,
    transportScore: 8,
    tags: ["Affordable", "Developing", "Family Friendly"],
    nearbyLandmarks: ["Inorbit Mall", "Aksa Beach", "Goregaon Film City"],
    imageUrl: "https://lh3.googleusercontent.com/gps-cs-s/AC9h4nrzazEKo15xhqXpC6lGTJA4kjNK26dqLszDCknOGH1SZ-vsN7LjWQO6x4-660QDS0g-0udrRA5DXA-IhYJvtwh3IlEvfPHySCeZMLxZDgtAwfTgxtqkKMj8HV5YG5Gp9iaeuVI=w1080-h624-n-k-no"
  },
  {
    name: "Connaught Place",
    city: "Delhi",
    location: {
      type: "Point",
      coordinates: [77.2167, 28.6315]
    },
    description: "Historic commercial center with excellent connectivity. Hub for shopping, dining, and business activities.",
    averageRent: 60000,
    amenities: ["Metro Station", "Shopping Centers", "Restaurants", "Business Centers", "Historical Sites"],
    safetyScore: 8,
    lifestyleScore: 9,
    transportScore: 10,
    tags: ["Historic", "Commercial", "Central"],
    nearbyLandmarks: ["India Gate", "Parliament House", "Central Park"],
    imageUrl: "https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcSknCKrBD62iDDEyiYVBOzy2KVR9pkPoKB6RGEGHH-n03HZGIKAFMwZA7ExSgdonXf-nGF5ERSArk2qJcIhT5LNCJW_WMTkabXT7_XBJQ"
  },
  {
    name: "Gurgaon Sector 29",
    city: "Gurgaon",
    location: {
      type: "Point",
      coordinates: [77.0266, 28.4595]
    },
    description: "Modern business district with high-rise buildings, shopping malls, and excellent infrastructure.",
    averageRent: 52500,
    amenities: ["Metro Station", "Shopping Malls", "Restaurants", "Business Centers", "Gyms"],
    safetyScore: 8,
    lifestyleScore: 8,
    transportScore: 8,
    tags: ["Modern", "Business District", "High-rise"],
    nearbyLandmarks: ["Leisure Valley Park", "Kingdom of Dreams", "Ambience Mall"],
    imageUrl: "https://lh3.googleusercontent.com/gps-cs-s/AC9h4npYQP2q1hR2eFv9CDAbbmGXGbgdBxEaNTFlGY3s2PPZZmo17jKQf1TzqFPGzQrUG8tLDhpzgveJ9dF2vYpq4BJjnrFskMWRojgYE9SVHMEN6f_hsRW49drNCQs07gYJJp_3lgXS=w1080-h624-n-k-no"
  },
  {
    name: "Lajpat Nagar",
    city: "Delhi",
    location: {
      type: "Point",
      coordinates: [77.2430, 28.5653]
    },
    description: "Vibrant market area known for its affordable shopping and diverse food options. Great connectivity.",
    averageRent: 30000,
    amenities: ["Metro Station", "Markets", "Restaurants", "Street Food", "Parks"],
    safetyScore: 7,
    lifestyleScore: 8,
    transportScore: 9,
    tags: ["Market", "Affordable", "Food Hub"],
    nearbyLandmarks: ["Lajpat Nagar Central Market", "Defense Colony", "Khan Market"],
    imageUrl: "https://housing-images.n7net.in/d89cff98/0120e3b6cdd32176fbfbaa98f51271f4/v0/fs.jpg"
  },
  {
    name: "Karol Bagh",
    city: "Delhi",
    location: {
      type: "Point",
      coordinates: [77.1900, 28.6519]
    },
    description: "Central Delhi location with excellent shopping and dining options. Perfect for families and young professionals.",
    averageRent: 37500,
    amenities: ["Metro Station", "Shopping Centers", "Restaurants", "Markets", "Schools"],
    safetyScore: 7,
    lifestyleScore: 8,
    transportScore: 9,
    tags: ["Central", "Shopping", "Family Friendly"],
    nearbyLandmarks: ["Karol Bagh Market", "Ajmal Khan Road", "Gaffar Market"],
    imageUrl: "https://lh3.googleusercontent.com/gps-cs-s/AC9h4npAinuJ07zYLsiP2OKqaAm9-g9fDZW3oegLQifAsP7DbFUFq57ZWHaz3TmZFN7FenKzutH5Lt9o0kbVJlo9ERvIVF3-IcQ-Coq1K67lCq8Ilik52gyTxOl56N-ATB3S79in9srVqw=w1080-h624-n-k-no"
  }
];

async function productionSeed() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Check existing neighborhoods
    const existingCount = await Neighborhood.countDocuments();
    console.log(`⚠️  Found ${existingCount} existing neighborhoods`);

    // Clear existing neighborhoods
    if (existingCount > 0) {
      console.log('🔄 Clearing existing neighborhoods to avoid duplicates...');
      await Neighborhood.deleteMany({});
    }

    // Insert new neighborhoods
    await Neighborhood.insertMany(neighborhoods);
    
    const citiesCount = [...new Set(neighborhoods.map(n => n.city))].length;
    const totalNeighborhoods = neighborhoods.length;
    const rentRange = {
      min: Math.min(...neighborhoods.map(n => n.averageRent)),
      max: Math.max(...neighborhoods.map(n => n.averageRent))
    };

    console.log(`✅ Successfully seeded ${totalNeighborhoods} authentic Indian neighborhoods\n`);
    console.log('📊 Production Database Statistics:');
    console.log(`🏙️  Cities covered: ${[...new Set(neighborhoods.map(n => n.city))].join(', ')}`);
    console.log(`🏘️  Total neighborhoods: ${totalNeighborhoods}`);
    console.log(`💰 Average rent range: ₹${rentRange.min.toLocaleString()} - ₹${rentRange.max.toLocaleString()}`);
    console.log(`🔒 Safety scores: ${Math.min(...neighborhoods.map(n => n.safetyScore))}-${Math.max(...neighborhoods.map(n => n.safetyScore))}/10`);
    console.log(`🎯 Lifestyle scores: ${Math.min(...neighborhoods.map(n => n.lifestyleScore))}-${Math.max(...neighborhoods.map(n => n.lifestyleScore))}/10\n`);
    console.log('👥 Users: 0 (Users will be created when they sign up)\n');
    console.log('✅ Production seeding completed successfully!');
    console.log(`🎉 Your app now has ${totalNeighborhoods}+ neighborhoods across ${citiesCount}+ cities!`);

  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the seed function
productionSeed(); 
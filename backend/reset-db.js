const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Neighborhood = require('./models/Neighborhood');
const User = require('./models/User');

// Load environment variables
dotenv.config();

async function resetDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    // Clear all collections
    await User.deleteMany({});
    console.log('Cleared all users');
    
    await Neighborhood.deleteMany({});
    console.log('Cleared all neighborhoods');

    console.log('\n✅ Database reset completed successfully!');
    console.log('\n📋 Next Steps:');
    console.log('1. Run "npm run seed" to add authentic neighborhoods');
    console.log('2. Run "npm run seed-users" to add authentic users');
    console.log('3. Or run "npm run seed-all" to add both at once');

    // Close connection
    await mongoose.connection.close();
    console.log('\n🔗 Database connection closed');
  } catch (error) {
    console.error('Error resetting database:', error);
    process.exit(1);
  }
}

// Run the reset function
resetDatabase(); 
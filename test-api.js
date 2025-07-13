const axios = require('axios');

async function testAPI() {
  const baseURL = 'http://localhost:5001';
  
  console.log('🔍 Testing NeighborFit API...\n');
  
  try {
    // Test 1: Check neighborhoods endpoint
    console.log('1. Testing neighborhoods endpoint...');
    const neighborhoodsResponse = await axios.get(`${baseURL}/api/neighborhoods`);
    console.log(`✅ Neighborhoods: ${neighborhoodsResponse.data.length} found`);
    
    // Test 2: Check server health
    console.log('2. Testing server health...');
    const healthResponse = await axios.get(`${baseURL}/api/neighborhoods/stats/overview`);
    console.log(`✅ Server health: ${healthResponse.data.totalNeighborhoods} neighborhoods in ${healthResponse.data.totalCities} cities`);
    
    console.log('\n🎉 API is working correctly!');
    
  } catch (error) {
    console.error('❌ API Test Failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

testAPI();
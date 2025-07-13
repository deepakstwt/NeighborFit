const axios = require('axios');

const API_URL = 'http://localhost:5001/api';

async function testAPI() {
  try {
    console.log('Testing API connectivity...');
    
    // Test basic connection
    const response = await axios.get(`${API_URL}/neighborhoods`);
    console.log('✅ API Connection successful!');
    console.log(`📊 Found ${response.data.length} neighborhoods`);
    
    // Test first neighborhood
    if (response.data.length > 0) {
      const firstNeighborhood = response.data[0];
      console.log(`📍 First neighborhood: ${firstNeighborhood.name} - ${firstNeighborhood.city}`);
    }
    
    return true;
  } catch (error) {
    console.error('❌ API Connection failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

testAPI(); 
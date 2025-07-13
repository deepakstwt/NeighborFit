#!/usr/bin/env node

// Test script to verify API endpoints work
// Run: node test-vercel-api.js

const https = require('https');
const http = require('http');

const VERCEL_URL = 'https://your-app-name.vercel.app'; // Update with your actual Vercel URL
const LOCAL_URL = 'http://localhost:3000'; // For local testing

// Choose which URL to test
const API_BASE = process.argv[2] === 'local' ? LOCAL_URL : VERCEL_URL;

console.log(`🧪 Testing API endpoints at: ${API_BASE}`);

const testEndpoints = [
  '/api/neighborhoods',
  '/api/neighborhoods/1',
  '/api/neighborhoods/search/mumbai',
  '/api/neighborhoods/city/mumbai',
  '/api/neighborhoods/stats/overview',
  '/api/recommendations/personalized'
];

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    protocol.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          data: data.length > 0 ? JSON.parse(data) : null
        });
      });
    }).on('error', reject);
  });
}

async function testAPI() {
  console.log('🚀 Starting API tests...\n');
  
  for (const endpoint of testEndpoints) {
    const url = `${API_BASE}${endpoint}`;
    
    try {
      console.log(`📡 Testing: ${endpoint}`);
      const response = await makeRequest(url);
      
      if (response.status === 200) {
        const dataLength = Array.isArray(response.data) ? response.data.length : 'N/A';
        console.log(`✅ SUCCESS: Status ${response.status}, Data length: ${dataLength}`);
      } else {
        console.log(`❌ FAILED: Status ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ERROR: ${error.message}`);
    }
    
    console.log(''); // Empty line for readability
  }
  
  console.log('🎉 API tests completed!');
}

// Run the tests
testAPI().catch(console.error); 
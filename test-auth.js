/**
 * Test script for AI Learning Platform Authentication System
 * This script tests the login and registration functionality
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

// Test data
const testUser = {
    username: 'testuser',
    password: 'testpass123'
};

const demoUser = {
    username: 'demo',
    password: 'password123'
};

// Helper function to make API calls
async function apiCall(endpoint, method = 'GET', data = null) {
    try {
        const config = {
            method,
            url: `${BASE_URL}${endpoint}`,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        if (data) {
            config.data = data;
        }
        
        const response = await axios(config);
        return response.data;
    } catch (error) {
        if (error.response) {
            return error.response.data;
        }
        throw error;
    }
}

// Test functions
async function testHealthCheck() {
    console.log('\n🏥 Testing Health Check...');
    const result = await apiCall('/health');
    console.log('Health Check Result:', result);
    return result.status === 'OK';
}

async function testRegistration() {
    console.log('\n📝 Testing User Registration...');
    const result = await apiCall('/register', 'POST', testUser);
    console.log('Registration Result:', result);
    return result.success;
}

async function testLogin() {
    console.log('\n🔐 Testing User Login...');
    const result = await apiCall('/login', 'POST', testUser);
    console.log('Login Result:', result);
    return result.success;
}

async function testDemoLogin() {
    console.log('\n🎯 Testing Demo User Login...');
    const result = await apiCall('/login', 'POST', demoUser);
    console.log('Demo Login Result:', result);
    return result.success;
}

async function testGetUser() {
    console.log('\n👤 Testing Get User Info...');
    const result = await apiCall(`/user/${testUser.username}`);
    console.log('Get User Result:', result);
    return result.success;
}

async function testGetAllUsers() {
    console.log('\n📊 Testing Get All Users...');
    const result = await apiCall('/users');
    console.log('Get All Users Result:', result);
    return result.success;
}

async function testInvalidLogin() {
    console.log('\n❌ Testing Invalid Login...');
    const result = await apiCall('/login', 'POST', {
        username: 'nonexistent',
        password: 'wrongpassword'
    });
    console.log('Invalid Login Result:', result);
    return !result.success; // Should fail
}

async function testDuplicateRegistration() {
    console.log('\n🔄 Testing Duplicate Registration...');
    const result = await apiCall('/register', 'POST', testUser);
    console.log('Duplicate Registration Result:', result);
    return !result.success; // Should fail
}

// Main test runner
async function runTests() {
    console.log('🚀 Starting AI Learning Platform Authentication Tests\n');
    
    const tests = [
        { name: 'Health Check', fn: testHealthCheck },
        { name: 'User Registration', fn: testRegistration },
        { name: 'User Login', fn: testLogin },
        { name: 'Demo User Login', fn: testDemoLogin },
        { name: 'Get User Info', fn: testGetUser },
        { name: 'Get All Users', fn: testGetAllUsers },
        { name: 'Invalid Login', fn: testInvalidLogin },
        { name: 'Duplicate Registration', fn: testDuplicateRegistration }
    ];
    
    const results = [];
    
    for (const test of tests) {
        try {
            const passed = await test.fn();
            results.push({ name: test.name, passed });
            console.log(`${passed ? '✅' : '❌'} ${test.name}: ${passed ? 'PASSED' : 'FAILED'}`);
        } catch (error) {
            console.log(`❌ ${test.name}: ERROR - ${error.message}`);
            results.push({ name: test.name, passed: false });
        }
    }
    
    // Summary
    console.log('\n📊 Test Summary:');
    const passed = results.filter(r => r.passed).length;
    const total = results.length;
    
    console.log(`✅ Passed: ${passed}/${total}`);
    console.log(`❌ Failed: ${total - passed}/${total}`);
    
    if (passed === total) {
        console.log('\n🎉 All tests passed! Authentication system is working correctly.');
    } else {
        console.log('\n⚠️  Some tests failed. Please check the server and database.');
    }
    
    return passed === total;
}

// Run tests if this file is executed directly
if (require.main === module) {
    runTests().then(success => {
        process.exit(success ? 0 : 1);
    }).catch(error => {
        console.error('❌ Test runner error:', error);
        process.exit(1);
    });
}

module.exports = { runTests, apiCall };


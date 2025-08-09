#!/usr/bin/env node

/**
 * Production setup script for TradeX deployment
 * Run with: node setup-production.js
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 TradeX Production Setup\n');

// Check if all required files exist
const requiredFiles = [
    'package.json',
    'vite.config.ts',
    'render.yaml',
    '.nvmrc',
    'DEPLOYMENT.md'
];

console.log('✅ Checking deployment files...');
const missingFiles = requiredFiles.filter(file => !fs.existsSync(path.join(__dirname, file)));

if (missingFiles.length > 0) {
    console.error('❌ Missing required files:', missingFiles.join(', '));
    process.exit(1);
}

// Check package.json scripts
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredScripts = ['build', 'start'];

console.log('✅ Checking package.json scripts...');
const missingScripts = requiredScripts.filter(script => !packageJson.scripts[script]);

if (missingScripts.length > 0) {
    console.error('❌ Missing required scripts in package.json:', missingScripts.join(', '));
    process.exit(1);
}

// Check if environment example exists
if (!fs.existsSync('.env.production.example')) {
    console.warn('⚠️  .env.production.example not found (optional)');
} else {
    console.log('✅ Environment template found');
}

console.log('\n🎉 Production setup check complete!');
console.log('\n📋 Next steps for Render deployment:');
console.log('1. Push your code to GitHub');
console.log('2. Create a new Web Service on Render');
console.log('3. Use these commands:');
console.log('   📦 Build Command: npm install && npm run build');
console.log('   🚀 Start Command: npm start');
console.log('4. Set environment variables in Render dashboard');
console.log('5. Update Google OAuth redirect URIs');
console.log('\n📖 See DEPLOYMENT.md for detailed instructions');

// Display current configuration
console.log('\n🔧 Current Configuration:');
console.log(`   Name: ${packageJson.name}`);
console.log(`   Version: ${packageJson.version}`);
console.log(`   Node Version: ${fs.readFileSync('.nvmrc', 'utf8').trim()}`);
console.log(`   Build Command: ${packageJson.scripts.build}`);
console.log(`   Start Command: ${packageJson.scripts.start}`);

// Test build to ensure everything works
console.log('\n🔨 Testing build process...');
const { execSync } = require('child_process');

try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('\n✅ Build test successful!');
} catch (error) {
    console.error('\n❌ Build test failed. Please fix build errors before deployment.');
    process.exit(1);
}

console.log('\n✨ TradeX is ready for deployment!');

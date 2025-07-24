#!/usr/bin/env node

import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🔍 Checking server configuration...\n');

let hasErrors = false;

// Check for .env file
if (!fs.existsSync('.env')) {
    console.log('❌ .env file not found');
    console.log('   Create a .env file with your configuration');
    hasErrors = true;
} else {
    console.log('✅ .env file found');
}

// Check Supabase configuration
if (!process.env.SUPABASE_URL || process.env.SUPABASE_URL === 'your_supabase_url_here') {
    console.log('❌ SUPABASE_URL not configured');
    hasErrors = true;
} else {
    console.log('✅ SUPABASE_URL configured');
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY === 'your_supabase_service_role_key_here') {
    console.log('❌ SUPABASE_SERVICE_ROLE_KEY not configured');
    hasErrors = true;
} else {
    console.log('✅ SUPABASE_SERVICE_ROLE_KEY configured');
}

// Check Firebase configuration
const hasServiceAccountFile = fs.existsSync('serviceAccountKey.json');
const firebaseEnvVars = ['FIREBASE_PROJECT_ID', 'FIREBASE_PRIVATE_KEY_ID', 'FIREBASE_PRIVATE_KEY', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_CLIENT_ID'];
const hasFirebaseEnvVars = firebaseEnvVars.every(varName => process.env[varName] && process.env[varName] !== `your_firebase_${varName.toLowerCase().replace('firebase_', '')}`);

if (hasServiceAccountFile) {
    console.log('✅ Firebase serviceAccountKey.json found');
} else if (hasFirebaseEnvVars) {
    console.log('✅ Firebase environment variables configured');
} else {
    console.log('⚠️  Firebase not fully configured');
    const missingVars = firebaseEnvVars.filter(varName => !process.env[varName] || process.env[varName].startsWith('your_firebase_'));
    if (missingVars.length > 0) {
        console.log(`   Missing: ${missingVars.join(', ')}`);
    }
    console.log('   Either create serviceAccountKey.json or set Firebase environment variables');
    console.log('   Authentication may not work properly');
}

console.log('\n' + '='.repeat(50));

if (hasErrors) {
    console.log('❌ Configuration errors found. Please fix them before starting the server.');
    console.log('\nSee SETUP_INSTRUCTIONS.md for detailed setup guide.');
    process.exit(1);
} else {
    console.log('✅ Basic configuration looks good. Starting server...\n');
    
    // Import and start the server
    import('./index.js');
}
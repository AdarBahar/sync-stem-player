#!/usr/bin/env node

/**
 * Build script to create MAMP-compatible version
 * This script builds the React app and copies it to MAMP directory
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Building for MAMP...');

try {
  // Build the project
  console.log('📦 Building React application...');
  execSync('npm run build', { stdio: 'inherit' });

  // Define paths
  const distPath = path.join(__dirname, 'dist');
  const mampPath = '/Applications/MAMP/htdocs/sync-stem-player-ui/';
  
  // Check if MAMP directory exists
  if (!fs.existsSync(mampPath)) {
    console.log('📁 Creating MAMP directory...');
    fs.mkdirSync(mampPath, { recursive: true });
  }

  // Copy built files to MAMP
  console.log('📋 Copying files to MAMP...');
  execSync(`cp -r ${distPath}/* ${mampPath}`, { stdio: 'inherit' });

  // Copy demo files if they exist
  const examplesPath = path.join(__dirname, 'examples');
  if (fs.existsSync(examplesPath)) {
    console.log('🎵 Copying demo files...');
    execSync(`cp -r ${examplesPath} ${mampPath}`, { stdio: 'inherit' });

    // Ensure MP3 files are copied (in case they were excluded)
    const demoStemsPath = path.join(examplesPath, 'demo-stems');
    if (fs.existsSync(demoStemsPath)) {
      console.log('🎵 Ensuring MP3 files are copied...');
      execSync(`cp -f "${demoStemsPath}"/*.mp3 "${mampPath}/examples/demo-stems/" 2>/dev/null || true`, { stdio: 'inherit' });
    }
  }

  console.log('✅ Build complete!');
  console.log('🌐 Access your app at: http://localhost:8888/sync-stem-player-ui/');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

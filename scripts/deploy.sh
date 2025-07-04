#!/bin/bash

# Deployment script for Synchronized Stem Player
# This script builds the project and prepares it for deployment

set -e  # Exit on any error

echo "🚀 Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Error: Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version check passed: $(node -v)"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

# Run type checking
echo "🔍 Running type check..."
npm run type-check

# Run linting
echo "🧹 Running linter..."
npm run lint

# Clean previous build
echo "🧽 Cleaning previous build..."
npm run clean

# Build the project
echo "🏗️  Building project..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Error: Build failed - dist directory not found"
    exit 1
fi

echo "✅ Build completed successfully!"

# Display build info
echo ""
echo "📊 Build Information:"
echo "   Build directory: ./dist"
echo "   Files created:"
ls -la dist/

# Calculate total size
TOTAL_SIZE=$(du -sh dist/ | cut -f1)
echo "   Total size: $TOTAL_SIZE"

echo ""
echo "🎉 Deployment build ready!"
echo ""
echo "📋 Next steps:"
echo "   1. Test the build locally: npm run preview"
echo "   2. Deploy the 'dist' folder to your web server"
echo "   3. Ensure your server serves index.html for all routes (SPA)"
echo ""
echo "🌐 For static hosting (Netlify, Vercel, GitHub Pages):"
echo "   - Upload the entire 'dist' folder contents"
echo "   - Configure redirects to index.html for SPA routing"
echo ""
echo "🐳 For Docker deployment:"
echo "   - Use the provided Dockerfile"
echo "   - Run: docker build -t stem-player ."
echo "   - Run: docker run -p 8080:80 stem-player"
echo ""

# Optional: Start preview server
read -p "🚀 Start preview server now? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Starting preview server..."
    npm run preview
fi

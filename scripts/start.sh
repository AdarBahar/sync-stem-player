#!/bin/bash

# Synchronized Stem Player - Start Script

set -e

echo "🎛️ Starting Synchronized Stem Player..."

# Check if we're in the correct directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found. Please run this script from the stem-player directory."
    exit 1
fi

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to find an available port
find_available_port() {
    local port=$1
    while lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; do
        port=$((port + 1))
    done
    echo $port
}

# Default port
DEFAULT_PORT=3000

echo "🔍 Checking available options..."

# Option 1: Try Node.js with live-server (best for development)
if command_exists npm && [ -f "package.json" ]; then
    echo "📦 Found Node.js and package.json"
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        echo "📥 Installing dependencies..."
        npm install
    fi
    
    # Find available port
    PORT=$(find_available_port $DEFAULT_PORT)
    
    echo "🚀 Starting development server on port $PORT..."
    echo "📱 Opening http://localhost:$PORT"
    
    # Start the development server
    npm start -- --port=$PORT
    
# Option 2: Try Python HTTP server
elif command_exists python3; then
    PORT=$(find_available_port 8000)
    echo "🐍 Using Python 3 HTTP server on port $PORT..."
    echo "📱 Opening http://localhost:$PORT"
    
    # Try to open browser
    if command_exists open; then
        open "http://localhost:$PORT" &
    elif command_exists xdg-open; then
        xdg-open "http://localhost:$PORT" &
    elif command_exists start; then
        start "http://localhost:$PORT" &
    fi
    
    python3 -m http.server $PORT
    
elif command_exists python; then
    PORT=$(find_available_port 8000)
    echo "🐍 Using Python 2 HTTP server on port $PORT..."
    echo "📱 Opening http://localhost:$PORT"
    
    # Try to open browser
    if command_exists open; then
        open "http://localhost:$PORT" &
    elif command_exists xdg-open; then
        xdg-open "http://localhost:$PORT" &
    elif command_exists start; then
        start "http://localhost:$PORT" &
    fi
    
    python -m SimpleHTTPServer $PORT
    
# Option 3: Try PHP built-in server
elif command_exists php; then
    PORT=$(find_available_port 8000)
    echo "🐘 Using PHP built-in server on port $PORT..."
    echo "📱 Opening http://localhost:$PORT"
    
    # Try to open browser
    if command_exists open; then
        open "http://localhost:$PORT" &
    elif command_exists xdg-open; then
        xdg-open "http://localhost:$PORT" &
    elif command_exists start; then
        start "http://localhost:$PORT" &
    fi
    
    php -S localhost:$PORT
    
# Option 4: Docker
elif command_exists docker; then
    echo "🐳 Using Docker..."
    
    # Check if docker-compose is available
    if command_exists docker-compose; then
        echo "🚀 Starting with Docker Compose..."
        docker-compose up
    else
        echo "🚀 Starting with Docker..."
        PORT=$(find_available_port 8080)
        
        # Build and run container
        docker build -t stem-player .
        docker run -p $PORT:80 stem-player
        
        echo "📱 Open http://localhost:$PORT"
    fi
    
else
    echo "❌ No suitable web server found!"
    echo ""
    echo "Please install one of the following:"
    echo "  • Node.js (recommended): https://nodejs.org/"
    echo "  • Python 3: https://python.org/"
    echo "  • PHP: https://php.net/"
    echo "  • Docker: https://docker.com/"
    echo ""
    echo "Or manually serve the files using any web server."
    echo "The application files are in the current directory."
    exit 1
fi

#!/bin/bash

# Synchronized Stem Player - Build Script

set -e

echo "🔨 Building Synchronized Stem Player..."

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the stem-player directory."
    exit 1
fi

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Create build directory
BUILD_DIR="dist"
echo "📁 Creating build directory: $BUILD_DIR"
rm -rf $BUILD_DIR
mkdir -p $BUILD_DIR

# Copy HTML file
echo "📄 Copying HTML files..."
cp index.html $BUILD_DIR/

# Copy and minify CSS
echo "🎨 Processing CSS files..."
mkdir -p $BUILD_DIR/css

if command_exists npx; then
    echo "  Minifying CSS..."
    npx csso css/styles.css --output $BUILD_DIR/css/styles.min.css
    npx csso css/player.css --output $BUILD_DIR/css/player.min.css
    npx csso css/responsive.css --output $BUILD_DIR/css/responsive.min.css
    
    # Update HTML to use minified CSS
    sed -i.bak 's/css\/styles\.css/css\/styles.min.css/g' $BUILD_DIR/index.html
    sed -i.bak 's/css\/player\.css/css\/player.min.css/g' $BUILD_DIR/index.html
    sed -i.bak 's/css\/responsive\.css/css\/responsive.min.css/g' $BUILD_DIR/index.html
    rm $BUILD_DIR/index.html.bak
else
    echo "  Copying CSS files (no minification)..."
    cp css/*.css $BUILD_DIR/css/
fi

# Copy and minify JavaScript
echo "⚙️ Processing JavaScript files..."
mkdir -p $BUILD_DIR/js

if command_exists npx; then
    echo "  Minifying JavaScript..."
    npx terser js/utils.js --compress --mangle --output $BUILD_DIR/js/utils.min.js
    npx terser js/audio-engine.js --compress --mangle --output $BUILD_DIR/js/audio-engine.min.js
    npx terser js/file-manager.js --compress --mangle --output $BUILD_DIR/js/file-manager.min.js
    npx terser js/ui-controller.js --compress --mangle --output $BUILD_DIR/js/ui-controller.min.js
    npx terser js/keyboard-controller.js --compress --mangle --output $BUILD_DIR/js/keyboard-controller.min.js
    npx terser js/player.js --compress --mangle --output $BUILD_DIR/js/player.min.js
    npx terser js/app.js --compress --mangle --output $BUILD_DIR/js/app.min.js
    
    # Update HTML to use minified JS
    sed -i.bak 's/js\/utils\.js/js\/utils.min.js/g' $BUILD_DIR/index.html
    sed -i.bak 's/js\/audio-engine\.js/js\/audio-engine.min.js/g' $BUILD_DIR/index.html
    sed -i.bak 's/js\/file-manager\.js/js\/file-manager.min.js/g' $BUILD_DIR/index.html
    sed -i.bak 's/js\/ui-controller\.js/js\/ui-controller.min.js/g' $BUILD_DIR/index.html
    sed -i.bak 's/js\/keyboard-controller\.js/js\/keyboard-controller.min.js/g' $BUILD_DIR/index.html
    sed -i.bak 's/js\/player\.js/js\/player.min.js/g' $BUILD_DIR/index.html
    sed -i.bak 's/js\/app\.js/js\/app.min.js/g' $BUILD_DIR/index.html
    rm $BUILD_DIR/index.html.bak
else
    echo "  Copying JavaScript files (no minification)..."
    cp js/*.js $BUILD_DIR/js/
fi

# Copy other assets
echo "📦 Copying additional files..."
if [ -d "assets" ]; then
    cp -r assets $BUILD_DIR/
fi

if [ -f "favicon.ico" ]; then
    cp favicon.ico $BUILD_DIR/
fi

if [ -f "manifest.json" ]; then
    cp manifest.json $BUILD_DIR/
fi

# Create production nginx config
echo "🌐 Creating production nginx config..."
cat > $BUILD_DIR/nginx.conf << 'EOF'
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Security headers
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    # Cache control
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location ~* \.(mp3|wav|flac|m4a|aac|ogg)$ {
        expires 1h;
        add_header Cache-Control "public";
        add_header Access-Control-Allow-Origin "*";
    }

    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;
}
EOF

# Create Dockerfile for production
echo "🐳 Creating production Dockerfile..."
cat > $BUILD_DIR/Dockerfile << 'EOF'
FROM nginx:alpine

# Copy built files
COPY . /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Run nginx
CMD ["nginx", "-g", "daemon off;"]
EOF

# Create docker-compose for production
echo "🐳 Creating production docker-compose..."
cat > $BUILD_DIR/docker-compose.yml << 'EOF'
version: '3.8'

services:
  stem-player:
    build: .
    container_name: stem-player-prod
    ports:
      - "80:80"
    restart: unless-stopped
    
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3

networks:
  default:
    name: stem-player-network
EOF

# Generate build info
echo "📋 Generating build info..."
cat > $BUILD_DIR/build-info.json << EOF
{
  "buildTime": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "version": "1.0.0",
  "gitCommit": "$(git rev-parse HEAD 2>/dev/null || echo 'unknown')",
  "gitBranch": "$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'unknown')",
  "buildEnvironment": "production",
  "minified": $(command_exists npx && echo 'true' || echo 'false')
}
EOF

# Calculate build size
BUILD_SIZE=$(du -sh $BUILD_DIR | cut -f1)

echo ""
echo "✅ Build completed successfully!"
echo ""
echo "📊 Build Summary:"
echo "  Build directory: $BUILD_DIR"
echo "  Build size: $BUILD_SIZE"
echo "  Minified: $(command_exists npx && echo 'Yes' || echo 'No')"
echo ""
echo "🚀 Deployment Options:"
echo "  1. Static hosting: Upload contents of $BUILD_DIR to your web server"
echo "  2. Docker: cd $BUILD_DIR && docker-compose up"
echo "  3. Nginx: Use the provided nginx.conf"
echo ""
echo "🔧 Development:"
echo "  To continue development, use the source files in the root directory"
echo "  Run ./scripts/start.sh for development server"

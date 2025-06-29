# 🚀 Deployment Guide - Synchronized Stem Player

## Quick Start

### Development Server
```bash
# Make scripts executable
chmod +x scripts/*.sh

# Start development server
./scripts/start.sh
```

### Production Build
```bash
# Build for production
./scripts/build.sh

# Deploy the dist/ folder
```

## Deployment Options

### 1. 🌐 Static Web Hosting

The Stem Player is a client-side application that can be hosted on any static web server.

#### Popular Static Hosting Services:
- **Netlify**: Drag & drop the `dist/` folder
- **Vercel**: Connect your Git repository
- **GitHub Pages**: Push to `gh-pages` branch
- **AWS S3**: Upload to S3 bucket with static hosting
- **Firebase Hosting**: `firebase deploy`

#### Steps:
1. Run `./scripts/build.sh` to create production build
2. Upload contents of `dist/` folder to your hosting service
3. Configure your domain (if needed)

### 2. 🐳 Docker Deployment

#### Quick Docker Run:
```bash
# Build and run
cd dist/
docker build -t stem-player .
docker run -p 80:80 stem-player
```

#### Docker Compose:
```bash
# From dist/ directory
docker-compose up -d
```

#### Custom Docker Setup:
```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 3. 🌍 Traditional Web Server

#### Nginx Configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/stem-player/dist;
    index index.html;

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Cache static assets
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Handle audio files
    location ~* \.(mp3|wav|flac|m4a|aac|ogg)$ {
        add_header Access-Control-Allow-Origin "*";
        expires 1h;
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### Apache Configuration (.htaccess):
```apache
# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/ico "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>

# CORS for audio files
<FilesMatch "\.(mp3|wav|flac|m4a|aac|ogg)$">
    Header set Access-Control-Allow-Origin "*"
</FilesMatch>

# SPA routing
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>
```

## Environment-Specific Configurations

### Development
- Source maps enabled
- Hot reloading (with live-server)
- Detailed error messages
- Debug logging

### Production
- Minified assets
- Optimized images
- Gzip compression
- Security headers
- Error tracking

## Performance Optimization

### 1. Asset Optimization
```bash
# Minify CSS and JavaScript
npm run build

# Optimize images (if you add any)
npx imagemin images/* --out-dir=dist/images
```

### 2. CDN Integration
Consider using a CDN for faster global delivery:
- Cloudflare
- AWS CloudFront
- Google Cloud CDN
- Azure CDN

### 3. Caching Strategy
- **Static assets**: Cache for 1 year
- **HTML**: No cache (for updates)
- **Audio files**: Cache for 1 hour
- **API responses**: Cache appropriately

## Security Considerations

### 1. Content Security Policy (CSP)
```html
<meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    script-src 'self' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    media-src 'self' blob: data:;
    connect-src 'self';
    font-src 'self';
    img-src 'self' data:;
">
```

### 2. Security Headers
```nginx
add_header X-Content-Type-Options nosniff;
add_header X-Frame-Options DENY;
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";
add_header Permissions-Policy "microphone=(), camera=(), geolocation=()";
```

### 3. HTTPS Configuration
Always use HTTPS in production:
```nginx
server {
    listen 443 ssl http2;
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    # ... rest of config
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    return 301 https://$server_name$request_uri;
}
```

## Monitoring and Analytics

### 1. Error Tracking
Integrate with error tracking services:
- Sentry
- Rollbar
- Bugsnag

### 2. Performance Monitoring
- Google Analytics
- Google PageSpeed Insights
- Web Vitals

### 3. Uptime Monitoring
- Pingdom
- UptimeRobot
- StatusCake

## Troubleshooting

### Common Issues

1. **CORS Errors with Audio Files**
   - Ensure proper CORS headers
   - Check server configuration
   - Verify file permissions

2. **Files Not Loading**
   - Check file paths in HTML
   - Verify server configuration
   - Check browser console for errors

3. **Performance Issues**
   - Enable gzip compression
   - Optimize audio file sizes
   - Use appropriate caching headers

4. **Mobile Compatibility**
   - Test on various devices
   - Check touch interactions
   - Verify responsive design

### Debug Mode
Enable debug mode by adding `?debug=true` to the URL:
```
https://your-domain.com/?debug=true
```

## Scaling Considerations

### High Traffic
- Use a CDN
- Implement proper caching
- Consider load balancing
- Monitor server resources

### Large Audio Files
- Implement progressive loading
- Consider audio compression
- Use appropriate formats
- Implement chunked uploads

## Backup and Recovery

### Regular Backups
- Source code (Git repository)
- Configuration files
- SSL certificates
- User data (if any)

### Disaster Recovery
- Document deployment process
- Maintain staging environment
- Test backup restoration
- Monitor service health

## Updates and Maintenance

### Deployment Pipeline
1. Development → Testing
2. Testing → Staging
3. Staging → Production

### Version Management
- Use semantic versioning
- Tag releases in Git
- Maintain changelog
- Test before deployment

### Monitoring
- Set up alerts for downtime
- Monitor performance metrics
- Track error rates
- Review logs regularly

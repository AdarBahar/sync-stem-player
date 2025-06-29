#!/usr/bin/env node

/**
 * Production Build Script for Stem Player
 * Minifies CSS and JavaScript files for production deployment
 */

const fs = require('fs');
const path = require('path');

// Simple minification functions (for basic optimization)
function minifyCSS(css) {
    return css
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
        .replace(/\s+/g, ' ') // Collapse whitespace
        .replace(/;\s*}/g, '}') // Remove unnecessary semicolons
        .replace(/\s*{\s*/g, '{') // Clean braces
        .replace(/\s*}\s*/g, '}')
        .replace(/\s*;\s*/g, ';') // Clean semicolons
        .replace(/\s*,\s*/g, ',') // Clean commas
        .replace(/\s*:\s*/g, ':') // Clean colons
        .trim();
}

function minifyJS(js) {
    return js
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
        .replace(/\/\/.*$/gm, '') // Remove line comments
        .replace(/\s+/g, ' ') // Collapse whitespace
        .replace(/;\s*}/g, '}') // Clean up
        .replace(/\s*{\s*/g, '{')
        .replace(/\s*}\s*/g, '}')
        .replace(/\s*;\s*/g, ';')
        .replace(/\s*,\s*/g, ',')
        .replace(/\s*:\s*/g, ':')
        .replace(/\s*=\s*/g, '=')
        .replace(/\s*\+\s*/g, '+')
        .replace(/\s*-\s*/g, '-')
        .replace(/\s*\*\s*/g, '*')
        .replace(/\s*\/\s*/g, '/')
        .trim();
}

function createProductionHTML(htmlContent) {
    // Update script and CSS references to minified versions
    return htmlContent
        .replace(/href="css\/styles\.css"/g, 'href="css/styles.min.css"')
        .replace(/href="css\/player\.css"/g, 'href="css/player.min.css"')
        .replace(/href="css\/responsive\.css"/g, 'href="css/responsive.min.css"')
        .replace(/src="js\/utils\.js"/g, 'src="js/app.min.js"')
        .replace(/src="js\/audio-engine\.js"/g, '')
        .replace(/src="js\/file-manager\.js"/g, '')
        .replace(/src="js\/ui-controller\.js"/g, '')
        .replace(/src="js\/keyboard-controller\.js"/g, '')
        .replace(/src="js\/player\.js"/g, '')
        .replace(/src="js\/app\.js"/g, '')
        .replace(/<!-- Scripts -->[\s\S]*?<\/body>/, 
            '<!-- Scripts -->\n    <script src="js/app.min.js"></script>\n</body>');
}

function buildProduction() {
    console.log('🏗️  Building production version...');
    
    const distDir = path.join(__dirname, 'dist');
    
    // Create dist directory
    if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
    }
    
    // Create subdirectories
    ['css', 'js'].forEach(dir => {
        const dirPath = path.join(distDir, dir);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    });
    
    // Minify CSS files
    console.log('📦 Minifying CSS...');
    const cssFiles = ['styles.css', 'player.css', 'responsive.css'];
    cssFiles.forEach(file => {
        const cssPath = path.join(__dirname, 'css', file);
        const css = fs.readFileSync(cssPath, 'utf8');
        const minified = minifyCSS(css);
        const outputPath = path.join(distDir, 'css', file.replace('.css', '.min.css'));
        fs.writeFileSync(outputPath, minified);
        console.log(`  ✓ ${file} -> ${file.replace('.css', '.min.css')}`);
    });
    
    // Combine and minify JavaScript files
    console.log('📦 Combining and minifying JavaScript...');
    const jsFiles = [
        'utils.js',
        'audio-engine.js', 
        'file-manager.js',
        'ui-controller.js',
        'keyboard-controller.js',
        'player.js',
        'app.js'
    ];
    
    let combinedJS = '';
    jsFiles.forEach(file => {
        const jsPath = path.join(__dirname, 'js', file);
        const js = fs.readFileSync(jsPath, 'utf8');
        combinedJS += js + '\n';
        console.log(`  ✓ Added ${file}`);
    });
    
    const minifiedJS = minifyJS(combinedJS);
    const jsOutputPath = path.join(distDir, 'js', 'app.min.js');
    fs.writeFileSync(jsOutputPath, minifiedJS);
    console.log(`  ✓ Combined into app.min.js`);
    
    // Process HTML
    console.log('📦 Processing HTML...');
    const htmlPath = path.join(__dirname, 'index.html');
    const html = fs.readFileSync(htmlPath, 'utf8');
    const productionHTML = createProductionHTML(html);
    const htmlOutputPath = path.join(distDir, 'index.html');
    fs.writeFileSync(htmlOutputPath, productionHTML);
    console.log('  ✓ index.html -> dist/index.html');
    
    // Copy other necessary files
    console.log('📦 Copying additional files...');
    const filesToCopy = [
        'README.md',
        'USAGE.md',
        'DEPLOYMENT.md',
        'nginx.conf',
        'docker-compose.yml',
        'Dockerfile'
    ];
    
    filesToCopy.forEach(file => {
        const srcPath = path.join(__dirname, file);
        if (fs.existsSync(srcPath)) {
            const destPath = path.join(distDir, file);
            fs.copyFileSync(srcPath, destPath);
            console.log(`  ✓ ${file}`);
        }
    });
    
    // Copy examples directory if it exists
    const examplesDir = path.join(__dirname, 'examples');
    if (fs.existsSync(examplesDir)) {
        const destExamplesDir = path.join(distDir, 'examples');
        fs.mkdirSync(destExamplesDir, { recursive: true });
        
        function copyDir(src, dest) {
            const entries = fs.readdirSync(src, { withFileTypes: true });
            for (const entry of entries) {
                const srcPath = path.join(src, entry.name);
                const destPath = path.join(dest, entry.name);
                if (entry.isDirectory()) {
                    fs.mkdirSync(destPath, { recursive: true });
                    copyDir(srcPath, destPath);
                } else {
                    fs.copyFileSync(srcPath, destPath);
                }
            }
        }
        
        copyDir(examplesDir, destExamplesDir);
        console.log('  ✓ examples/');
    }
    
    console.log('✅ Production build complete!');
    console.log(`📁 Output directory: ${distDir}`);
    
    // Calculate file sizes
    const stats = {
        'CSS (minified)': 0,
        'JS (minified)': fs.statSync(jsOutputPath).size,
        'HTML': fs.statSync(htmlOutputPath).size
    };
    
    cssFiles.forEach(file => {
        const minPath = path.join(distDir, 'css', file.replace('.css', '.min.css'));
        stats['CSS (minified)'] += fs.statSync(minPath).size;
    });
    
    console.log('\n📊 Build Statistics:');
    Object.entries(stats).forEach(([type, size]) => {
        console.log(`  ${type}: ${(size / 1024).toFixed(1)} KB`);
    });
    
    console.log('\n🚀 Ready for production deployment!');
    console.log('   Deploy the contents of the "dist" directory to your web server.');
}

// Run build if called directly
if (require.main === module) {
    buildProduction();
}

module.exports = { buildProduction };

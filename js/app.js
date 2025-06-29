/**
 * Application Entry Point
 * Initializes the Stem Player application
 */

// Global application instance
let stemPlayerApp = null;

// Application initialization
document.addEventListener('DOMContentLoaded', () => {
    initializeApplication();
});

async function initializeApplication() {
    try {
        console.log('🎛️ Initializing Synchronized Stem Player...');
        
        // Check browser compatibility
        const support = Utils.checkBrowserSupport();
        
        if (!support.webAudio) {
            showCompatibilityError('Web Audio API is not supported in this browser. Please use a modern browser like Chrome, Firefox, Safari, or Edge.');
            return;
        }
        
        if (!support.fileAPI) {
            showCompatibilityError('File API is not supported in this browser. Please use a modern browser.');
            return;
        }
        
        // Initialize the main application
        stemPlayerApp = new StemPlayer();
        
        // Setup global error handling
        setupGlobalErrorHandling();
        
        // Setup performance monitoring
        setupPerformanceMonitoring();
        
        // Setup service worker (if available) - DISABLED for local development
        // setupServiceWorker();
        
        console.log('✅ Stem Player initialized successfully');
        
    } catch (error) {
        console.error('❌ Failed to initialize Stem Player:', error);
        showInitializationError(error);
    }
}

function showCompatibilityError(message) {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.innerHTML = `
            <div class="loading-content">
                <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
                <h2>Browser Not Supported</h2>
                <p style="max-width: 500px; text-align: center; line-height: 1.6;">${message}</p>
                <div style="margin-top: 2rem;">
                    <h3>Recommended Browsers:</h3>
                    <ul style="text-align: left; display: inline-block;">
                        <li>Google Chrome 60+</li>
                        <li>Mozilla Firefox 55+</li>
                        <li>Safari 11+</li>
                        <li>Microsoft Edge 79+</li>
                    </ul>
                </div>
            </div>
        `;
    }
}

function showInitializationError(error) {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.innerHTML = `
            <div class="loading-content">
                <div style="font-size: 3rem; margin-bottom: 1rem;">❌</div>
                <h2>Initialization Error</h2>
                <p>Failed to start the Stem Player application.</p>
                <details style="margin-top: 1rem; text-align: left;">
                    <summary>Error Details</summary>
                    <pre style="background: #333; padding: 1rem; border-radius: 4px; overflow: auto; max-width: 500px;">${error.message}</pre>
                </details>
                <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Reload Page
                </button>
            </div>
        `;
    }
}

function setupGlobalErrorHandling() {
    // Handle uncaught JavaScript errors
    window.addEventListener('error', (event) => {
        const error = event.error || new Error(event.message);
        Utils.logError(error, 'Global Error', {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            stack: error.stack
        });

        // Don't show error UI for minor errors
        if (!isMinorError(error)) {
            if (stemPlayerApp && stemPlayerApp.uiController) {
                stemPlayerApp.uiController.showError(
                    'An unexpected error occurred. Please refresh the page if issues persist.',
                    'Application Error'
                );
            }
        }
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        const reason = event.reason || new Error('Unknown promise rejection');
        Utils.logError(reason, 'Unhandled Promise Rejection');

        // Don't show error UI for network errors or minor issues
        if (!isMinorError(reason)) {
            if (stemPlayerApp && stemPlayerApp.uiController) {
                stemPlayerApp.uiController.showError(
                    'An unexpected error occurred during an operation. Please try again.',
                    'Operation Failed'
                );
            }
        }

        // Prevent the default browser behavior
        event.preventDefault();
    });

    // Handle resource loading errors
    window.addEventListener('error', (event) => {
        if (event.target !== window) {
            Utils.logError(new Error(`Resource failed to load: ${event.target.src || event.target.href}`), 'Resource Error');
        }
    }, true);
}

function isMinorError(error) {
    if (!error) return true;

    const message = error.message || error.toString();
    const minorPatterns = [
        /network/i,
        /fetch/i,
        /cors/i,
        /loading/i,
        /timeout/i
    ];

    return minorPatterns.some(pattern => pattern.test(message));
}

function setupPerformanceMonitoring() {
    // Monitor performance metrics
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    console.log('📊 Performance Metrics:');
                    console.log(`  DOM Content Loaded: ${perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart}ms`);
                    console.log(`  Page Load: ${perfData.loadEventEnd - perfData.loadEventStart}ms`);
                    console.log(`  Total Load Time: ${perfData.loadEventEnd - perfData.fetchStart}ms`);
                }
            }, 0);
        });
    }
    
    // Monitor memory usage (if available)
    if ('memory' in performance) {
        setInterval(() => {
            const memory = performance.memory;
            if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
                console.warn('⚠️ High memory usage detected:', {
                    used: Math.round(memory.usedJSHeapSize / 1024 / 1024) + 'MB',
                    limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024) + 'MB'
                });
            }
        }, 30000); // Check every 30 seconds
    }
}

function setupServiceWorker() {
    // Register service worker for offline functionality (optional)
    // DISABLED: Service worker not needed for local development
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('📱 Service Worker registered:', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    }
}

// Global utility functions for external access
window.StemPlayerAPI = {
    // Get the main application instance
    getInstance() {
        return stemPlayerApp;
    },
    
    // Load files programmatically
    async loadFiles(files) {
        if (stemPlayerApp) {
            return await stemPlayerApp.loadStemFiles(files);
        }
        throw new Error('Stem Player not initialized');
    },
    
    // Playback controls
    play() {
        if (stemPlayerApp) {
            return stemPlayerApp.play();
        }
    },
    
    pause() {
        if (stemPlayerApp) {
            stemPlayerApp.pause();
        }
    },
    
    stop() {
        if (stemPlayerApp) {
            stemPlayerApp.stop();
        }
    },
    
    togglePlayPause() {
        if (stemPlayerApp) {
            return stemPlayerApp.togglePlayPause();
        }
    },
    
    seekTo(time) {
        if (stemPlayerApp) {
            stemPlayerApp.seekTo(time);
        }
    },
    
    // State getters
    getCurrentTime() {
        return stemPlayerApp ? stemPlayerApp.getCurrentTime() : 0;
    },
    
    getDuration() {
        return stemPlayerApp ? stemPlayerApp.getDuration() : 0;
    },
    
    isPlaying() {
        return stemPlayerApp ? stemPlayerApp.isPlaying() : false;
    },
    
    getLoadedStems() {
        return stemPlayerApp ? stemPlayerApp.getLoadedStems() : [];
    },
    
    // Volume controls
    setMasterVolume(volume) {
        if (stemPlayerApp && stemPlayerApp.audioEngine) {
            stemPlayerApp.audioEngine.setMasterVolume(volume);
        }
    },
    
    setStemVolume(stemId, volume) {
        if (stemPlayerApp && stemPlayerApp.audioEngine) {
            stemPlayerApp.audioEngine.setStemVolume(stemId, volume);
        }
    },
    
    muteStem(stemId, muted = true) {
        if (stemPlayerApp && stemPlayerApp.audioEngine) {
            stemPlayerApp.audioEngine.muteStem(stemId, muted);
        }
    },
    
    soloStem(stemId, solo = true) {
        if (stemPlayerApp && stemPlayerApp.audioEngine) {
            stemPlayerApp.audioEngine.soloStem(stemId, solo);
        }
    },
    
    // UI controls
    showUploadSection() {
        if (stemPlayerApp && stemPlayerApp.uiController) {
            stemPlayerApp.uiController.showUploadSection();
        }
    },
    
    showPlayerSection() {
        if (stemPlayerApp && stemPlayerApp.uiController) {
            stemPlayerApp.uiController.showPlayerSection();
        }
    },
    
    toggleTheme() {
        if (stemPlayerApp && stemPlayerApp.uiController) {
            stemPlayerApp.uiController.toggleTheme();
        }
    },
    
    toggleFullscreen() {
        if (stemPlayerApp && stemPlayerApp.uiController) {
            stemPlayerApp.uiController.toggleFullscreen();
        }
    },
    
    // Event system
    addEventListener(eventName, handler) {
        document.addEventListener(eventName, handler);
    },
    
    removeEventListener(eventName, handler) {
        document.removeEventListener(eventName, handler);
    },
    
    // Utility access
    utils: Utils
};

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (stemPlayerApp) {
        stemPlayerApp.destroy();
    }
});

// Development helpers (only in development)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.dev = {
        player: () => stemPlayerApp,
        utils: Utils,
        loadTestFiles: async () => {
            // Helper function to load test files
            console.log('Use the file input to load test files');
        },
        logState: () => {
            if (stemPlayerApp) {
                console.log('Current state:', {
                    isPlaying: stemPlayerApp.isPlaying(),
                    currentTime: stemPlayerApp.getCurrentTime(),
                    duration: stemPlayerApp.getDuration(),
                    loadedStems: stemPlayerApp.getLoadedStems().length
                });
            }
        }
    };
    
    console.log('🔧 Development mode enabled. Use window.dev for debugging helpers.');
}

console.log('🎛️ Stem Player application script loaded');

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StemPlayerAPI };
}

// Add after DOMContentLoaded or main app initialization

document.addEventListener('DOMContentLoaded', () => {
    const playDemoBtn = document.getElementById('play-demo-btn');
    const stems = [
        'Led Zeppelin - Ramble On - bass.mp3',
        'Led Zeppelin - Ramble On - drums.mp3',
        'Led Zeppelin - Ramble On - other.mp3',
        'Led Zeppelin - Ramble On - vocals.mp3'
    ];
    const demoPath = 'examples/demo-stems/';

    // Hide Play Demo if files are loaded
    function updatePlayDemoVisibility() {
        const playerSection = document.getElementById('player-section');
        if (playerSection && playerSection.style.display !== 'none') {
            playDemoBtn.style.display = 'none';
        } else {
            playDemoBtn.style.display = '';
        }
    }
    updatePlayDemoVisibility();
    // Listen for player section visibility changes
    const observer = new MutationObserver(updatePlayDemoVisibility);
    observer.observe(document.getElementById('player-section'), { attributes: true, attributeFilter: ['style'] });

    playDemoBtn.addEventListener('click', async () => {
        playDemoBtn.disabled = true;
        playDemoBtn.textContent = 'Loading...';
        try {
            // Fetch all stems as blobs
            const files = await Promise.all(stems.map(async (name) => {
                const response = await fetch(demoPath + encodeURIComponent(name));
                if (!response.ok) throw new Error('Failed to load ' + name);
                const blob = await response.blob();
                // Create a File object for compatibility
                return new File([blob], name, { type: blob.type });
            }));
            // Use the public API to load files
            if (window.StemPlayerAPI && window.StemPlayerAPI.loadFiles) {
                await window.StemPlayerAPI.loadFiles(files);
            } else {
                alert('Player not initialized');
            }
        } catch (err) {
            alert('Error loading demo: ' + err.message);
        } finally {
            playDemoBtn.disabled = false;
            playDemoBtn.textContent = 'Play Demo';
        }
    });
});

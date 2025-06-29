/**
 * Main Player Controller - Orchestrates all components
 */

class StemPlayer {
    constructor() {
        this.audioEngine = null;
        this.fileManager = null;
        this.uiController = null;
        this.keyboardController = null;
        
        this.isInitialized = false;
        this.loadedStems = new Map();
        this.playbackState = {
            isPlaying: false,
            currentTime: 0,
            duration: 0,
            loop: false
        };
        
        this.initialize();
    }
    
    async initialize() {
        try {
            // Check browser support
            const support = Utils.checkBrowserSupport();
            if (!support.webAudio) {
                throw new Error('Web Audio API is not supported in this browser');
            }
            
            // Initialize components
            this.audioEngine = new AudioEngine();
            this.fileManager = new FileManager();
            this.uiController = new UIController();
            this.keyboardController = new KeyboardController();
            
            // Setup component callbacks
            this.setupAudioEngineCallbacks();
            this.setupFileManagerCallbacks();
            this.setupEventListeners();
            
            // Initialize UI state
            this.uiController.showUploadSection();
            this.uiController.updateStatus('Ready to load stems');
            
            this.isInitialized = true;
            
            // Hide loading screen
            setTimeout(() => {
                this.uiController.hideLoadingScreen();
            }, 1000);
            
        } catch (error) {
            Utils.logError(error, 'StemPlayer initialization');
            this.handleError(error);
        }
    }
    
    setupAudioEngineCallbacks() {
        this.audioEngine.onTimeUpdate = (currentTime) => {
            this.playbackState.currentTime = currentTime;
            this.uiController.updateTimeDisplay(currentTime, this.playbackState.duration);
            this.uiController.updateProgressBar(currentTime, this.playbackState.duration);
            
            // Update individual stem progress
            this.loadedStems.forEach((stem, id) => {
                this.uiController.updateStemProgress(id, currentTime, this.playbackState.duration);
            });
        };
        
        this.audioEngine.onPlayStateChange = (isPlaying) => {
            this.playbackState.isPlaying = isPlaying;
            this.uiController.updatePlayPauseButton(isPlaying);
            this.uiController.updateStatus(isPlaying ? 'Playing' : 'Paused');
        };
        
        this.audioEngine.onError = (error) => {
            this.handleError(error);
        };
    }
    
    setupFileManagerCallbacks() {
        this.fileManager.onFilesLoaded = async (files) => {
            await this.loadFiles(files);
        };
        
        this.fileManager.onError = (error) => {
            this.uiController.showError(error);
        };
    }
    
    setupEventListeners() {
        // Player controls
        this.uiController.playPauseBtn.addEventListener('click', () => {
            this.togglePlayPause();
        });
        
        this.uiController.stopBtn.addEventListener('click', () => {
            this.stop();
        });
        
        // Master volume
        this.uiController.masterVolumeSlider.addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            this.audioEngine.setMasterVolume(volume);
        });
        
        // Seek events
        document.addEventListener('seek', (e) => {
            const { percentage } = e.detail;
            const time = percentage * this.playbackState.duration;
            this.seekTo(time);
        });
        
        // Stem control events
        document.addEventListener('stem-volume', (e) => {
            const { stemId, volume } = e.detail;
            this.audioEngine.setStemVolume(stemId, volume);
        });
        
        document.addEventListener('stem-mute', (e) => {
            const { stemId } = e.detail;
            this.toggleStemMute(stemId);
        });
        
        document.addEventListener('stem-solo', (e) => {
            const { stemId } = e.detail;
            this.toggleStemSolo(stemId);
        });
        
        // Keyboard events
        this.setupKeyboardEventListeners();
    }
    
    setupKeyboardEventListeners() {
        document.addEventListener('keyboard-play-pause', () => {
            this.togglePlayPause();
        });
        
        document.addEventListener('keyboard-stop', () => {
            this.stop();
        });
        
        document.addEventListener('keyboard-seek', (e) => {
            const { direction } = e.detail;
            const newTime = this.playbackState.currentTime + direction;
            this.seekTo(newTime);
        });
        
        document.addEventListener('keyboard-volume-preset', (e) => {
            const { volume } = e.detail;
            this.uiController.masterVolumeSlider.value = volume;
            this.audioEngine.setMasterVolume(volume / 100);
            this.uiController.updateMasterVolumeDisplay(volume);
        });
        
        document.addEventListener('keyboard-mute-focused', () => {
            if (this.uiController.focusedStem) {
                this.toggleStemMute(this.uiController.focusedStem);
            }
        });
        
        document.addEventListener('keyboard-solo-focused', () => {
            if (this.uiController.focusedStem) {
                this.toggleStemSolo(this.uiController.focusedStem);
            }
        });
        
        document.addEventListener('keyboard-fullscreen', () => {
            this.uiController.toggleFullscreen();
        });
        
        document.addEventListener('keyboard-help', () => {
            this.uiController.showHelp();
        });
        
        document.addEventListener('keyboard-theme', () => {
            this.uiController.toggleTheme();
        });
        
        document.addEventListener('keyboard-view', (e) => {
            const { mode } = e.detail;
            this.uiController.setViewMode(mode);
        });
        
        document.addEventListener('keyboard-master-volume', (e) => {
            const { direction } = e.detail;
            const currentVolume = parseInt(this.uiController.masterVolumeSlider.value);
            const newVolume = Utils.clamp(currentVolume + (direction * 5), 0, 100);
            
            this.uiController.masterVolumeSlider.value = newVolume;
            this.audioEngine.setMasterVolume(newVolume / 100);
            this.uiController.updateMasterVolumeDisplay(newVolume);
        });
        
        document.addEventListener('keyboard-escape', () => {
            this.uiController.hideHelp();
        });
    }
    
    async loadFiles(files) {
        try {
            this.uiController.updateStatus('Loading audio files...');
            this.uiController.clearStems();
            
            // Load each file
            for (const fileInfo of files) {
                try {
                    const stem = await this.audioEngine.loadStem(fileInfo.id, fileInfo.file);
                    this.loadedStems.set(fileInfo.id, {
                        ...stem,
                        name: fileInfo.name
                    });
                    
                    // Create UI for this stem
                    const stemElement = this.uiController.createStemControl({
                        id: fileInfo.id,
                        name: fileInfo.name,
                        file: fileInfo.file
                    });
                    this.uiController.stemsContainer.appendChild(stemElement);
                    
                } catch (error) {
                    Utils.logError(error, `Loading file ${fileInfo.name}`);
                    this.uiController.showError(`Failed to load ${fileInfo.name}: ${error.message}`);
                }
            }
            
            // Update duration
            this.playbackState.duration = this.audioEngine.duration;
            this.uiController.updateTimeDisplay(0, this.playbackState.duration);
            
            // Show player section
            if (this.loadedStems.size > 0) {
                this.uiController.showPlayerSection();
                this.uiController.updateStatus(`Loaded ${this.loadedStems.size} stems`);
                this.uiController.updateAudioIndicator(true);
            } else {
                this.uiController.updateStatus('No valid audio files loaded');
            }
            
        } catch (error) {
            Utils.logError(error, 'Loading files');
            this.handleError(error);
        }
    }
    
    async togglePlayPause() {
        try {
            if (this.playbackState.isPlaying) {
                this.audioEngine.pause();
            } else {
                await this.audioEngine.play();
            }
        } catch (error) {
            this.handleError(error);
        }
    }
    
    stop() {
        try {
            this.audioEngine.stop();
            this.playbackState.currentTime = 0;
            this.uiController.updateTimeDisplay(0, this.playbackState.duration);
            this.uiController.updateProgressBar(0, this.playbackState.duration);
        } catch (error) {
            this.handleError(error);
        }
    }
    
    seekTo(time) {
        try {
            this.audioEngine.seekTo(time);
        } catch (error) {
            this.handleError(error);
        }
    }
    
    toggleStemMute(stemId) {
        const stem = this.audioEngine.getStem(stemId);
        if (stem) {
            const newMutedState = !stem.muted;
            this.audioEngine.muteStem(stemId, newMutedState);
            this.uiController.updateStemMuteState(stemId, newMutedState);
        }
    }
    
    toggleStemSolo(stemId) {
        const stem = this.audioEngine.getStem(stemId);
        if (stem) {
            const newSoloState = !stem.solo;
            this.audioEngine.soloStem(stemId, newSoloState);
            this.uiController.updateStemSoloState(stemId, newSoloState);
            
            // Update other stems' solo state in UI
            this.loadedStems.forEach((_, id) => {
                if (id !== stemId) {
                    this.uiController.updateStemSoloState(id, false);
                }
            });
        }
    }
    
    handleError(error) {
        Utils.logError(error, 'StemPlayer');
        this.uiController.showError(error.message || 'An unexpected error occurred');
        this.uiController.updateStatus('Error occurred');
    }
    
    // Public API methods
    loadStemFiles(files) {
        const fileInfos = files.map((file, index) => ({
            file,
            id: this.fileManager.generateFileId(file, index),
            name: this.fileManager.cleanFileName(file.name)
        }));
        
        return this.loadFiles(fileInfos);
    }
    
    play() {
        return this.audioEngine.play();
    }
    
    pause() {
        this.audioEngine.pause();
    }
    
    getCurrentTime() {
        return this.playbackState.currentTime;
    }
    
    getDuration() {
        return this.playbackState.duration;
    }
    
    isPlaying() {
        return this.playbackState.isPlaying;
    }
    
    getLoadedStems() {
        return Array.from(this.loadedStems.values());
    }
    
    // Cleanup
    destroy() {
        if (this.audioEngine) {
            this.audioEngine.destroy();
        }
        
        this.loadedStems.clear();
        this.isInitialized = false;
    }
}

// Make StemPlayer available globally
window.StemPlayer = StemPlayer;

/**
 * UI Controller for managing the user interface
 */

class UIController {
    constructor() {
        this.currentTheme = 'dark';
        this.isFullscreen = false;
        this.viewMode = 'expanded'; // 'compact' or 'expanded'
        this.focusedStem = null;
        
        this.initializeElements();
        this.setupEventListeners();
        this.loadSettings();
    }
    
    initializeElements() {
        // Header elements
        this.themeToggle = document.getElementById('theme-toggle');
        this.fullscreenToggle = document.getElementById('fullscreen-toggle');
        this.helpToggle = document.getElementById('help-toggle');
        
        // Section elements
        this.uploadSection = document.getElementById('upload-section');
        this.playerSection = document.getElementById('player-section');
        
        // Player elements
        this.playPauseBtn = document.getElementById('play-pause-btn');
        this.stopBtn = document.getElementById('stop-btn');
        this.currentTimeDisplay = document.getElementById('current-time');
        this.totalTimeDisplay = document.getElementById('total-time');
        this.masterVolumeSlider = document.getElementById('master-volume');
        this.masterVolumeValue = document.getElementById('master-volume-value');
        this.masterProgress = document.getElementById('master-progress');
        this.masterProgressFill = document.getElementById('master-progress-fill');
        this.masterProgressHandle = document.getElementById('master-progress-handle');
        
        // Stems container
        this.stemsContainer = document.getElementById('stems-container');
        
        // Options (removed - no longer needed)
        // this.loopPlayback = document.getElementById('loop-playback');
        // this.autoSync = document.getElementById('auto-sync');
        // this.compactViewBtn = document.getElementById('compact-view');
        // this.expandedViewBtn = document.getElementById('expanded-view');
        
        // Modal elements
        this.helpModal = document.getElementById('help-modal');
        this.closeHelpBtn = document.getElementById('close-help');
        
        // Status elements
        this.statusText = document.getElementById('status-text');
        this.syncIndicator = document.getElementById('sync-indicator');
        this.audioIndicator = document.getElementById('audio-indicator');
        
        // Loading screen
        this.loadingScreen = document.getElementById('loading-screen');
        this.app = document.getElementById('app');
    }
    
    setupEventListeners() {
        // Theme toggle
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Fullscreen toggle
        this.fullscreenToggle.addEventListener('click', () => {
            this.toggleFullscreen();
        });
        
        // Help toggle
        this.helpToggle.addEventListener('click', () => {
            this.showHelp();
        });
        
        this.closeHelpBtn.addEventListener('click', () => {
            this.hideHelp();
        });
        
        // Master volume
        this.masterVolumeSlider.addEventListener('input', (e) => {
            this.updateMasterVolumeDisplay(e.target.value);
        });
        
        // Master progress bar
        this.masterProgress.addEventListener('click', (e) => {
            this.handleProgressClick(e);
        });
        
        // View mode buttons (removed - no longer needed)
        // this.compactViewBtn.addEventListener('click', () => {
        //     this.setViewMode('compact');
        // });
        //
        // this.expandedViewBtn.addEventListener('click', () => {
        //     this.setViewMode('expanded');
        // });
        
        // Modal close on background click
        this.helpModal.addEventListener('click', (e) => {
            if (e.target === this.helpModal) {
                this.hideHelp();
            }
        });
        
        // Fullscreen change events
        document.addEventListener('fullscreenchange', () => {
            this.updateFullscreenState();
        });
        
        document.addEventListener('webkitfullscreenchange', () => {
            this.updateFullscreenState();
        });
        
        document.addEventListener('mozfullscreenchange', () => {
            this.updateFullscreenState();
        });
        
        document.addEventListener('MSFullscreenChange', () => {
            this.updateFullscreenState();
        });
    }
    
    // Theme management
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme();
        this.saveSettings();
    }
    
    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        const icon = this.themeToggle.querySelector('.icon');
        icon.textContent = this.currentTheme === 'dark' ? '☀️' : '🌙';
    }
    
    // Fullscreen management
    toggleFullscreen() {
        if (!this.isFullscreen) {
            this.enterFullscreen();
        } else {
            this.exitFullscreen();
        }
    }
    
    enterFullscreen() {
        const element = document.documentElement;
        
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }
    
    exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
    
    updateFullscreenState() {
        this.isFullscreen = !!(
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
        );
        
        const icon = this.fullscreenToggle.querySelector('.icon');
        icon.textContent = this.isFullscreen ? '⛶' : '⛶';
        
        this.fullscreenToggle.title = this.isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen';
    }
    
    // Help modal
    showHelp() {
        this.helpModal.style.display = 'flex';
        this.closeHelpBtn.focus();
    }
    
    hideHelp() {
        this.helpModal.style.display = 'none';
        this.helpToggle.focus();
    }
    
    // View mode management (simplified - always use expanded view)
    setViewMode(mode) {
        this.viewMode = 'expanded'; // Always use expanded view

        // Update button states (removed - no buttons)
        // this.compactViewBtn.classList.toggle('active', mode === 'compact');
        // this.expandedViewBtn.classList.toggle('active', mode === 'expanded');

        // Update stems container (always expanded)
        this.stemsContainer.classList.remove('compact');

        this.saveSettings();
    }
    
    // Progress bar handling
    handleProgressClick(e) {
        const rect = this.masterProgress.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        
        // Emit seek event
        const event = new CustomEvent('seek', {
            detail: { percentage }
        });
        document.dispatchEvent(event);
    }
    
    // Display updates
    updateMasterVolumeDisplay(value) {
        this.masterVolumeValue.textContent = `${value}%`;
    }
    
    updateTimeDisplay(currentTime, totalTime) {
        this.currentTimeDisplay.textContent = Utils.formatTime(currentTime);
        this.totalTimeDisplay.textContent = Utils.formatTime(totalTime);
    }
    
    updateProgressBar(currentTime, totalTime) {
        if (totalTime > 0) {
            const percentage = (currentTime / totalTime) * 100;
            this.masterProgressFill.style.width = `${percentage}%`;
            this.masterProgressHandle.style.left = `${percentage}%`;
        } else {
            this.masterProgressFill.style.width = '0%';
            this.masterProgressHandle.style.left = '0%';
        }
    }
    
    updatePlayPauseButton(isPlaying) {
        const icon = this.playPauseBtn.querySelector('.icon');
        icon.textContent = isPlaying ? '⏸️' : '▶️';
        this.playPauseBtn.title = isPlaying ? 'Pause (Space)' : 'Play (Space)';
        this.playPauseBtn.classList.toggle('active', isPlaying);
    }
    
    // Status updates
    updateStatus(message) {
        this.statusText.textContent = message;
    }
    
    updateSyncIndicator(inSync) {
        this.syncIndicator.classList.toggle('active', inSync);
        this.syncIndicator.title = inSync ? 'Stems synchronized' : 'Sync issues detected';
    }
    
    updateAudioIndicator(hasAudio) {
        this.audioIndicator.classList.toggle('active', hasAudio);
        this.audioIndicator.title = hasAudio ? 'Audio loaded' : 'No audio';
    }
    
    // Section management
    showUploadSection() {
        this.uploadSection.style.display = 'flex';
        this.playerSection.style.display = 'none';
    }
    
    showPlayerSection() {
        this.uploadSection.style.display = 'none';
        this.playerSection.style.display = 'block';
    }
    
    hideLoadingScreen() {
        this.loadingScreen.style.display = 'none';
        this.app.style.display = 'block';
    }
    
    // Stem UI management
    createStemControl(stem) {
        const stemElement = Utils.createElement('div', 'stem-control');
        stemElement.setAttribute('data-stem-id', stem.id);
        stemElement.tabIndex = 0;

        const color = Utils.generateStemColor(this.stemsContainer.children.length);

        // Determine stem type and get appropriate icon
        const stemType = Utils.getStemTypeFromFileName(stem.file ? stem.file.name : stem.name || stem.id);
        const instrumentIcon = Utils.getInstrumentIcon(stemType);

        // Create elements safely to prevent XSS
        const stemHeader = Utils.createElement('div', 'stem-header');
        const stemName = Utils.createElement('div', 'stem-name');
        const colorIndicator = Utils.createElement('span', 'stem-color-indicator');
        const instrumentIconSpan = Utils.createElement('span', 'stem-instrument-icon');
        const nameText = Utils.createElement('span', 'stem-name-text');
        const stemActions = Utils.createElement('div', 'stem-actions');
        const muteBtn = Utils.createElement('button', 'stem-button mute-btn');
        const soloBtn = Utils.createElement('button', 'stem-button solo-btn');
        const controlsRow = Utils.createElement('div', 'stem-controls-row');
        const volumeControl = Utils.createElement('div', 'stem-volume-control');
        const volumeLabel = Utils.createElement('label');
        const volumeSlider = Utils.createElement('input', 'volume-slider');
        const volumeValue = Utils.createElement('span', 'stem-volume-value');
        const stemProgress = Utils.createElement('div', 'stem-progress');
        const progressFill = Utils.createElement('div', 'stem-progress-fill');

        // Set safe content
        colorIndicator.style.backgroundColor = color;
        instrumentIconSpan.textContent = instrumentIcon;
        nameText.textContent = stem.name || stem.id; // Safe text content
        muteBtn.textContent = '🔇 Mute';
        muteBtn.setAttribute('data-action', 'mute');
        soloBtn.textContent = '🎯 Solo';
        soloBtn.setAttribute('data-action', 'solo');
        volumeLabel.textContent = 'Volume:';
        volumeSlider.type = 'range';
        volumeSlider.min = '0';
        volumeSlider.max = '100';
        volumeSlider.value = '100';
        volumeValue.textContent = '100%';

        // Build DOM structure
        stemName.appendChild(colorIndicator);
        stemName.appendChild(instrumentIconSpan);
        stemName.appendChild(nameText);
        stemActions.appendChild(muteBtn);
        stemActions.appendChild(soloBtn);
        stemHeader.appendChild(stemName);
        stemHeader.appendChild(stemActions);
        volumeControl.appendChild(volumeLabel);
        volumeControl.appendChild(volumeSlider);
        volumeControl.appendChild(volumeValue);
        controlsRow.appendChild(volumeControl);
        stemProgress.appendChild(progressFill);
        stemElement.appendChild(stemHeader);
        stemElement.appendChild(controlsRow);
        stemElement.appendChild(stemProgress);
        
        this.setupStemEventListeners(stemElement, stem);
        return stemElement;
    }
    
    setupStemEventListeners(stemElement, stem) {
        const muteBtn = stemElement.querySelector('.mute-btn');
        const soloBtn = stemElement.querySelector('.solo-btn');
        const volumeSlider = stemElement.querySelector('.volume-slider');
        const volumeValue = stemElement.querySelector('.stem-volume-value');
        
        // Mute button
        muteBtn.addEventListener('click', () => {
            const event = new CustomEvent('stem-mute', {
                detail: { stemId: stem.id }
            });
            document.dispatchEvent(event);
        });
        
        // Solo button
        soloBtn.addEventListener('click', () => {
            const event = new CustomEvent('stem-solo', {
                detail: { stemId: stem.id }
            });
            document.dispatchEvent(event);
        });
        
        // Volume slider
        volumeSlider.addEventListener('input', (e) => {
            const value = e.target.value;
            volumeValue.textContent = `${value}%`;
            
            const event = new CustomEvent('stem-volume', {
                detail: { stemId: stem.id, volume: value / 100 }
            });
            document.dispatchEvent(event);
        });
        
        // Focus handling
        stemElement.addEventListener('focus', () => {
            this.setFocusedStem(stem.id);
        });
        
        stemElement.addEventListener('blur', () => {
            if (this.focusedStem === stem.id) {
                this.setFocusedStem(null);
            }
        });
    }
    
    updateStemMuteState(stemId, muted) {
        const stemElement = this.getStemElement(stemId);
        if (stemElement) {
            const muteBtn = stemElement.querySelector('.mute-btn');
            muteBtn.classList.toggle('mute-active', muted);
            muteBtn.textContent = muted ? '🔊 Unmute' : '🔇 Mute';
        }
    }
    
    updateStemSoloState(stemId, solo) {
        const stemElement = this.getStemElement(stemId);
        if (stemElement) {
            const soloBtn = stemElement.querySelector('.solo-btn');
            soloBtn.classList.toggle('solo-active', solo);
            soloBtn.textContent = solo ? '🎯 Unsolo' : '🎯 Solo';
        }
    }
    
    updateStemProgress(stemId, currentTime, totalTime) {
        const stemElement = this.getStemElement(stemId);
        if (stemElement && totalTime > 0) {
            const progressFill = stemElement.querySelector('.stem-progress-fill');
            const percentage = (currentTime / totalTime) * 100;
            progressFill.style.width = `${percentage}%`;
        }
    }
    
    getStemElement(stemId) {
        return this.stemsContainer.querySelector(`[data-stem-id="${stemId}"]`);
    }
    
    setFocusedStem(stemId) {
        // Remove focus from previous stem
        if (this.focusedStem) {
            const prevElement = this.getStemElement(this.focusedStem);
            if (prevElement) {
                prevElement.classList.remove('focused');
            }
        }
        
        // Set new focused stem
        this.focusedStem = stemId;
        if (stemId) {
            const element = this.getStemElement(stemId);
            if (element) {
                element.classList.add('focused');
            }
        }
    }
    
    clearStems() {
        Utils.removeAllChildren(this.stemsContainer);
        this.focusedStem = null;
    }
    
    // Settings persistence
    saveSettings() {
        const settings = {
            theme: this.currentTheme,
            viewMode: this.viewMode,
            masterVolume: this.masterVolumeSlider.value
            // loopPlayback: this.loopPlayback.checked, // removed
            // autoSync: this.autoSync.checked // removed
        };

        Utils.saveToLocalStorage('stem-player-settings', settings);
    }
    
    loadSettings() {
        const settings = Utils.loadFromLocalStorage('stem-player-settings', {});

        if (settings.theme) {
            this.currentTheme = settings.theme;
            this.applyTheme();
        }

        // Always use expanded view mode
        this.setViewMode('expanded');

        if (settings.masterVolume) {
            this.masterVolumeSlider.value = settings.masterVolume;
            this.updateMasterVolumeDisplay(settings.masterVolume);
        }

        // Removed loop playback and auto sync settings
        // if (settings.loopPlayback !== undefined) {
        //     this.loopPlayback.checked = settings.loopPlayback;
        // }
        //
        // if (settings.autoSync !== undefined) {
        //     this.autoSync.checked = settings.autoSync;
        // }
    }
    
    // Error handling
    showError(message, title = 'Error') {
        // Simple error display - could be enhanced with a proper modal
        alert(`${title}: ${message}`);
    }
    
    showSuccess(message) {
        this.updateStatus(message);
        setTimeout(() => {
            this.updateStatus('Ready');
        }, 3000);
    }
}

// Make UIController available globally
window.UIController = UIController;

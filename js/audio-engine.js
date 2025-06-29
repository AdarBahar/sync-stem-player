/**
 * Audio Engine for Synchronized Stem Playback
 * Handles audio loading, synchronization, and playback control
 */

class AudioEngine {
    constructor() {
        this.audioContext = null;
        this.stems = new Map();
        this.isPlaying = false;
        this.currentTime = 0;
        this.duration = 0;
        this.masterVolume = 0.8;
        this.soloedStem = null;
        this.mutedStems = new Set();
        this.syncThreshold = 0.1; // seconds
        this.updateInterval = null;
        this.onTimeUpdate = null;
        this.onPlayStateChange = null;
        this.onError = null;
        
        this.initializeAudioContext();
    }
    
    initializeAudioContext() {
        try {
            this.audioContext = Utils.createAudioContext();
            
            // Handle audio context state changes
            this.audioContext.addEventListener('statechange', () => {
                console.log('Audio context state:', this.audioContext.state);
            });
            
        } catch (error) {
            Utils.logError(error, 'AudioEngine initialization');
            if (this.onError) {
                this.onError(error);
            }
        }
    }
    
    async resumeAudioContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            try {
                await this.audioContext.resume();
            } catch (error) {
                Utils.logError(error, 'AudioEngine resume');
            }
        }
    }
    
    async loadStem(id, file) {
        try {
            // Validate file
            const errors = Utils.validateAudioFile(file);
            if (errors.length > 0) {
                throw Utils.createError(errors.join(', '), 'ValidationError');
            }
            
            // Read file as array buffer
            const arrayBuffer = await this.readFileAsArrayBuffer(file);
            
            // Create audio element for playback
            const audio = new Audio();
            const url = Utils.createObjectURL(file);
            audio.src = url;
            audio.preload = 'auto';
            
            // Wait for metadata to load
            await new Promise((resolve, reject) => {
                audio.addEventListener('loadedmetadata', resolve);
                audio.addEventListener('error', reject);
                audio.load();
            });
            
            // Create stem object
            const stem = {
                id,
                file,
                audio,
                url,
                duration: audio.duration,
                volume: 1.0,
                muted: false,
                solo: false,
                loaded: true,
                error: null
            };
            
            // Update master duration
            if (audio.duration > this.duration) {
                this.duration = audio.duration;
            }
            
            // Store stem
            this.stems.set(id, stem);
            
            // Setup audio event listeners
            this.setupAudioEventListeners(stem);
            
            return stem;
            
        } catch (error) {
            Utils.logError(error, `AudioEngine loadStem ${id}`);
            
            // Create error stem
            const errorStem = {
                id,
                file,
                audio: null,
                url: null,
                duration: 0,
                volume: 1.0,
                muted: false,
                solo: false,
                loaded: false,
                error: error.message
            };
            
            this.stems.set(id, errorStem);
            
            if (this.onError) {
                this.onError(error);
            }
            
            throw error;
        }
    }
    
    setupAudioEventListeners(stem) {
        const { audio } = stem;
        
        audio.addEventListener('timeupdate', () => {
            // Update current time from the first playing audio
            if (this.isPlaying && !stem.muted && !this.soloedStem) {
                this.currentTime = audio.currentTime;
            }
        });
        
        audio.addEventListener('ended', () => {
            // Handle end of playback
            if (this.isPlaying) {
                this.handlePlaybackEnd();
            }
        });
        
        audio.addEventListener('error', (event) => {
            Utils.logError(event.error, `AudioEngine stem ${stem.id}`);
            stem.error = event.error?.message || 'Audio playback error';
            if (this.onError) {
                this.onError(event.error);
            }
        });
    }
    
    readFileAsArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsArrayBuffer(file);
        });
    }
    
    removeStem(id) {
        const stem = this.stems.get(id);
        if (stem) {
            // Stop audio if playing
            if (stem.audio) {
                stem.audio.pause();
                stem.audio.currentTime = 0;
                // Remove event listeners to prevent memory leaks
                stem.audio.removeEventListener('loadedmetadata', stem.metadataHandler);
                stem.audio.removeEventListener('error', stem.errorHandler);
                stem.audio.src = '';
                stem.audio.load();
            }

            // Revoke object URL to free memory
            if (stem.url) {
                Utils.revokeObjectURL(stem.url);
            }

            // Clear audio buffer if exists
            if (stem.audioBuffer) {
                stem.audioBuffer = null;
            }

            // Remove from collections
            this.stems.delete(id);
            this.mutedStems.delete(id);

            if (this.soloedStem === id) {
                this.soloedStem = null;
            }

            // Update duration
            this.updateDuration();

            // Force garbage collection hint
            if (window.gc) {
                window.gc();
            }
        }
    }
    
    updateDuration() {
        this.duration = 0;
        for (const stem of this.stems.values()) {
            if (stem.loaded && stem.duration > this.duration) {
                this.duration = stem.duration;
            }
        }
    }
    
    async play() {
        try {
            await this.resumeAudioContext();
            
            // Synchronize all stems to current time
            this.synchronizeStems();
            
            // Play all loaded stems
            const playPromises = [];
            for (const stem of this.stems.values()) {
                if (stem.loaded && stem.audio) {
                    playPromises.push(stem.audio.play());
                }
            }
            
            await Promise.all(playPromises);
            
            this.isPlaying = true;
            this.startTimeUpdates();
            
            if (this.onPlayStateChange) {
                this.onPlayStateChange(true);
            }
            
        } catch (error) {
            Utils.logError(error, 'AudioEngine play');
            if (this.onError) {
                this.onError(error);
            }
        }
    }
    
    pause() {
        try {
            // Pause all stems
            for (const stem of this.stems.values()) {
                if (stem.loaded && stem.audio) {
                    stem.audio.pause();
                }
            }
            
            this.isPlaying = false;
            this.stopTimeUpdates();
            
            if (this.onPlayStateChange) {
                this.onPlayStateChange(false);
            }
            
        } catch (error) {
            Utils.logError(error, 'AudioEngine pause');
        }
    }
    
    stop() {
        try {
            this.pause();
            this.seekTo(0);
            
        } catch (error) {
            Utils.logError(error, 'AudioEngine stop');
        }
    }
    
    seekTo(time) {
        try {
            time = Utils.clamp(time, 0, this.duration);
            this.currentTime = time;
            
            // Seek all stems
            for (const stem of this.stems.values()) {
                if (stem.loaded && stem.audio) {
                    stem.audio.currentTime = time;
                }
            }
            
            if (this.onTimeUpdate) {
                this.onTimeUpdate(time);
            }
            
        } catch (error) {
            Utils.logError(error, 'AudioEngine seekTo');
        }
    }
    
    synchronizeStems() {
        // Ensure all stems are at the same time position
        for (const stem of this.stems.values()) {
            if (stem.loaded && stem.audio) {
                const timeDiff = Math.abs(stem.audio.currentTime - this.currentTime);
                if (timeDiff > this.syncThreshold) {
                    stem.audio.currentTime = this.currentTime;
                }
            }
        }
    }
    
    startTimeUpdates() {
        this.stopTimeUpdates();
        this.updateInterval = setInterval(() => {
            if (this.isPlaying) {
                // Get time from first playing stem
                const playingStem = this.getFirstPlayingStem();
                if (playingStem && playingStem.audio) {
                    this.currentTime = playingStem.audio.currentTime;
                    
                    if (this.onTimeUpdate) {
                        this.onTimeUpdate(this.currentTime);
                    }
                    
                    // Check for sync issues
                    this.checkSynchronization();
                }
            }
        }, 100); // Update every 100ms
    }
    
    stopTimeUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
    
    checkSynchronization() {
        const playingStems = this.getPlayingStems();
        if (playingStems.length > 1) {
            const referenceStem = playingStems[0];
            const referenceTime = referenceStem.audio.currentTime;
            
            for (let i = 1; i < playingStems.length; i++) {
                const stem = playingStems[i];
                const timeDiff = Math.abs(stem.audio.currentTime - referenceTime);
                
                if (timeDiff > this.syncThreshold) {
                    console.warn(`Stem ${stem.id} out of sync by ${timeDiff}s`);
                    stem.audio.currentTime = referenceTime;
                }
            }
        }
    }
    
    getFirstPlayingStem() {
        for (const stem of this.stems.values()) {
            if (stem.loaded && stem.audio && !stem.audio.paused) {
                return stem;
            }
        }
        return null;
    }
    
    getPlayingStems() {
        const playing = [];
        for (const stem of this.stems.values()) {
            if (stem.loaded && stem.audio && !stem.audio.paused) {
                playing.push(stem);
            }
        }
        return playing;
    }
    
    handlePlaybackEnd() {
        // Check if all stems have ended
        const allEnded = Array.from(this.stems.values()).every(stem => {
            return !stem.loaded || !stem.audio || stem.audio.ended;
        });
        
        if (allEnded) {
            this.isPlaying = false;
            this.stopTimeUpdates();
            
            if (this.onPlayStateChange) {
                this.onPlayStateChange(false);
            }
        }
    }
    
    // Volume and mixing controls
    setMasterVolume(volume) {
        this.masterVolume = Utils.clamp(volume, 0, 1);
        this.updateAllVolumes();
    }
    
    setStemVolume(id, volume) {
        const stem = this.stems.get(id);
        if (stem) {
            stem.volume = Utils.clamp(volume, 0, 1);
            this.updateStemVolume(stem);
        }
    }
    
    muteStem(id, muted = true) {
        const stem = this.stems.get(id);
        if (stem) {
            stem.muted = muted;
            if (muted) {
                this.mutedStems.add(id);
            } else {
                this.mutedStems.delete(id);
            }
            this.updateStemVolume(stem);
        }
    }
    
    soloStem(id, solo = true) {
        if (solo) {
            this.soloedStem = id;
        } else if (this.soloedStem === id) {
            this.soloedStem = null;
        }
        
        // Update all stem volumes
        this.updateAllVolumes();
    }
    
    updateStemVolume(stem) {
        if (!stem.loaded || !stem.audio) return;
        
        let volume = stem.volume * this.masterVolume;
        
        // Apply mute
        if (stem.muted) {
            volume = 0;
        }
        
        // Apply solo
        if (this.soloedStem && this.soloedStem !== stem.id) {
            volume = 0;
        }
        
        stem.audio.volume = volume;
    }
    
    updateAllVolumes() {
        for (const stem of this.stems.values()) {
            this.updateStemVolume(stem);
        }
    }
    
    // Getters
    getStems() {
        return Array.from(this.stems.values());
    }
    
    getStem(id) {
        return this.stems.get(id);
    }
    
    getLoadedStems() {
        return Array.from(this.stems.values()).filter(stem => stem.loaded);
    }
    
    // Cleanup
    destroy() {
        this.stop();
        
        // Remove all stems
        for (const id of this.stems.keys()) {
            this.removeStem(id);
        }
        
        // Close audio context
        if (this.audioContext) {
            this.audioContext.close();
        }
        
        // Clear callbacks
        this.onTimeUpdate = null;
        this.onPlayStateChange = null;
        this.onError = null;
    }
}

// Make AudioEngine available globally
window.AudioEngine = AudioEngine;

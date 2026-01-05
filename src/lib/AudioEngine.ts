/**
 * Audio Engine for Synchronized Stem Playback
 * TypeScript version adapted from the original JavaScript implementation
 */

export interface StemData {
  id: string;
  name: string;
  file: File;
  audio: HTMLAudioElement;
  loaded: boolean;
  duration: number;
  error?: string;
  muted: boolean;
  volume: number;
  solo: boolean;
}

export interface AudioEngineCallbacks {
  onTimeUpdate?: (currentTime: number) => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
  onError?: (error: Error) => void;
  onLoadProgress?: (progress: number) => void;
}

export class AudioEngine {
  private audioContext: AudioContext | null = null;
  private audioContextPromise: Promise<void> | null = null;
  private stems = new Map<string, StemData>();
  private isPlaying = false;
  private currentTime = 0;
  private duration = 0;
  private masterVolume = 0.8;
  private soloedStem: string | null = null;
  private syncThreshold = 0.1; // seconds
  private updateInterval: ReturnType<typeof setInterval> | null = null;
  private callbacks: AudioEngineCallbacks = {};

  constructor(callbacks: AudioEngineCallbacks = {}) {
    this.callbacks = callbacks;
    this.audioContextPromise = this.initializeAudioContext();
  }

  private async initializeAudioContext(): Promise<void> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
    } catch (error) {
      this.callbacks.onError?.(error as Error);
    }
  }

  /**
   * Ensures AudioContext is initialized before performing audio operations
   */
  private async ensureAudioContext(): Promise<void> {
    if (this.audioContextPromise) {
      await this.audioContextPromise;
    }
  }

  async loadStem(id: string, file: File): Promise<StemData> {
    // Ensure AudioContext is ready before loading
    await this.ensureAudioContext();

    try {
      const audio = new Audio();
      const url = URL.createObjectURL(file);
      audio.src = url;
      audio.preload = 'metadata';
      
      const stem: StemData = {
        id,
        name: file.name.replace(/\.[^/.]+$/, ''),
        file,
        audio,
        loaded: false,
        duration: 0,
        muted: false,
        volume: 100,
        solo: false
      };

      this.stems.set(id, stem);
      this.setupAudioEventListeners(stem);

      // Wait for metadata to load
      await new Promise<void>((resolve, reject) => {
        const onLoadedMetadata = () => {
          stem.loaded = true;
          stem.duration = audio.duration;
          this.duration = Math.max(this.duration, audio.duration);
          audio.removeEventListener('loadedmetadata', onLoadedMetadata);
          audio.removeEventListener('error', onError);
          resolve();
        };

        const onError = () => {
          const error = new Error(`Failed to load audio: ${file.name}`);
          stem.error = error.message;
          audio.removeEventListener('loadedmetadata', onLoadedMetadata);
          audio.removeEventListener('error', onError);
          reject(error);
        };

        audio.addEventListener('loadedmetadata', onLoadedMetadata);
        audio.addEventListener('error', onError);
      });

      return stem;
    } catch (error) {
      console.error(`Failed to load stem ${id}:`, error);
      throw error;
    }
  }

  private setupAudioEventListeners(stem: StemData) {
    const { audio } = stem;
    
    audio.addEventListener('timeupdate', () => {
      if (this.isPlaying && !stem.muted && !this.soloedStem) {
        this.currentTime = audio.currentTime;
      }
    });
    
    audio.addEventListener('ended', () => {
      if (this.isPlaying) {
        this.handlePlaybackEnd();
      }
    });
    
    audio.addEventListener('error', (event) => {
      console.error(`Audio error for stem ${stem.id}:`, event);
      stem.error = 'Audio playback error';
      this.callbacks.onError?.(new Error(stem.error));
    });
  }

  async play() {
    try {
      await this.resumeAudioContext();
      
      this.synchronizeStems();
      
      const playPromises: Promise<void>[] = [];
      for (const stem of this.stems.values()) {
        if (stem.loaded && stem.audio) {
          playPromises.push(stem.audio.play());
        }
      }
      
      await Promise.all(playPromises);
      
      this.isPlaying = true;
      this.startTimeUpdates();
      
      this.callbacks.onPlayStateChange?.(true);
    } catch (error) {
      console.error('Failed to play audio:', error);
      this.callbacks.onError?.(error as Error);
    }
  }

  pause() {
    for (const stem of this.stems.values()) {
      if (stem.loaded && stem.audio) {
        stem.audio.pause();
      }
    }
    
    this.isPlaying = false;
    this.stopTimeUpdates();
    
    this.callbacks.onPlayStateChange?.(false);
  }

  stop() {
    this.pause();
    this.seek(0);
  }

  seek(time: number) {
    this.currentTime = Math.max(0, Math.min(time, this.duration));
    
    for (const stem of this.stems.values()) {
      if (stem.loaded && stem.audio) {
        stem.audio.currentTime = this.currentTime;
      }
    }
  }

  setMasterVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume / 100));
    this.updateAllVolumes();
  }

  setStemVolume(stemId: string, volume: number) {
    const stem = this.stems.get(stemId);
    if (stem) {
      stem.volume = Math.max(0, Math.min(100, volume));
      this.updateStemVolume(stem);
    }
  }

  setStemMuted(stemId: string, muted: boolean) {
    const stem = this.stems.get(stemId);
    if (stem) {
      stem.muted = muted;
      // If muting this track, turn off solo
      if (muted && stem.solo) {
        stem.solo = false;
        // If this was the soloed stem, clear the solo state
        if (this.soloedStem === stemId) {
          this.soloedStem = null;
          // Restore original mute states for all stems
          for (const otherStem of this.stems.values()) {
            otherStem.audio.muted = otherStem.muted;
          }
        }
      }
      this.updateStemVolume(stem);
    }
  }

  setStemSolo(stemId: string, solo: boolean) {
    const stem = this.stems.get(stemId);
    if (!stem) return;

    if (solo) {
      // If soloing this track, turn off mute
      stem.muted = false;

      this.soloedStem = stemId;
      // Mute all other stems and turn off their solo state
      for (const [id, otherStem] of this.stems) {
        if (id !== stemId) {
          otherStem.audio.muted = true;
          otherStem.solo = false; // Turn off solo for other stems
        }
      }
      stem.audio.muted = false;
      stem.solo = true;
    } else {
      this.soloedStem = null;
      // Restore original mute states
      for (const otherStem of this.stems.values()) {
        otherStem.audio.muted = otherStem.muted;
      }
      stem.solo = false;
    }
  }

  private updateStemVolume(stem: StemData) {
    if (stem.audio) {
      stem.audio.volume = (stem.volume / 100) * this.masterVolume;
      // Respect solo state: if a stem is soloed, mute all others regardless of their muted state
      if (this.soloedStem !== null) {
        stem.audio.muted = stem.id !== this.soloedStem;
      } else {
        stem.audio.muted = stem.muted;
      }
    }
  }

  private updateAllVolumes() {
    for (const stem of this.stems.values()) {
      this.updateStemVolume(stem);
    }
  }

  private async resumeAudioContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  private synchronizeStems() {
    for (const stem of this.stems.values()) {
      if (stem.loaded && stem.audio) {
        const timeDiff = Math.abs(stem.audio.currentTime - this.currentTime);
        if (timeDiff > this.syncThreshold) {
          stem.audio.currentTime = this.currentTime;
        }
      }
    }
  }

  private startTimeUpdates() {
    this.stopTimeUpdates();
    this.updateInterval = setInterval(() => {
      if (this.isPlaying) {
        const playingStem = this.getFirstPlayingStem();
        if (playingStem?.audio) {
          this.currentTime = playingStem.audio.currentTime;
          this.callbacks.onTimeUpdate?.(this.currentTime);
          this.checkSynchronization();
        }
      }
    }, 100);
  }

  private stopTimeUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  private checkSynchronization() {
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

  private getFirstPlayingStem(): StemData | null {
    for (const stem of this.stems.values()) {
      if (stem.loaded && stem.audio && !stem.audio.paused) {
        return stem;
      }
    }
    return null;
  }

  private getPlayingStems(): StemData[] {
    return Array.from(this.stems.values()).filter(
      stem => stem.loaded && stem.audio && !stem.audio.paused
    );
  }

  private handlePlaybackEnd() {
    this.isPlaying = false;
    this.stopTimeUpdates();
    this.callbacks.onPlayStateChange?.(false);
  }

  // Getters
  getCurrentTime(): number {
    return this.currentTime;
  }

  getDuration(): number {
    return this.duration;
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  getStems(): StemData[] {
    return Array.from(this.stems.values());
  }

  getStem(id: string): StemData | undefined {
    return this.stems.get(id);
  }

  // Cleanup
  destroy() {
    this.pause();
    this.stopTimeUpdates();
    
    for (const stem of this.stems.values()) {
      if (stem.audio.src.startsWith('blob:')) {
        URL.revokeObjectURL(stem.audio.src);
      }
    }
    
    this.stems.clear();
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

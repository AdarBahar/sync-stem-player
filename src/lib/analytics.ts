declare global {
  interface Window {
    BaharAnalytics?: {
      track: (eventName: string, properties?: Record<string, unknown>) => void;
      trackButtonClick: (buttonName: string, location?: string, properties?: Record<string, unknown>) => void;
      trackError: (errorType: string, errorMessage: string, location?: string) => void;
    };
  }
}

export const analytics = {
  track(event: string, properties?: Record<string, unknown>) {
    window.BaharAnalytics?.track(event, properties);
  },

  trackButtonClick(buttonName: string, location?: string, properties?: Record<string, unknown>) {
    window.BaharAnalytics?.trackButtonClick(buttonName, location, properties);
  },

  trackError(errorType: string, errorMessage: string, location?: string) {
    window.BaharAnalytics?.trackError(errorType, errorMessage, location);
  },

  // App-specific events
  filesUploaded(count: number, totalSizeMB: number) {
    this.track('Files Uploaded', { stem_count: count, total_size_mb: totalSizeMB });
  },

  demoPlayed() {
    this.track('Demo Played');
  },

  playbackStarted(stemCount: number) {
    this.track('Playback Started', { stem_count: stemCount });
  },

  playbackPaused(currentTime: number, duration: number) {
    this.track('Playback Paused', { current_time: currentTime, duration, progress_percent: Math.round((currentTime / duration) * 100) });
  },

  stemMuted(stemName: string, muted: boolean) {
    this.track('Stem Muted', { stem_name: stemName, muted });
  },

  stemSoloed(stemName: string, soloed: boolean) {
    this.track('Stem Soloed', { stem_name: stemName, soloed });
  },

  stemVolumeChanged(stemName: string, volume: number) {
    this.track('Stem Volume Changed', { stem_name: stemName, volume });
  },

  masterVolumeChanged(volume: number) {
    this.track('Master Volume Changed', { volume });
  },

  seeked(fromTime: number, toTime: number, duration: number) {
    this.track('Seeked', { from_time: fromTime, to_time: toTime, duration });
  },

  backToUpload(playDuration: number) {
    this.track('Back to Upload', { play_duration_seconds: playDuration });
  },
};


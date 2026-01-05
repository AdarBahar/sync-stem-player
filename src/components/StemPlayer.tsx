import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, ArrowLeft } from 'lucide-react';
import StemTrack from './StemTrack';
import Footer from './Footer';
import { Stem } from '../hooks/useAudioStemsCreator';
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts';
import { analytics } from '../lib/analytics';

interface StemPlayerProps {
  stems: Stem[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onBack: () => void;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (time: number) => void;
  onMasterVolumeChange: (volume: number) => void;
  onStemVolumeChange: (stemId: string, volume: number) => void;
  onStemMute: (stemId: string, muted: boolean) => void;
  onStemSolo: (stemId: string, solo: boolean) => void;
}

const StemPlayer: React.FC<StemPlayerProps> = ({
  stems,
  isPlaying,
  currentTime,
  duration,
  onBack,
  onPlay,
  onPause,
  onSeek,
  onMasterVolumeChange,
  onStemVolumeChange,
  onStemMute,
  onStemSolo
}) => {
  const [masterVolume, setMasterVolume] = useState(80);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Enable keyboard shortcuts
  useKeyboardShortcuts({
    isPlaying,
    onPlay,
    onPause,
    onSeek,
    currentTime,
    duration,
  });

  // Sync video playback with audio playback
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {
          // Ignore autoplay errors
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Check if any stem is soloed
  const soloedStemId = stems.find(s => s.solo)?.id ?? null;

  // Check if all tracks are muted (or effectively muted due to solo)
  const allTracksMuted = stems.length > 0 && stems.every(stem => stem.muted);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      analytics.playbackPaused(currentTime, duration);
      onPause();
    } else {
      analytics.playbackStarted(stems.length);
      onPlay();
    }
  }, [isPlaying, currentTime, duration, stems.length, onPause, onPlay]);

  const handleStemVolumeChange = useCallback((stemId: string, volume: number) => {
    const stem = stems.find(s => s.id === stemId);
    if (stem) {
      analytics.stemVolumeChanged(stem.name, volume);
    }
    onStemVolumeChange(stemId, volume);
  }, [stems, onStemVolumeChange]);

  const handleStemMute = useCallback((stemId: string) => {
    const stem = stems.find(s => s.id === stemId);
    if (stem) {
      analytics.stemMuted(stem.name, !stem.muted);
      onStemMute(stemId, !stem.muted);
    }
  }, [stems, onStemMute]);

  const handleStemSolo = useCallback((stemId: string) => {
    const stem = stems.find(s => s.id === stemId);
    if (stem) {
      analytics.stemSoloed(stem.name, !stem.solo);
      onStemSolo(stemId, !stem.solo);
    }
  }, [stems, onStemSolo]);

  const handleMasterVolumeChange = useCallback((volume: number) => {
    setMasterVolume(volume);
    analytics.masterVolumeChanged(volume);
    onMasterVolumeChange(volume);
  }, [onMasterVolumeChange]);

  const handleBack = useCallback(() => {
    analytics.backToUpload(currentTime);
    onBack();
  }, [currentTime, onBack]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    analytics.seeked(currentTime, newTime, duration);
    onSeek(newTime);
  }, [currentTime, duration, onSeek]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col relative overflow-hidden">
      {/* Video Background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="turntable-small.mp4"
        muted
        loop
        playsInline
      />

      <div className="absolute inset-0 bg-slate-950/50 z-10" />

      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-950/60 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors duration-200 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="font-medium">Back to Upload</span>
            </button>
            
            <div className="text-center">
              <h1 className="text-xl font-bold text-white">Stem Player</h1>
              <p className="text-slate-400 text-xs">{stems.length} tracks loaded</p>
            </div>
            
            <div className="w-32"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative z-20">
        <div className="max-w-7xl mx-auto px-8 py-6">
          {/* Master Control Panel */}
          <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-slate-800 shadow-2xl">
            {/* Transport Controls */}
            <div className="flex items-center justify-center space-x-4 mb-6">
              <button
                onClick={() => onSeek(0)}
                title="Go to start (Home)"
                className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors duration-200"
              >
                <SkipBack className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={togglePlayPause}
                title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
                className="w-14 h-14 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 rounded-xl flex items-center justify-center transition-all duration-200 transform hover:scale-105 shadow-2xl shadow-violet-500/25"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-white" />
                ) : (
                  <Play className="w-6 h-6 text-white ml-0.5" />
                )}
              </button>

              <button
                onClick={() => onSeek(duration)}
                title="Go to end (End)"
                className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors duration-200"
              >
                <SkipForward className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Keyboard shortcuts hint */}
            <div className="text-center text-xs text-slate-500 mb-4">
              <span>Keyboard: </span>
              <span className="text-slate-400">Space</span> play/pause ·
              <span className="text-slate-400"> ←/→</span> seek 5s ·
              <span className="text-slate-400"> Home/End</span> start/end
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-mono">{formatTime(currentTime)}</span>
                <span className="font-mono">{formatTime(duration)}</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={duration ? (currentTime / duration) * 100 : 0}
                  onChange={handleProgressChange}
                  className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer progress-slider"
                />
              </div>
            </div>

            {/* All Tracks Muted Warning */}
            {allTracksMuted && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-600 rounded-lg">
                <div className="flex items-center justify-center gap-2 text-red-300">
                  <VolumeX className="w-4 h-4" />
                  <span className="font-medium text-sm">All tracks are muted!</span>
                </div>
              </div>
            )}

            {/* Master Volume */}
            <div className="flex items-center justify-center space-x-4">
              <span className="text-white font-semibold text-sm">Master</span>
              <div className="flex items-center space-x-3">
                <Volume2 className="w-4 h-4 text-slate-400" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={masterVolume}
                  onChange={(e) => handleMasterVolumeChange(parseInt(e.target.value))}
                  className="w-24 h-1.5 bg-slate-700 rounded-full appearance-none cursor-pointer volume-slider"
                />
                <span className="text-violet-400 font-semibold w-10 text-right text-sm">{masterVolume}%</span>
              </div>
            </div>
          </div>

          {/* Stem Tracks */}
          <div className="space-y-3">
            {stems.map(stem => (
              <StemTrack
                key={stem.id}
                stem={stem}
                soloedStemId={soloedStemId}
                onVolumeChange={handleStemVolumeChange}
                onMute={handleStemMute}
                onSolo={handleStemSolo}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-20">
        <Footer />
      </div>
    </div>
  );
};

export default StemPlayer;
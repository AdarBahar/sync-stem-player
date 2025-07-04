import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Shuffle, Repeat, ArrowLeft } from 'lucide-react';
import StemTrack from './StemTrack';
import Footer from './Footer';
import { Stem } from '../hooks/useAudioStemsCreator';

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

  // Check if all tracks are muted
  const allTracksMuted = stems.length > 0 && stems.every(stem => stem.muted);

  const togglePlayPause = () => {
    if (isPlaying) {
      onPause();
    } else {
      onPlay();
    }
  };

  const handleStemVolumeChange = (stemId: string, volume: number) => {
    onStemVolumeChange(stemId, volume);
  };

  const handleStemMute = (stemId: string) => {
    const stem = stems.find(s => s.id === stemId);
    if (stem) {
      onStemMute(stemId, !stem.muted);
    }
  };

  const handleStemSolo = (stemId: string) => {
    const stem = stems.find(s => s.id === stemId);
    if (stem) {
      onStemSolo(stemId, !stem.solo);
    }
  };

  const handleMasterVolumeChange = (volume: number) => {
    setMasterVolume(volume);
    onMasterVolumeChange(volume);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    onSeek(newTime);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
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
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-8 py-6">
          {/* Master Control Panel */}
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-slate-800 shadow-2xl">
            {/* Transport Controls */}
            <div className="flex items-center justify-center space-x-4 mb-6">
              <button className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors duration-200">
                <Shuffle className="w-4 h-4 text-slate-400" />
              </button>
              
              <button className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors duration-200">
                <SkipBack className="w-4 h-4 text-slate-400" />
              </button>
              
              <button
                onClick={togglePlayPause}
                className="w-14 h-14 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 rounded-xl flex items-center justify-center transition-all duration-200 transform hover:scale-105 shadow-2xl shadow-violet-500/25"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-white" />
                ) : (
                  <Play className="w-6 h-6 text-white ml-0.5" />
                )}
              </button>
              
              <button className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors duration-200">
                <SkipForward className="w-4 h-4 text-slate-400" />
              </button>
              
              <button className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors duration-200">
                <Repeat className="w-4 h-4 text-slate-400" />
              </button>
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
                onVolumeChange={handleStemVolumeChange}
                onMute={handleStemMute}
                onSolo={handleStemSolo}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default StemPlayer;
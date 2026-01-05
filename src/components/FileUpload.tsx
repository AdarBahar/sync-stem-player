import { useCallback } from 'react';
import { Upload, Music, FileAudio, AudioWaveform as Waveform, Headphones, Sparkles } from 'lucide-react';
import Footer from './Footer';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  onPlayDemo: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelected, onPlayDemo }) => {
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('audio/')
    );
    
    if (files.length > 0) {
      onFilesSelected(files);
    }
  }, [onFilesSelected]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFilesSelected(files);
    }
  }, [onFilesSelected]);

  const supportedFormats = ['MP3', 'WAV', 'FLAC', 'M4A', 'OGG', 'AIFF'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-5xl">
          {/* Main Upload Area */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl mb-6 shadow-2xl">
              <Waveform className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
              Synchronized Stem Player
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Professional multi-track audio player for stems and isolated tracks.
              Upload your files or try our demo to experience synchronized playback.
            </p>

            {/* Demo Button */}
            <div className="mt-8">
              <button
                onClick={onPlayDemo}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white px-10 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25 inline-flex items-center space-x-3"
              >
                <FileAudio className="w-5 h-5" />
                <span>Try Demo Track</span>
              </button>
              <p className="text-slate-500 text-sm mt-3">Experience the player with Led Zeppelin - Ramble On stems</p>
            </div>
          </div>

          {/* Upload Zone */}
          <div 
            className="relative group border-2 border-dashed border-slate-700 rounded-3xl p-16 text-center hover:border-violet-500/50 transition-all duration-500 bg-slate-900/30 backdrop-blur-sm hover:bg-slate-900/50"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-600/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10 flex flex-col items-center space-y-8">
              <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center group-hover:bg-violet-600/20 transition-colors duration-300">
                <Music className="w-8 h-8 text-slate-400 group-hover:text-violet-400 transition-colors duration-300" />
              </div>
              
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold text-white">
                  Drop your stem files here
                </h2>
                <p className="text-slate-400 text-lg">
                  Or click to browse and select multiple audio files
                </p>
              </div>

              <label className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white px-8 py-4 rounded-xl font-semibold cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-violet-500/25 inline-flex items-center space-x-3">
                <Upload className="w-5 h-5" />
                <span>Select Audio Files</span>
                <input
                  type="file"
                  multiple
                  accept="audio/*"
                  onChange={handleFileSelect}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 mb-12">
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-colors duration-300">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4">
                <Headphones className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Professional Controls</h3>
              <p className="text-slate-400 text-sm">Individual volume, mute, and solo controls for each stem track</p>
            </div>
            
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-colors duration-300">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                <Waveform className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Synchronized Playback</h3>
              <p className="text-slate-400 text-sm">Perfect timing synchronization across all loaded stem tracks</p>
            </div>
            
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-colors duration-300">
              <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Smart Detection</h3>
              <p className="text-slate-400 text-sm">Automatic instrument recognition and color coding</p>
            </div>
          </div>

          {/* Supported Formats */}
          <div className="text-center mb-8">
            <p className="text-slate-400 mb-4 font-medium">Supported Audio Formats</p>
            <div className="flex justify-center flex-wrap gap-3">
              {supportedFormats.map(format => (
                <span
                  key={format}
                  className="bg-slate-800/80 text-slate-300 px-4 py-2 rounded-lg text-sm font-medium border border-slate-700"
                >
                  {format}
                </span>
              ))}
            </div>
          </div>


        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default FileUpload;
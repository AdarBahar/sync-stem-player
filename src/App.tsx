import { useState } from 'react';
import FileUpload from './components/FileUpload';
import StemPlayer from './components/StemPlayer';
import useAudioStemsCreator from './hooks/useAudioStemsCreator';
import { useToast } from './contexts/ToastContext';

function App() {
  const [view, setView] = useState<'upload' | 'player'>('upload');
  const toast = useToast();

  const {
    stems,
    isLoading,
    isPlaying,
    currentTime,
    duration,
    createStemsFromFiles,
    createDemoStems,
    clearStems,
    play,
    pause,
    seek,
    setMasterVolume,
    setStemVolume,
    setStemMuted,
    setStemSolo
  } = useAudioStemsCreator({
    onError: toast.error,
    onSuccess: toast.success,
  });

  const handleFilesSelected = async (files: File[]) => {
    const newStems = await createStemsFromFiles(files);
    if (newStems.length > 0) {
      setView('player');
    }
  };

  const handlePlayDemo = async () => {
    await createDemoStems();
    setView('player');
  };

  const handleBackToUpload = () => {
    clearStems();
    setView('upload');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl font-semibold text-white mb-2">Processing Audio</h2>
            <p className="text-slate-400">Loading and analyzing your stem files...</p>
          </div>
        </div>
      ) : view === 'upload' ? (
        <FileUpload onFilesSelected={handleFilesSelected} onPlayDemo={handlePlayDemo} />
      ) : (
        <StemPlayer
          stems={stems}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          onBack={handleBackToUpload}
          onPlay={play}
          onPause={pause}
          onSeek={seek}
          onMasterVolumeChange={setMasterVolume}
          onStemVolumeChange={setStemVolume}
          onStemMute={setStemMuted}
          onStemSolo={setStemSolo}
        />
      )}
    </div>
  );
}

export default App;
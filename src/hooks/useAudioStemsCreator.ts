import { useState, useCallback, useRef, useEffect } from 'react';
import { AudioEngine, StemData } from '../lib/AudioEngine';

export interface Stem {
  id: string;
  name: string;
  instrument: string;
  file: File | string;
  audio: HTMLAudioElement;
  /** User's intended volume level (0-100), never auto-changed by mute/solo */
  volume: number;
  /** User's mute preference */
  muted: boolean;
  /** Whether this stem is soloed (at most one stem can be soloed at a time) */
  solo: boolean;
  color: string;
  icon: string;
}

interface UseAudioStemsCreatorOptions {
  onError?: (message: string) => void;
  onSuccess?: (message: string) => void;
}

const useAudioStemsCreator = (options: UseAudioStemsCreatorOptions = {}) => {
  const { onError, onSuccess } = options;
  const [stems, setStems] = useState<Stem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioEngineRef = useRef<AudioEngine | null>(null);
  const onErrorRef = useRef(onError);

  // Keep refs updated
  onErrorRef.current = onError;

  // Cleanup on unmount only - don't create engine on mount
  useEffect(() => {
    return () => {
      audioEngineRef.current?.destroy();
    };
  }, []);

  // Lazy initialization of audio engine (called on user gesture)
  const getOrCreateAudioEngine = useCallback(() => {
    if (!audioEngineRef.current) {
      audioEngineRef.current = new AudioEngine({
        onTimeUpdate: (time) => setCurrentTime(time),
        onPlayStateChange: (playing) => setIsPlaying(playing),
        onError: (error) => {
          onErrorRef.current?.(error.message || 'Audio engine error');
        }
      });
    }
    return audioEngineRef.current;
  }, []);

  const getInstrumentFromFileName = (fileName: string): { instrument: string; color: string; icon: string } => {
    const name = fileName.toLowerCase();

    if (name.includes('bass')) {
      return { instrument: 'bass', color: 'green', icon: 'bass' };
    } else if (name.includes('drum')) {
      return { instrument: 'drums', color: 'blue', icon: 'drums' };
    } else if (name.includes('vocal') || name.includes('voice')) {
      return { instrument: 'vocals', color: 'purple', icon: 'vocals' };
    } else if (name.includes('piano') || name.includes('keys') || name.includes('keyboard')) {
      return { instrument: 'piano', color: 'pink', icon: 'piano' };
    } else if (name.includes('guitar') || name.includes('gtr')) {
      return { instrument: 'guitar', color: 'amber', icon: 'other' };
    } else {
      return { instrument: 'other', color: 'orange', icon: 'other' };
    }
  };

  const convertStemDataToStem = useCallback((stemData: StemData): Stem => {
    const { instrument, color, icon } = getInstrumentFromFileName(stemData.name);
    return {
      id: stemData.id,
      name: stemData.name,
      instrument,
      file: stemData.file,
      audio: stemData.audio,
      volume: stemData.volume,
      muted: stemData.muted,
      solo: stemData.solo,
      color,
      icon
    };
  }, []);

  const createStemsFromFiles = useCallback(async (files: File[]) => {
    const engine = getOrCreateAudioEngine();
    setIsLoading(true);

    try {
      const newStems: Stem[] = [];
      const failedFiles: string[] = [];

      for (const file of files) {
        try {
          const stemId = `${Date.now()}-${Math.random()}`;
          const stemData = await engine.loadStem(stemId, file);
          const stem = convertStemDataToStem(stemData);
          newStems.push(stem);
        } catch {
          failedFiles.push(file.name);
        }
      }

      if (failedFiles.length > 0) {
        onError?.(`Failed to load: ${failedFiles.join(', ')}`);
      }

      if (newStems.length > 0) {
        setStems(newStems);
        setDuration(engine.getDuration());
        onSuccess?.(`Loaded ${newStems.length} stem${newStems.length > 1 ? 's' : ''} successfully`);
      }

      setIsLoading(false);
      return newStems;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load audio files';
      onError?.(message);
      setIsLoading(false);
      return [];
    }
  }, [convertStemDataToStem, getOrCreateAudioEngine, onError, onSuccess]);

  const createDemoStems = useCallback(async () => {
    const engine = getOrCreateAudioEngine();
    setIsLoading(true);

    try {
      // Demo files are copied to public/examples/demo-stems by vite-plugin-static-copy
      // They're served from the web root
      const demoFilePaths = [
        '/examples/demo-stems/Led Zeppelin - Ramble On - bass.mp3',
        '/examples/demo-stems/Led Zeppelin - Ramble On - drums.mp3',
        '/examples/demo-stems/Led Zeppelin - Ramble On - other.mp3',
        '/examples/demo-stems/Led Zeppelin - Ramble On - vocals.mp3'
      ];

      const newStems: Stem[] = [];
      let hasRealFiles = false;

      // Try to load real demo files first
      for (let i = 0; i < demoFilePaths.length; i++) {
        try {
          const response = await fetch(demoFilePaths[i]);
          if (response.ok) {
            const blob = await response.blob();
            const file = new File([blob], demoFilePaths[i].split('/').pop() || `demo-${i}.mp3`, { type: 'audio/mpeg' });

            const stemId = `demo-${i}`;
            const stemData = await engine.loadStem(stemId, file);
            const stem = convertStemDataToStem(stemData);
            newStems.push(stem);
            hasRealFiles = true;
          }
        } catch {
          // Demo file not found, will use mock data instead
        }
      }

      // If no real files found, create mock stems for demo
      if (!hasRealFiles) {
        const demoStemsData = [
          { name: 'Led Zeppelin - Ramble On - bass', instrument: 'bass', color: 'green', icon: 'bass' },
          { name: 'Led Zeppelin - Ramble On - drums', instrument: 'drums', color: 'blue', icon: 'drums' },
          { name: 'Led Zeppelin - Ramble On - other', instrument: 'other', color: 'orange', icon: 'other' },
          { name: 'Led Zeppelin - Ramble On - vocals', instrument: 'vocals', color: 'purple', icon: 'vocals' }
        ];

        for (let i = 0; i < demoStemsData.length; i++) {
          const stemData = demoStemsData[i];

          // Create a longer silent audio track for demo
          const audio = new Audio();
          // Create a 3-minute silent audio track
          const sampleRate = 44100;
          const duration = 180; // 3 minutes
          const numChannels = 2;
          const numSamples = sampleRate * duration * numChannels;

          // Create minimal WAV file header + silent data
          const buffer = new ArrayBuffer(44 + numSamples * 2);
          const view = new DataView(buffer);

          // WAV header
          const writeString = (offset: number, string: string) => {
            for (let i = 0; i < string.length; i++) {
              view.setUint8(offset + i, string.charCodeAt(i));
            }
          };

          writeString(0, 'RIFF');
          view.setUint32(4, 36 + numSamples * 2, true);
          writeString(8, 'WAVE');
          writeString(12, 'fmt ');
          view.setUint32(16, 16, true);
          view.setUint16(20, 1, true);
          view.setUint16(22, numChannels, true);
          view.setUint32(24, sampleRate, true);
          view.setUint32(28, sampleRate * numChannels * 2, true);
          view.setUint16(32, numChannels * 2, true);
          view.setUint16(34, 16, true);
          writeString(36, 'data');
          view.setUint32(40, numSamples * 2, true);

          // Silent audio data (all zeros)
          for (let j = 44; j < buffer.byteLength; j += 2) {
            view.setInt16(j, 0, true);
          }

          const blob = new Blob([buffer], { type: 'audio/wav' });
          audio.src = URL.createObjectURL(blob);

          const stem: Stem = {
            id: `demo-${i}`,
            name: stemData.name,
            instrument: stemData.instrument,
            file: 'demo',
            audio,
            volume: 100,
            muted: false,
            solo: false,
            color: stemData.color,
            icon: stemData.icon
          };

          newStems.push(stem);
        }

        setDuration(180); // 3 minutes demo duration
      } else {
        setDuration(engine.getDuration() || 0);
      }

      setStems(newStems);
      setIsLoading(false);

      if (hasRealFiles) {
        onSuccess?.(`Loaded demo: ${newStems.length} stems`);
      } else {
        onError?.('Demo files not found. Using silent placeholder tracks.');
      }

      return newStems;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load demo stems';
      onError?.(message);
      setIsLoading(false);
      return [];
    }
  }, [convertStemDataToStem, getOrCreateAudioEngine, onError, onSuccess]);

  const clearStems = useCallback(() => {
    audioEngineRef.current?.destroy();
    audioEngineRef.current = null; // Reset so next user action creates a fresh engine

    setStems([]);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
  }, []);

  // Audio control methods
  const play = useCallback(() => {
    audioEngineRef.current?.play();
  }, []);

  const pause = useCallback(() => {
    audioEngineRef.current?.pause();
  }, []);

  const stop = useCallback(() => {
    audioEngineRef.current?.stop();
  }, []);

  const seek = useCallback((time: number) => {
    audioEngineRef.current?.seek(time);
  }, []);

  const setMasterVolume = useCallback((volume: number) => {
    audioEngineRef.current?.setMasterVolume(volume);
  }, []);

  // A) User changes a stem's volume slider
  const setStemVolume = useCallback((stemId: string, volume: number) => {
    // Update audio engine
    audioEngineRef.current?.setStemVolume(stemId, volume);
    // Update state
    setStems(prev => prev.map(stem =>
      stem.id === stemId ? { ...stem, volume } : stem
    ));
  }, []);

  // B) Toggle mute on stem
  const setStemMuted = useCallback((stemId: string, muted: boolean) => {
    // Update audio engine (it handles audio.muted internally)
    audioEngineRef.current?.setStemMuted(stemId, muted);
    // Update state
    setStems(prev => prev.map(stem =>
      stem.id === stemId ? { ...stem, muted } : stem
    ));
  }, []);

  // C) Toggle solo on stem
  const setStemSolo = useCallback((stemId: string, solo: boolean) => {
    // Update audio engine (it handles muting other stems internally)
    audioEngineRef.current?.setStemSolo(stemId, solo);
    // Update state - only one stem can be soloed at a time
    setStems(prev => prev.map(stem => {
      if (stem.id === stemId) {
        return { ...stem, solo };
      } else {
        // Turn off solo for all other stems
        return { ...stem, solo: false };
      }
    }));
  }, []);

  return {
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
    stop,
    seek,
    setMasterVolume,
    setStemVolume,
    setStemMuted,
    setStemSolo
  };
};

export default useAudioStemsCreator;
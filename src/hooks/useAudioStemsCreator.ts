import { useState, useCallback, useRef, useEffect } from 'react';
import { AudioEngine, StemData } from '../lib/AudioEngine';

export interface Stem {
  id: string;
  name: string;
  instrument: string;
  file: File | string;
  audio: HTMLAudioElement;
  volume: number;
  muted: boolean;
  solo: boolean;
  color: string;
  icon: string;
}

const useAudioStemsCreator = () => {
  const [stems, setStems] = useState<Stem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioEngineRef = useRef<AudioEngine | null>(null);

  useEffect(() => {
    // Initialize audio engine
    audioEngineRef.current = new AudioEngine({
      onTimeUpdate: (time) => setCurrentTime(time),
      onPlayStateChange: (playing) => setIsPlaying(playing),
      onError: (error) => console.error('Audio engine error:', error)
    });

    return () => {
      audioEngineRef.current?.destroy();
    };
  }, []);

  const getInstrumentFromFileName = (fileName: string): { instrument: string; color: string; icon: string } => {
    const name = fileName.toLowerCase();

    if (name.includes('bass')) {
      return { instrument: 'bass', color: 'green', icon: 'bass' };
    } else if (name.includes('drum')) {
      return { instrument: 'drums', color: 'blue', icon: 'drums' };
    } else if (name.includes('vocal') || name.includes('voice')) {
      return { instrument: 'vocals', color: 'purple', icon: 'vocals' };
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
    if (!audioEngineRef.current) return [];

    setIsLoading(true);

    try {
      const newStems: Stem[] = [];

      for (const file of files) {
        const stemId = `${Date.now()}-${Math.random()}`;
        const stemData = await audioEngineRef.current.loadStem(stemId, file);
        const stem = convertStemDataToStem(stemData);
        newStems.push(stem);
      }

      setStems(newStems);
      setDuration(audioEngineRef.current.getDuration());
      setIsLoading(false);

      return newStems;
    } catch (error) {
      console.error('Failed to create stems from files:', error);
      setIsLoading(false);
      return [];
    }
  }, [convertStemDataToStem]);

  const createDemoStems = useCallback(async () => {
    setIsLoading(true);

    try {
      // Check if actual demo files exist, otherwise create mock stems
      const demoFilePaths = [
        './examples/demo-stems/Led Zeppelin - Ramble On - bass.mp3',
        './examples/demo-stems/Led Zeppelin - Ramble On - drums.mp3',
        './examples/demo-stems/Led Zeppelin - Ramble On - other.mp3',
        './examples/demo-stems/Led Zeppelin - Ramble On - vocals.mp3'
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

            if (audioEngineRef.current) {
              const stemId = `demo-${i}`;
              const stemData = await audioEngineRef.current.loadStem(stemId, file);
              const stem = convertStemDataToStem(stemData);
              newStems.push(stem);
              hasRealFiles = true;
            }
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
        setDuration(audioEngineRef.current?.getDuration() || 0);
      }

      setStems(newStems);
      setIsLoading(false);

      return newStems;
    } catch (error) {
      console.error('Failed to create demo stems:', error);
      setIsLoading(false);
      return [];
    }
  }, [convertStemDataToStem]);

  const clearStems = useCallback(() => {
    audioEngineRef.current?.destroy();

    // Reinitialize audio engine
    audioEngineRef.current = new AudioEngine({
      onTimeUpdate: (time) => setCurrentTime(time),
      onPlayStateChange: (playing) => setIsPlaying(playing),
      onError: (error) => console.error('Audio engine error:', error)
    });

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

  const setStemVolume = useCallback((stemId: string, volume: number) => {
    audioEngineRef.current?.setStemVolume(stemId, volume);
    setStems(prev => prev.map(stem =>
      stem.id === stemId ? { ...stem, volume } : stem
    ));
  }, []);

  const setStemMuted = useCallback((stemId: string, muted: boolean) => {
    audioEngineRef.current?.setStemMuted(stemId, muted);
    setStems(prev => prev.map(stem => {
      if (stem.id === stemId) {
        // If muting this track, turn off solo
        return { ...stem, muted, solo: muted ? false : stem.solo };
      }
      return stem;
    }));
  }, []);

  const setStemSolo = useCallback((stemId: string, solo: boolean) => {
    audioEngineRef.current?.setStemSolo(stemId, solo);

    // Update UI state: if soloing a track, turn off solo for all others
    setStems(prev => prev.map(stem => {
      if (stem.id === stemId) {
        // If soloing this track, turn off mute
        return { ...stem, solo, muted: solo ? false : stem.muted };
      } else {
        // If we're soloing the clicked track, turn off solo for all others
        // If we're un-soloing the clicked track, leave others as they are
        return { ...stem, solo: solo ? false : stem.solo };
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
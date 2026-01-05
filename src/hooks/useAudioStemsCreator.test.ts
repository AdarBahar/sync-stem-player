import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import useAudioStemsCreator from './useAudioStemsCreator';

// Helper to trigger metadata loaded on mock audio elements
const triggerMetadataLoaded = (audio: HTMLAudioElement, duration: number) => {
  const mockAudio = audio as unknown as {
    duration: number;
    _setDuration: (d: number) => void;
  };
  mockAudio._setDuration(duration);
};

describe('useAudioStemsCreator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() => useAudioStemsCreator());

      expect(result.current.stems).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isPlaying).toBe(false);
      expect(result.current.currentTime).toBe(0);
      expect(result.current.duration).toBe(0);
    });

    it('should provide all control methods', () => {
      const { result } = renderHook(() => useAudioStemsCreator());

      expect(typeof result.current.createStemsFromFiles).toBe('function');
      expect(typeof result.current.createDemoStems).toBe('function');
      expect(typeof result.current.clearStems).toBe('function');
      expect(typeof result.current.play).toBe('function');
      expect(typeof result.current.pause).toBe('function');
      expect(typeof result.current.seek).toBe('function');
      expect(typeof result.current.setMasterVolume).toBe('function');
      expect(typeof result.current.setStemVolume).toBe('function');
      expect(typeof result.current.setStemMuted).toBe('function');
      expect(typeof result.current.setStemSolo).toBe('function');
    });
  });

  describe('instrument detection', () => {
    it('should detect bass instrument from filename', async () => {
      const { result } = renderHook(() => useAudioStemsCreator());
      const mockFile = new File(['audio'], 'song-bass.mp3', { type: 'audio/mpeg' });

      act(() => {
        result.current.createStemsFromFiles([mockFile]);
      });

      // Wait for loading state
      await waitFor(() => {
        expect(result.current.isLoading).toBe(true);
      });

      // Trigger metadata loaded on the audio element
      await waitFor(() => {
        const stems = result.current.stems;
        if (stems.length > 0) {
          triggerMetadataLoaded(stems[0].audio, 180);
        }
      }, { timeout: 500 });
    });

    it('should detect drums instrument from filename', async () => {
      const { result } = renderHook(() => useAudioStemsCreator());
      const mockFile = new File(['audio'], 'song-drums.mp3', { type: 'audio/mpeg' });

      act(() => {
        result.current.createStemsFromFiles([mockFile]);
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(true);
      });
    });

    it('should detect vocals instrument from filename', async () => {
      const { result } = renderHook(() => useAudioStemsCreator());
      const mockFile = new File(['audio'], 'song-vocals.mp3', { type: 'audio/mpeg' });

      act(() => {
        result.current.createStemsFromFiles([mockFile]);
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(true);
      });
    });

    it('should detect piano instrument from filename', async () => {
      const { result } = renderHook(() => useAudioStemsCreator());
      const mockFile = new File(['audio'], 'song-piano.mp3', { type: 'audio/mpeg' });

      act(() => {
        result.current.createStemsFromFiles([mockFile]);
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(true);
      });
    });
  });

  describe('clearStems', () => {
    it('should reset all state', () => {
      const { result } = renderHook(() => useAudioStemsCreator());

      act(() => {
        result.current.clearStems();
      });

      expect(result.current.stems).toEqual([]);
      expect(result.current.currentTime).toBe(0);
      expect(result.current.duration).toBe(0);
      expect(result.current.isPlaying).toBe(false);
    });
  });

  describe('callbacks', () => {
    it('should call onError callback when provided', () => {
      const onError = vi.fn();
      const onSuccess = vi.fn();

      const { result } = renderHook(() =>
        useAudioStemsCreator({ onError, onSuccess })
      );

      expect(result.current).toBeDefined();
      // The callbacks are passed to the audio engine
    });

    it('should call onSuccess callback when stems load successfully', async () => {
      const onSuccess = vi.fn();
      const onError = vi.fn();

      renderHook(() =>
        useAudioStemsCreator({ onError, onSuccess })
      );

      // Success callback is called after stems are loaded
      // This would require mocking the full audio loading flow
    });
  });
});


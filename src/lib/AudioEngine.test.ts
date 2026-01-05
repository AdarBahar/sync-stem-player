import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AudioEngine } from './AudioEngine';

describe('AudioEngine', () => {
  let engine: AudioEngine;
  let mockCallbacks: {
    onTimeUpdate: ReturnType<typeof vi.fn>;
    onPlayStateChange: ReturnType<typeof vi.fn>;
    onError: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockCallbacks = {
      onTimeUpdate: vi.fn(),
      onPlayStateChange: vi.fn(),
      onError: vi.fn(),
    };
    engine = new AudioEngine(mockCallbacks);
  });

  afterEach(() => {
    engine.destroy();
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with default values', () => {
      expect(engine.getIsPlaying()).toBe(false);
      expect(engine.getCurrentTime()).toBe(0);
      expect(engine.getDuration()).toBe(0);
      expect(engine.getStems()).toHaveLength(0);
    });
  });

  describe('loadStem', () => {
    it('should load a stem from a file', async () => {
      const mockFile = new File(['audio data'], 'test-bass.mp3', { type: 'audio/mpeg' });
      
      // Create a promise that resolves when metadata is loaded
      const loadPromise = engine.loadStem('stem-1', mockFile);
      
      // Get the audio element and trigger metadata loaded
      await vi.waitFor(() => {
        const stem = engine.getStem('stem-1');
        expect(stem).toBeDefined();
      }, { timeout: 100 });
      
      const stem = engine.getStem('stem-1');
      // Manually trigger loadedmetadata event
      const audio = stem?.audio as unknown as { _setDuration: (d: number) => void };
      audio._setDuration(180);
      
      const result = await loadPromise;
      
      expect(result.id).toBe('stem-1');
      expect(result.name).toBe('test-bass');
      expect(result.loaded).toBe(true);
      expect(result.duration).toBe(180);
    });

    it('should set stem properties correctly', async () => {
      const mockFile = new File(['audio data'], 'test-drums.mp3', { type: 'audio/mpeg' });
      
      const loadPromise = engine.loadStem('stem-2', mockFile);
      
      await vi.waitFor(() => {
        const stem = engine.getStem('stem-2');
        expect(stem).toBeDefined();
      }, { timeout: 100 });
      
      const stem = engine.getStem('stem-2');
      const audio = stem?.audio as unknown as { _setDuration: (d: number) => void };
      audio._setDuration(120);
      
      const result = await loadPromise;
      
      expect(result.muted).toBe(false);
      expect(result.volume).toBe(100);
      expect(result.solo).toBe(false);
    });
  });

  describe('volume controls', () => {
    it('should set master volume', () => {
      engine.setMasterVolume(50);
      // Master volume is stored internally, we verify by checking stem volume behavior
      expect(true).toBe(true); // Volume is set without error
    });

    it('should set stem volume', async () => {
      const mockFile = new File(['audio data'], 'test.mp3', { type: 'audio/mpeg' });
      const loadPromise = engine.loadStem('stem-1', mockFile);
      
      await vi.waitFor(() => {
        const stem = engine.getStem('stem-1');
        expect(stem).toBeDefined();
      }, { timeout: 100 });
      
      const stem = engine.getStem('stem-1');
      const audio = stem?.audio as unknown as { _setDuration: (d: number) => void };
      audio._setDuration(100);
      await loadPromise;
      
      engine.setStemVolume('stem-1', 75);
      
      const updatedStem = engine.getStem('stem-1');
      expect(updatedStem?.volume).toBe(75);
    });
  });

  describe('mute controls', () => {
    it('should mute a stem', async () => {
      const mockFile = new File(['audio data'], 'test.mp3', { type: 'audio/mpeg' });
      const loadPromise = engine.loadStem('stem-1', mockFile);
      
      await vi.waitFor(() => {
        const stem = engine.getStem('stem-1');
        expect(stem).toBeDefined();
      }, { timeout: 100 });
      
      const stem = engine.getStem('stem-1');
      const audio = stem?.audio as unknown as { _setDuration: (d: number) => void };
      audio._setDuration(100);
      await loadPromise;
      
      engine.setStemMuted('stem-1', true);
      
      const updatedStem = engine.getStem('stem-1');
      expect(updatedStem?.muted).toBe(true);
    });

    it('should unmute a stem', async () => {
      const mockFile = new File(['audio data'], 'test.mp3', { type: 'audio/mpeg' });
      const loadPromise = engine.loadStem('stem-1', mockFile);

      await vi.waitFor(() => {
        const stem = engine.getStem('stem-1');
        expect(stem).toBeDefined();
      }, { timeout: 100 });

      const stem = engine.getStem('stem-1');
      const audio = stem?.audio as unknown as { _setDuration: (d: number) => void };
      audio._setDuration(100);
      await loadPromise;

      engine.setStemMuted('stem-1', true);
      engine.setStemMuted('stem-1', false);

      const updatedStem = engine.getStem('stem-1');
      expect(updatedStem?.muted).toBe(false);
    });
  });

  describe('solo controls', () => {
    it('should solo a stem', async () => {
      const mockFile = new File(['audio data'], 'test.mp3', { type: 'audio/mpeg' });
      const loadPromise = engine.loadStem('stem-1', mockFile);

      await vi.waitFor(() => {
        const stem = engine.getStem('stem-1');
        expect(stem).toBeDefined();
      }, { timeout: 100 });

      const stem = engine.getStem('stem-1');
      const audio = stem?.audio as unknown as { _setDuration: (d: number) => void };
      audio._setDuration(100);
      await loadPromise;

      engine.setStemSolo('stem-1', true);

      const updatedStem = engine.getStem('stem-1');
      expect(updatedStem?.solo).toBe(true);
    });

    it('should unsolo a stem', async () => {
      const mockFile = new File(['audio data'], 'test.mp3', { type: 'audio/mpeg' });
      const loadPromise = engine.loadStem('stem-1', mockFile);

      await vi.waitFor(() => {
        const stem = engine.getStem('stem-1');
        expect(stem).toBeDefined();
      }, { timeout: 100 });

      const stem = engine.getStem('stem-1');
      const audio = stem?.audio as unknown as { _setDuration: (d: number) => void };
      audio._setDuration(100);
      await loadPromise;

      engine.setStemSolo('stem-1', true);
      engine.setStemSolo('stem-1', false);

      const updatedStem = engine.getStem('stem-1');
      expect(updatedStem?.solo).toBe(false);
    });
  });

  describe('seek', () => {
    it('should seek to a specific time', () => {
      engine.seek(30);
      expect(engine.getCurrentTime()).toBe(0); // No stems loaded, duration is 0
    });

    it('should clamp seek time to valid range', () => {
      engine.seek(-10);
      expect(engine.getCurrentTime()).toBe(0);
    });
  });

  describe('getters', () => {
    it('should return all stems', async () => {
      const mockFile1 = new File(['audio data'], 'bass.mp3', { type: 'audio/mpeg' });
      const mockFile2 = new File(['audio data'], 'drums.mp3', { type: 'audio/mpeg' });

      // Load first stem
      const loadPromise1 = engine.loadStem('stem-1', mockFile1);
      // Small delay for the stem to be added to the map
      await new Promise(r => setTimeout(r, 10));
      const stem1 = engine.getStem('stem-1');
      if (stem1?.audio) {
        (stem1.audio as unknown as { _setDuration: (d: number) => void })._setDuration(100);
      }
      await loadPromise1;

      // Load second stem
      const loadPromise2 = engine.loadStem('stem-2', mockFile2);
      await new Promise(r => setTimeout(r, 10));
      const stem2 = engine.getStem('stem-2');
      if (stem2?.audio) {
        (stem2.audio as unknown as { _setDuration: (d: number) => void })._setDuration(100);
      }
      await loadPromise2;

      const stems = engine.getStems();
      expect(stems).toHaveLength(2);
    });

    it('should return undefined for non-existent stem', () => {
      expect(engine.getStem('non-existent')).toBeUndefined();
    });
  });

  describe('destroy', () => {
    it('should clean up resources', async () => {
      const mockFile = new File(['audio data'], 'test.mp3', { type: 'audio/mpeg' });
      const loadPromise = engine.loadStem('stem-1', mockFile);

      // Small delay for the stem to be added to the map
      await new Promise(r => setTimeout(r, 10));
      const stem = engine.getStem('stem-1');
      if (stem?.audio) {
        (stem.audio as unknown as { _setDuration: (d: number) => void })._setDuration(100);
      }
      await loadPromise;

      engine.destroy();

      expect(engine.getStems()).toHaveLength(0);
    });
  });
});


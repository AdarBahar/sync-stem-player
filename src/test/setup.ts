import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test case
afterEach(() => {
  cleanup();
});

// Mock HTMLAudioElement
class MockAudioElement {
  src = '';
  volume = 1;
  muted = false;
  currentTime = 0;
  duration = 0;
  paused = true;
  preload = '';

  private listeners: Map<string, Set<EventListener>> = new Map();

  play() {
    this.paused = false;
    return Promise.resolve();
  }

  pause() {
    this.paused = true;
  }

  load() {}

  addEventListener(event: string, handler: EventListener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);
  }

  removeEventListener(event: string, handler: EventListener) {
    this.listeners.get(event)?.delete(handler);
  }

  // Helper to trigger events in tests
  _triggerEvent(event: string, data?: unknown) {
    this.listeners.get(event)?.forEach(handler => {
      handler(data as Event);
    });
  }

  // Simulate metadata loaded
  _setDuration(duration: number) {
    this.duration = duration;
    this._triggerEvent('loadedmetadata');
  }
}

// Mock Audio constructor globally - use a proper class
globalThis.Audio = MockAudioElement as unknown as typeof Audio;

// Mock URL.createObjectURL and revokeObjectURL
const originalURL = globalThis.URL;
vi.stubGlobal('URL', class extends originalURL {
  static createObjectURL = vi.fn(() => 'blob:mock-url');
  static revokeObjectURL = vi.fn();
});

// Mock AudioContext
class MockAudioContext {
  state = 'running';
  resume = vi.fn(() => Promise.resolve());
  close = vi.fn(() => Promise.resolve());
}

vi.stubGlobal('AudioContext', vi.fn(() => new MockAudioContext()));
vi.stubGlobal('webkitAudioContext', vi.fn(() => new MockAudioContext()));

// Export for use in tests
export { MockAudioElement };


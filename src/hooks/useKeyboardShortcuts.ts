import { useEffect, useCallback } from 'react';

interface KeyboardShortcutsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (time: number) => void;
  currentTime: number;
  duration: number;
  onMuteAll?: () => void;
  onUnmuteAll?: () => void;
}

const SEEK_AMOUNT = 5; // seconds

/**
 * Hook for handling keyboard shortcuts in the stem player
 * - Space: Play/Pause
 * - Arrow Left: Seek backward 5 seconds
 * - Arrow Right: Seek forward 5 seconds
 * - Home: Seek to start
 * - End: Seek to end
 */
const useKeyboardShortcuts = ({
  isPlaying,
  onPlay,
  onPause,
  onSeek,
  currentTime,
  duration,
}: KeyboardShortcutsProps) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      switch (event.code) {
        case 'Space':
          event.preventDefault();
          if (isPlaying) {
            onPause();
          } else {
            onPlay();
          }
          break;

        case 'ArrowLeft':
          event.preventDefault();
          onSeek(Math.max(0, currentTime - SEEK_AMOUNT));
          break;

        case 'ArrowRight':
          event.preventDefault();
          onSeek(Math.min(duration, currentTime + SEEK_AMOUNT));
          break;

        case 'Home':
          event.preventDefault();
          onSeek(0);
          break;

        case 'End':
          event.preventDefault();
          onSeek(duration);
          break;

        default:
          break;
      }
    },
    [isPlaying, onPlay, onPause, onSeek, currentTime, duration]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
};

export default useKeyboardShortcuts;


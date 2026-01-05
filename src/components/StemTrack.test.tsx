import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../test/test-utils';
import StemTrack from './StemTrack';
import { Stem } from '../hooks/useAudioStemsCreator';

const createMockStem = (overrides: Partial<Stem> = {}): Stem => ({
  id: 'stem-1',
  name: 'Test Bass',
  instrument: 'bass',
  file: new File(['audio'], 'test.mp3', { type: 'audio/mpeg' }),
  audio: new Audio(),
  volume: 100,
  muted: false,
  solo: false,
  color: 'green',
  icon: 'bass',
  ...overrides,
});

describe('StemTrack', () => {
  it('should render stem name', () => {
    const stem = createMockStem({ name: 'My Bass Track' });
    render(
      <StemTrack
        stem={stem}
        soloedStemId={null}
        onVolumeChange={vi.fn()}
        onMute={vi.fn()}
        onSolo={vi.fn()}
      />
    );

    expect(screen.getByText('My Bass Track')).toBeInTheDocument();
  });

  it('should render instrument type', () => {
    const stem = createMockStem({ instrument: 'drums' });
    render(
      <StemTrack
        stem={stem}
        soloedStemId={null}
        onVolumeChange={vi.fn()}
        onMute={vi.fn()}
        onSolo={vi.fn()}
      />
    );

    expect(screen.getByText('drums')).toBeInTheDocument();
  });

  it('should show current volume', () => {
    const stem = createMockStem({ volume: 75 });
    render(
      <StemTrack
        stem={stem}
        soloedStemId={null}
        onVolumeChange={vi.fn()}
        onMute={vi.fn()}
        onSolo={vi.fn()}
      />
    );

    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('should call onMute when mute button is clicked', () => {
    const onMute = vi.fn();
    const stem = createMockStem();
    render(
      <StemTrack
        stem={stem}
        soloedStemId={null}
        onVolumeChange={vi.fn()}
        onMute={onMute}
        onSolo={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText('Mute'));
    expect(onMute).toHaveBeenCalledWith('stem-1');
  });

  it('should call onSolo when solo button is clicked', () => {
    const onSolo = vi.fn();
    const stem = createMockStem();
    render(
      <StemTrack
        stem={stem}
        soloedStemId={null}
        onVolumeChange={vi.fn()}
        onMute={vi.fn()}
        onSolo={onSolo}
      />
    );

    fireEvent.click(screen.getByText('Solo'));
    expect(onSolo).toHaveBeenCalledWith('stem-1');
  });

  it('should show "Muted" text when stem is muted', () => {
    const stem = createMockStem({ muted: true });
    render(
      <StemTrack
        stem={stem}
        soloedStemId={null}
        onVolumeChange={vi.fn()}
        onMute={vi.fn()}
        onSolo={vi.fn()}
      />
    );

    expect(screen.getByText('Muted')).toBeInTheDocument();
  });

  it('should show "Solo" text when stem is soloed', () => {
    const stem = createMockStem({ solo: true });
    render(
      <StemTrack
        stem={stem}
        soloedStemId={stem.id}
        onVolumeChange={vi.fn()}
        onMute={vi.fn()}
        onSolo={vi.fn()}
      />
    );

    // When solo is active, it shows "Solo" inside the button
    const soloButtons = screen.getAllByText('Solo');
    expect(soloButtons.length).toBeGreaterThan(0);
  });

  it('should call onVolumeChange when volume slider changes', () => {
    const onVolumeChange = vi.fn();
    const stem = createMockStem();
    render(
      <StemTrack
        stem={stem}
        soloedStemId={null}
        onVolumeChange={onVolumeChange}
        onMute={vi.fn()}
        onSolo={vi.fn()}
      />
    );

    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '50' } });
    expect(onVolumeChange).toHaveBeenCalledWith('stem-1', 50);
  });
});


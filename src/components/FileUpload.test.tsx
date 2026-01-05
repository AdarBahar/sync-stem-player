import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../test/test-utils';
import FileUpload from './FileUpload';

describe('FileUpload', () => {
  it('should render the title', () => {
    render(
      <FileUpload onFilesSelected={vi.fn()} onPlayDemo={vi.fn()} />
    );

    expect(screen.getByText('Synchronized Stem Player')).toBeInTheDocument();
  });

  it('should render the demo button', () => {
    render(
      <FileUpload onFilesSelected={vi.fn()} onPlayDemo={vi.fn()} />
    );

    expect(screen.getByText('Try Demo Track')).toBeInTheDocument();
  });

  it('should call onPlayDemo when demo button is clicked', () => {
    const onPlayDemo = vi.fn();
    render(
      <FileUpload onFilesSelected={vi.fn()} onPlayDemo={onPlayDemo} />
    );

    fireEvent.click(screen.getByText('Try Demo Track'));
    expect(onPlayDemo).toHaveBeenCalled();
  });

  it('should render supported formats', () => {
    render(
      <FileUpload onFilesSelected={vi.fn()} onPlayDemo={vi.fn()} />
    );

    expect(screen.getByText('MP3')).toBeInTheDocument();
    expect(screen.getByText('WAV')).toBeInTheDocument();
    expect(screen.getByText('FLAC')).toBeInTheDocument();
  });

  it('should render upload button', () => {
    render(
      <FileUpload onFilesSelected={vi.fn()} onPlayDemo={vi.fn()} />
    );

    expect(screen.getByText('Select Audio Files')).toBeInTheDocument();
  });

  it('should render drag and drop zone', () => {
    render(
      <FileUpload onFilesSelected={vi.fn()} onPlayDemo={vi.fn()} />
    );

    expect(screen.getByText('Drop your stem files here')).toBeInTheDocument();
  });

  it('should handle file selection via input', () => {
    const onFilesSelected = vi.fn();
    render(
      <FileUpload onFilesSelected={onFilesSelected} onPlayDemo={vi.fn()} />
    );

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.accept).toBe('audio/*');
    expect(input.multiple).toBe(true);
  });

  it('should render feature cards', () => {
    render(
      <FileUpload onFilesSelected={vi.fn()} onPlayDemo={vi.fn()} />
    );

    expect(screen.getByText('Professional Controls')).toBeInTheDocument();
    expect(screen.getByText('Synchronized Playback')).toBeInTheDocument();
    expect(screen.getByText('Smart Detection')).toBeInTheDocument();
  });
});


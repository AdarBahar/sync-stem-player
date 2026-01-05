import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import ToastContainer from './ToastContainer';
import { ToastProvider, useToast } from '../contexts/ToastContext';

// Helper component to trigger toasts
const ToastTrigger = () => {
  const toast = useToast();
  return (
    <div>
      <button onClick={() => toast.success('Success message')}>Show Success</button>
      <button onClick={() => toast.error('Error message')}>Show Error</button>
      <button onClick={() => toast.warning('Warning message')}>Show Warning</button>
      <button onClick={() => toast.info('Info message')}>Show Info</button>
    </div>
  );
};

const renderWithToast = () => {
  return render(
    <ToastProvider>
      <ToastTrigger />
      <ToastContainer />
    </ToastProvider>
  );
};

describe('ToastContainer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('should not render when there are no toasts', () => {
    render(
      <ToastProvider>
        <ToastContainer />
      </ToastProvider>
    );

    // Container should not be in the DOM when empty
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should show success toast', () => {
    renderWithToast();

    fireEvent.click(screen.getByText('Show Success'));

    expect(screen.getByText('Success message')).toBeInTheDocument();
  });

  it('should show error toast', () => {
    renderWithToast();

    fireEvent.click(screen.getByText('Show Error'));

    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('should show warning toast', () => {
    renderWithToast();

    fireEvent.click(screen.getByText('Show Warning'));

    expect(screen.getByText('Warning message')).toBeInTheDocument();
  });

  it('should show info toast', () => {
    renderWithToast();

    fireEvent.click(screen.getByText('Show Info'));

    expect(screen.getByText('Info message')).toBeInTheDocument();
  });

  it('should remove toast when dismiss button is clicked', () => {
    renderWithToast();

    fireEvent.click(screen.getByText('Show Success'));
    expect(screen.getByText('Success message')).toBeInTheDocument();

    // Click dismiss button
    fireEvent.click(screen.getByLabelText('Dismiss'));

    expect(screen.queryByText('Success message')).not.toBeInTheDocument();
  });

  it('should auto-dismiss toast after duration', async () => {
    renderWithToast();

    fireEvent.click(screen.getByText('Show Success'));
    expect(screen.getByText('Success message')).toBeInTheDocument();

    // Fast forward time
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.queryByText('Success message')).not.toBeInTheDocument();
  });

  it('should show multiple toasts', () => {
    renderWithToast();

    fireEvent.click(screen.getByText('Show Success'));
    fireEvent.click(screen.getByText('Show Error'));

    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });
});


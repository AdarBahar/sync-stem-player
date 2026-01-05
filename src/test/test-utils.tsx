import { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ToastProvider } from '../contexts/ToastContext';

interface WrapperProps {
  children: ReactNode;
}

const AllTheProviders = ({ children }: WrapperProps) => {
  return <ToastProvider>{children}</ToastProvider>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { customRender as render };


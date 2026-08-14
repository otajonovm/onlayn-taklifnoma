'use client';

import { ThemeProvider } from '@/config/ThemeContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
